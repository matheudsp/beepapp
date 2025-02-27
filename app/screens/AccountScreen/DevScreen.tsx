import { FC, useCallback, useMemo } from "react"
import * as Application from "expo-application"
import {
  LayoutAnimation,
  Platform,
  TextStyle,
  View,
  ViewStyle,
  type ImageStyle,
} from "react-native"
import { Button, Icon, ListItem, Screen, Text } from "../../components"
import { AppStackScreenProps } from "../../navigators"
import type { ThemedStyle } from "@/theme"
import { $styles } from "../../theme"
import { useAppTheme } from "@/utils/useAppTheme"
import React from "react"

/**
 * @param {string} url - The URL to open in the browser.
 * @returns {void} - No return value.
 */


const usingHermes = typeof HermesInternal === "object" && HermesInternal !== null

interface DevScreenProps extends AppStackScreenProps<"Dev"> { }

export const DevScreen: FC<DevScreenProps> = function DevScreen(
  _props,
) {
  const { setThemeContextOverride, themeContext, themed } = useAppTheme()

  const { navigation } = _props
  // @ts-expect-error
  const usingFabric = global.nativeFabricUIManager != null

  const Reactotron = useMemo(
    () => async () => {
      if (__DEV__) {
        console.tron.display({
          name: "DISPLAY",
          value: {
            appId: Application.applicationId,
            appName: Application.applicationName,
            appVersion: Application.nativeApplicationVersion,
            appBuildVersion: Application.nativeBuildVersion,
            hermesEnabled: usingHermes,
          },
          important: true,
        })
      }
    },
    [],
  )

  const toggleTheme = useCallback(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut) // Animate the transition
    setThemeContextOverride(themeContext === "dark" ? "light" : "dark")
  }, [themeContext, setThemeContextOverride])


  const resetTheme = useCallback(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    setThemeContextOverride(undefined)
  }, [setThemeContextOverride])

  return (
    <Screen
      preset="scroll"
      safeAreaEdges={["top"]}
      contentContainerStyle={[$styles.container, themed($container)]}
    >

      <View style={themed($hstack)} >
        <Icon style={themed($buttonIcon)} icon="back" onPress={() => { navigation.goBack() }} />
        <Text preset="heading" text="Developer Options" />
      </View>

      <Button onPress={resetTheme} text={`Reset theme`} />
      <View style={themed($itemsContainer)}>
        <Button onPress={toggleTheme} text={`Switch Theme: ${themeContext}`} />
      </View>

      <View style={themed($buttonContainer)}>
        <Button style={themed($button)} tx="AccountScreen:reactotron" onPress={Reactotron} />
        <Text style={themed($hint)} tx={`AccountScreen:${Platform.OS}ReactotronHint` as const} />
      </View>

      <View style={themed($itemsContainer)}>

        <ListItem
          LeftComponent={
            <View style={themed($item)}>
              <Text preset="bold" tx="AccountScreen:appVersion" />
              <Text>{Application.nativeApplicationVersion}</Text>
            </View>
          }
        />

        <ListItem
          LeftComponent={
            <View style={themed($item)}>
              <Text preset="bold">App Id</Text>
              <Text>{Application.applicationId}</Text>
            </View>
          }
        />
        <ListItem
          LeftComponent={
            <View style={themed($item)}>
              <Text preset="bold">App Name</Text>
              <Text>{Application.applicationName}</Text>
            </View>
          }
        />

        <ListItem
          LeftComponent={
            <View style={themed($item)}>
              <Text preset="bold">App Build Version</Text>
              <Text>{Application.nativeBuildVersion}</Text>
            </View>
          }
        />
        <ListItem
          LeftComponent={
            <View style={themed($item)}>
              <Text preset="bold">Hermes Enabled</Text>
              <Text>{String(usingHermes)}</Text>
            </View>
          }
        />
        <ListItem
          LeftComponent={
            <View style={themed($item)}>
              <Text preset="bold">Fabric Enabled</Text>
              <Text>{String(usingFabric)}</Text>
            </View>
          }
        />


      </View>


    </Screen>
  )
}

const $container: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingBottom: spacing.xxl,
})

const $title: ThemedStyle<TextStyle> = ({ spacing }) => ({
  marginBottom: spacing.xxl,

})

const $buttonIcon: ThemedStyle<ImageStyle> = ({ spacing }) => ({
  padding: spacing.md,
  display: 'flex',
  alignContent: 'center',
  alignItems: "center",

})

const $hstack: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  display: "flex",
  flexDirection: "row",
  alignItems: 'center',
  gap: spacing.md,
  marginBottom: spacing.xl
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
