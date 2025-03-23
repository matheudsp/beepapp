import { observer } from "mobx-react-lite"
import { FC } from "react"
import { Image, ImageStyle, TextStyle, View, ViewStyle } from "react-native"
import { Button, Text, Screen, Icon } from "@/components"
import { isRTL } from "@/i18n"
import { useStores } from "@/models"
import { $styles, type ThemedStyle } from "@/theme"

import { useAppTheme } from "@/utils/useAppTheme"

import type { TabScreenProps } from "@/navigators/Navigator"
import type { AppStackScreenProps } from "@/navigators"


interface TripScreenProps extends AppStackScreenProps<"Trip"> { }
export const TripScreen: FC<TripScreenProps> = observer(
  function TripListScreen(_props) {
    const { themed, theme:{colors} } = useAppTheme()

    const { navigation } = _props
    // const {
    //   authenticationStore: { logout },
    // } = useStores()





    return (
      <Screen preset="scroll"
        safeAreaEdges={["top"]}
        contentContainerStyle={[$styles.container, themed($container)]}>
        <View style={$styles.flexRowCenter}>
          <Icon icon="back" />
          <Text style={themed($title)} preset="heading" tx="TripScreen:title" />
        </View>

        <Button style={themed($ctaButton)} textStyle={themed($ctaText)} tx="TripScreen:getRide"  />
      </Screen>
    )
  })


const $title: ThemedStyle<TextStyle> = ({ spacing }) => ({
  marginBottom: spacing.xxl,
})

const $ctaButton: ThemedStyle<ViewStyle> = ({ spacing ,colors}) => ({
  backgroundColor:colors.palette.primary,
  border:0,
  
  
})

const $ctaText: ThemedStyle<TextStyle> = ({ spacing ,colors}) => ({
  fontSize:spacing.lg,
  fontWeight:'600'
  
})



const $container: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingBottom: spacing.xxl,
})

