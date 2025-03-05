import { ComponentType } from "react"
import { TouchableOpacity, TouchableOpacityProps, View, ViewProps, ViewStyle, type StyleProp } from "react-native"
import { useAppTheme } from "@/utils/useAppTheme"
import { IconType } from "react-icons" 
import { 
  FaBell, FaCheck, FaHeart, FaLock, FaBars, FaTimes, 
  FaArrowLeft, FaArrowRight, FaRegEye, FaRegEyeSlash 
} from "react-icons/fa"
import { MdNavigateNext } from "react-icons/md";
import { IoCalendarNumberOutline, IoPersonOutline } from "react-icons/io5"
import { GoHome } from "react-icons/go";
import { GiFullMotorcycleHelmet } from "react-icons/gi";
export type IconTypes = keyof typeof iconRegistry

interface IconProps extends TouchableOpacityProps {
  icon: IconTypes
  color?: string
  size?: number
  containerStyle?: StyleProp<ViewStyle>
  onPress?: TouchableOpacityProps["onPress"]
}

export function Icon(props: IconProps) {
  const {
    icon,
    color,
    size = 24,
    containerStyle: $containerStyleOverride,
    ...WrapperProps
  } = props

  const isPressable = !!WrapperProps.onPress
  const Wrapper = (isPressable ? TouchableOpacity : View) as ComponentType<TouchableOpacityProps | ViewProps>

  const { theme } = useAppTheme()
  const IconComponent = iconRegistry[icon] as IconType | undefined

  // ⚠️ Se o ícone não for encontrado, evita erro de renderização
  if (!IconComponent) {
    console.error(`Icon "${icon}" not found in iconRegistry`)
    return null
  }

  return (
    <Wrapper
      accessibilityRole={isPressable ? "imagebutton" : undefined}
      {...WrapperProps}
      style={$containerStyleOverride}
    >
      <IconComponent size={size} color={color ?? theme.colors.text} />
    </Wrapper>
  )
}

export const iconRegistry = {
  back: FaArrowLeft,
  bell: FaBell,
  caretLeft: FaArrowLeft,
  caretRight: FaArrowRight,
  check: FaCheck,
  heart: FaHeart,
  lock: FaLock,
  menu: FaBars,
  x: FaTimes,
  view: FaRegEye,
  hidden: FaRegEyeSlash,
  calendar: IoCalendarNumberOutline,
  home: GoHome,
  account: IoPersonOutline,
  driver:GiFullMotorcycleHelmet,
  next: MdNavigateNext
}
