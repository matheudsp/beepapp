import { Card, Icon } from "@/components";
import { translate } from "@/i18n";
import type { Trip } from "@/models/Trip/Trip";
import { useAppTheme } from "@/utils/useAppTheme";
import { observer } from "mobx-react-lite";
import { useMemo } from "react";
import { Platform, type AccessibilityProps, type ImageSourcePropType,  Image, View, type TextStyle, type ViewStyle, type ImageStyle } from "react-native";
import { Text } from "@/components";
import { $styles, type ThemedStyle } from "@/theme";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";


const ICON_SIZE = 14

export const TripCard = observer(function TripCard({
  trip,
  onPress,
}: {
  trip: Trip
  onPress: () => void

}) {
  const {
    theme: { colors },
    themed,
  } = useAppTheme()
 

  const imageUri = useMemo<ImageSourcePropType>(
    () => trip.driver?.profile_image
      ? { uri: trip.driver.profile_image }
      : require("../../../assets/images/no-profile.png"),
    [trip.driver?.profile_image]
  );
  /**
   * Android has a "longpress" accessibility action. iOS does not, so we just have to use a hint.
   * @see https://reactnative.dev/docs/accessibility#accessibilityactions
   */
  const accessibilityHintProps = useMemo(
    () =>
      Platform.select<AccessibilityProps>({
        ios: {
          accessibilityLabel: translate("HomeScreen:accessibility.cardHint"),
          accessibilityHint: translate("HomeScreen:accessibility.cardHint"),
        },
        android: {
          accessibilityLabel: translate("HomeScreen:accessibility.cardHint"),
          accessibilityActions: [
            {
              name: "longpress",
              label: translate("HomeScreen:accessibility.cardHint"),
            },
          ],
          onAccessibilityAction: ({ nativeEvent }) => {
            if (nativeEvent.actionName === "longpress") {
              //  open the trip screen
            }
          },
        },
      }),
    [],
  )

  const handlePressCard = () => {
    onPress()
    
  }

  return (
    <Card
      style={themed($item)}
      verticalAlignment="force-footer-bottom"
      onPress={handlePressCard}
      onLongPress={handlePressCard}
      HeadingComponent={
        <View style={[$styles.row, themed($metadata)]}>
          <Text
            style={themed($metadataText)}
            size="lg"
            accessibilityLabel={trip.origin + ' → ' + trip.destination}
          >
            {trip.origin} → {trip.destination}
          </Text>

        </View>
      }
      // contentStyle={}
      ContentComponent={<View style={[$styles.row, { gap: 5, alignItems: 'center' }]}>
        <Icon
          icon="driver"
          color={colors.text}

          size={20}
          
        />
        <Text>
          {trip.driver?.first_name} {trip.driver?.last_name}
        </Text>
      </View>
      }

      {...accessibilityHintProps}
      RightComponent={<Image source={imageUri} style={themed($imageDriver)} />}
      FooterComponent={
        <View style={[$styles.row, themed($metadata)]}>

          <Text
            style={themed($metadataText)}
            size="xs"

          >
            Saída: {format(new Date(trip.departure), "dd/MM/yyyy HH:mm", { locale: ptBR }) + 'h'}
          </Text>
          <Text
            style={themed($metadataText)}
            accessibilityLabel={trip.seats.toString()}
            size="xs"

          >
            Vagas disponíveis: {trip.seats}
          </Text>

        </View>
      }
    />
  )
})


const $labelStyle: TextStyle = {
  textAlign: "left",
}

const $iconContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  height: ICON_SIZE,
  width: ICON_SIZE,
  marginEnd: spacing.sm,
})

const $metadata: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  color: colors.textDim,

})

const $metadataText: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  color: colors.textDim,
  marginEnd: spacing.md,

})


const $item: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  padding: spacing.md,
  margin: spacing.xl,
  minHeight: 120,
  backgroundColor: colors.palette.neutral100,
})

const $imageDriver: ThemedStyle<ImageStyle> = ({ spacing }) => ({
  borderRadius: 50,
  alignSelf: "center",
  width: 64,
  height: 64
})
