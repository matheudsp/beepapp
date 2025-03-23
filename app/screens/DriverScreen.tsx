import { observer } from "mobx-react-lite"
import { FC } from "react"
import { Image, ImageStyle, TextStyle, View, ViewStyle } from "react-native"
import { Button, Text, Screen } from "@/components"
import { isRTL } from "@/i18n"
import { useStores } from "../models"
import { $styles, type ThemedStyle } from "@/theme"

import { useAppTheme } from "@/utils/useAppTheme"

import type { TabScreenProps } from "@/navigators/Navigator"



export const DriverScreen: FC<TabScreenProps<"Driver">> = observer(
  function DriverListScreen(_props) {
  const { themed, theme } = useAppTheme()

  const { navigation } = _props
  // const {
  //   authenticationStore: { logout },
  // } = useStores()





  return (
    <Screen preset="scroll"
    safeAreaEdges={["top"]}
    contentContainerStyle={[$styles.container, themed($container)]}>
      <Text style={themed($title)} preset="heading" tx="DriverScreen:title" />
      
    
    </Screen>
  )
})


const $title: ThemedStyle<TextStyle> = ({ spacing }) => ({
  marginBottom: spacing.xxl,
})
const $container: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingBottom: spacing.xxl,
})

