import { FC, useCallback, useEffect, useMemo, useState } from "react"
import * as Application from "expo-application"
import {
  LayoutAnimation,
  Linking,
  Platform,
  TextStyle,
  useColorScheme,
  View,
  ViewStyle,
} from "react-native"
import { Button, ListItem, Screen, Text } from "../../components"
import { TabScreenProps } from "../../navigators/Navigator"
import type { ThemedStyle } from "@/theme"
import { $styles } from "../../theme"
import { isRTL } from "@/i18n"
import { useStores } from "../../models"
import { useAppTheme } from "@/utils/useAppTheme"
import React from "react"
import { supabase } from "@/services/supabase/supabase"
import { Session } from '@supabase/supabase-js'
import { useAuth } from "@/contexts/useAuth"
function openLinkInBrowser(url: string) {
  Linking.canOpenURL(url).then((canOpen) => canOpen && Linking.openURL(url))
}

export const AccountScreen: FC<TabScreenProps<"Account">> = function AccountScreen(
  _props
) {
  const { setThemeContextOverride, themeContext, themed } = useAppTheme()
  const { signOut } = useAuth()
  const { navigation } = _props

  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState('')
  const [website, setWebsite] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])
  
  useEffect(() => {
    if (session) getProfile()
  }, [session])

  async function getProfile() {
    try {
      setLoading(true)
      if (!session?.user) throw new Error('No user on the session!')

      let { data, error, status } = await supabase
        .from('profiles')
        .select(`username, website, avatar_url`)
        .eq('id', session?.user.id)
        .single()
      if (error && status !== 406) {
        throw error
      }

      if (data) {
        setUsername(data.username)
        setWebsite(data.website)
        setAvatarUrl(data.avatar_url)
      }
    } catch (error) {
      if (error instanceof Error) {
        // Alert.alert(error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  async function updateProfile({
    username,
    website,
    avatar_url,
  }: {
    username: string
    website: string
    avatar_url: string
  }) {
    try {
      setLoading(true)
      if (!session?.user) throw new Error('No user on the session!')

      const updates = {
        id: session?.user.id,
        username,
        website,
        avatar_url,
        updated_at: new Date(),
      }

      let { error } = await supabase.from('profiles').upsert(updates)

      if (error) {
        throw error
      }
    } catch (error) {
      if (error instanceof Error) {
        // Alert.alert(error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  const toggleTheme = useCallback(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut) // Animate the transition
    setThemeContextOverride(themeContext === "dark" ? "light" : "dark")
  }, [themeContext, setThemeContextOverride])

  return (
    <Screen
      preset="scroll"
      safeAreaEdges={["top"]}
      contentContainerStyle={[$styles.container, themed($container)]}
    >
      <Text
        style={themed($reportBugsLink)}
        tx="AccountScreen:reportBugs"
        onPress={() => openLinkInBrowser("")}
      />

      <Text style={themed($title)} preset="heading" tx="AccountScreen:title" />

      <View style={themed($buttonContainer)}>
        {(__DEV__ && (<Button style={themed($button)} text="Developer Options (only for devs)" onPress={() => { navigation.navigate("Dev") }} />))}
        <Button style={themed($button)} tx="common:logOut" onPress={signOut} />
      </View>
      <ListItem
        LeftComponent={
          <View style={themed($item)}>
            <Text preset="bold" tx="AccountScreen:appVersion" />
            <Text>{Application.nativeApplicationVersion}</Text>
          </View>
        }
      />

    </Screen>
  )
}

const $container: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingBottom: spacing.xxl,
})

const $title: ThemedStyle<TextStyle> = ({ spacing }) => ({
  marginBottom: spacing.xxl,
})

const $reportBugsLink: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  color: colors.tint,
  marginBottom: spacing.lg,
  alignSelf: isRTL ? "flex-start" : "flex-end",
})

const $item: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.md,
})

const $itemsContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginVertical: spacing.xl,
})

const $button: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.xs,
})

const $buttonContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.md,
})

const $hint: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  color: colors.palette.neutral600,
  fontSize: 12,
  lineHeight: 15,
  paddingBottom: spacing.lg,
})
