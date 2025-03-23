import { BottomTabScreenProps, createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { CompositeScreenProps } from "@react-navigation/native"
import { TextStyle, ViewStyle } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Icon } from "../components"
import { translate } from "@/i18n"
import { AccountScreen } from "../screens"
import { HomeScreen } from "../screens/HomeScreen/HomeScreen"
import { DriverScreen } from "../screens"
import type { ThemedStyle } from "@/theme"
import { AppStackParamList, AppStackScreenProps } from "./AppNavigator"
import { useAppTheme } from "@/utils/useAppTheme"

export type TabParamList = {
  Showroom: { queryIndex?: string; itemIndex?: string }
  Account: undefined
  Home: undefined,
  Driver: undefined,

}

/**
 * Helper for automatically generating navigation prop types for each route.
 *
 * More info: https://reactnavigation.org/docs/typescript/#organizing-types
 */
export type TabScreenProps<T extends keyof TabParamList> = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, T>,
  AppStackScreenProps<keyof AppStackParamList>
>

const Tab = createBottomTabNavigator<TabParamList>()

/**
 * This is the main navigator for the  screens with a bottom tab bar.
 * Each tab is a stack navigator with its own set of screens.
 *
 * More info: https://reactnavigation.org/docs/bottom-tab-navigator/
 * @returns {JSX.Element} The rendered `Navigator`.
 */
export function Navigator() {
  const { bottom } = useSafeAreaInsets()
  const {
    themed,
    theme: { colors },
  } = useAppTheme()

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: themed([$tabBar, { height: bottom + 70, borderTopWidth:1, marginBottom:10, borderTopColor: colors.tint }]),
        tabBarActiveTintColor: colors.text,
        tabBarInactiveTintColor: colors.text,
        tabBarLabelStyle: themed($tabBarLabel),
        tabBarItemStyle: themed($tabBarItem),
        
      }}
    >


      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarAccessibilityLabel: translate("Navigator:homeTab"),
          tabBarLabel: translate("Navigator:homeTab"),
          tabBarIcon: ({ focused }) => (
            <Icon icon="home" color={focused ? colors.tint : colors.tintInactive} size={30} />
          ),
        }}
      />
      <Tab.Screen
        name="Driver"
        component={DriverScreen}
        options={{
          tabBarAccessibilityLabel: translate("Navigator:driverTab"),
          tabBarLabel: translate("Navigator:driverTab"),
          tabBarIcon: ({ focused }) => (
            <Icon icon="add" color={focused ? colors.tint : colors.tintInactive} size={30} />
          ),
        }}
      />
      <Tab.Screen
        name="Account"
        component={AccountScreen}
        options={{
          tabBarAccessibilityLabel: translate("Navigator:accountTab"),
          tabBarLabel: translate("Navigator:accountTab"),
          tabBarIcon: ({ focused }) => (
            <Icon icon="account" color={focused ? colors.tint : colors.tintInactive} size={30} />
          ),
        }}
      />

    </Tab.Navigator>
  )
}

const $tabBar: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.background,
  borderTopColor: colors.transparent,
})

const $tabBarItem: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingTop: spacing.md,
})

const $tabBarLabel: ThemedStyle<TextStyle> = ({ colors, typography }) => ({
  fontSize: 12,
  fontFamily: typography.primary.medium,
  lineHeight: 16,
  color: colors.text,
})
