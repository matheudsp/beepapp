import { observer } from "mobx-react-lite"
import { ComponentType, FC, useEffect, useMemo, useState } from "react"
import {
  AccessibilityProps,
  ActivityIndicator,
  Image,
  ImageSourcePropType,
  ImageStyle,
  Platform,
  TextStyle,
  View,
  ViewStyle,
  
} from "react-native"

import {
  Button,
  ButtonAccessoryProps,
  Card,
  EmptyState,
  Icon,
  ListView,
  Screen,
  
  Text,
  
  
} from "@/components"
import { isRTL, translate } from "@/i18n"
import { useStores } from "../../models"
import { Trip } from "../../models/Trip/Trip"
import { TabScreenProps } from "../../navigators/Navigator"
import type { ThemedStyle } from "@/theme"
import { $styles, colors } from "../../theme"
import { delay } from "../../utils/delay"
import { useAppTheme } from "@/utils/useAppTheme"
import Greeting from "@/components/Gretting"
import { useAuth } from "@/contexts/useAuth"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale/pt-BR"
import { CitySelector } from "./CitySelector"


const ICON_SIZE = 14

export const HomeScreen: FC<TabScreenProps<"Home">> = observer(
  function DriverListScreen(_props) {
    const { tripStore } = useStores()
    const { themed, theme: { colors } } = useAppTheme()
    const { user } = useAuth()
    const [refreshing, setRefreshing] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [actualLocation, setActualLocation] = useState("")
    const [destinationLocation, setDestinationLocation] = useState("")


    // initially, kick off a background refresh without the refreshing UI
    useEffect(() => {
      ; (async function load() {
        setIsLoading(true)
        await tripStore.fetchTrips()

        setIsLoading(false)
      })()
    }, [tripStore])

    // simulate a longer refresh, if the refresh is too fast for UX
    async function manualRefresh() {
      setRefreshing(true)
      await Promise.all([tripStore.fetchTrips(), delay(750)])
      setRefreshing(false)
    }



    const ButtonDateLeftAccessory: ComponentType<ButtonAccessoryProps> = useMemo(
      () =>
        function ButtonDateLeftAccessory(props: ButtonAccessoryProps) {
          return (
            <Icon
              icon="calendar"
              color={colors.text}
              containerStyle={props.style}
              size={20}
              onPress={() => { }}
            />
          )
        },
      [colors.text],
    )


    return (
      <Screen preset="fixed" safeAreaEdges={["top"]} contentContainerStyle={$styles.flex1}>

        <ListView<Trip>
          data={tripStore.tripsForList.slice()}
          extraData={ tripStore.trips.length}
          refreshing={refreshing}
          estimatedItemSize={177}
          onRefresh={manualRefresh}
          ListEmptyComponent={
            isLoading ? (
              <ActivityIndicator />
            ) : (
              <EmptyState
                preset="generic"
                style={themed($emptyState)}
                headingTx={
                  tripStore
                    ? "HomeScreen:noFavoritesEmptyState.heading"
                    : undefined
                }
                contentTx={
                  tripStore
                    ? "HomeScreen:noFavoritesEmptyState.content"
                    : undefined
                }
                button={tripStore ? "" : undefined}
                buttonOnPress={manualRefresh}
                imageStyle={$emptyStateImage}
                ImageProps={{ resizeMode: "contain" }}
              />
            )
          }
          ListHeaderComponent={
            <>
              <View style={themed($heading)}>
                <View style={[$styles.row, { display: 'flex', justifyContent: 'space-between', alignItems: "center" }]}>
                  <Text preset="heading" style={themed($greeting)} tx={Greeting()} />

                  <Image source={user?.image ? { uri: user.image } : require("../../../assets/images/no-profile.png")} style={themed($itemProfileImage)} />


                </View>

                <View style={themed($search)}>
                  <CitySelector
                    value={actualLocation}
                    onChangeText={setActualLocation}
                    labelTx="HomeScreen:actualLocationFieldLabel"
                    placeholderTx="HomeScreen:actualLocationFieldPlaceholder"
                  />
                  <CitySelector
                    value={destinationLocation}
                    onChangeText={setDestinationLocation}
                    labelTx="HomeScreen:destinationLocationFieldLabel"
                    placeholderTx="HomeScreen:destinationLocationFieldPlaceholder"
                  />
                </View>

              </View>
              <View style={themed($dateSelector)}>
                <Text weight="bold" size="md" tx="HomeScreen:availableDates" />
                <View style={[$styles.row, { gap: 10 }]}>
                  <Button
                    onPress={() => { }}
                    onLongPress={() => { }}
                    style={themed([$dateButton])}
                    accessibilityLabel={
                      "HomeScreen:accessibility.todayDateButton"
                    }

                  >
                    <Text
                      size="xs"
                      accessibilityLabel={"HomeScreen:accessibility.todayDateButton"}
                      weight="bold"
                      tx={
                        "HomeScreen:todayDateButton"
                      }
                    />
                  </Button>

                  <Button
                    onPress={() => { }}
                    onLongPress={() => { }}
                    style={themed([$dateButton])}
                    accessibilityLabel={
                      "HomeScreen:accessibility.tomorrowDateButton"
                    }

                  >
                    <Text
                      size="xs"
                      accessibilityLabel={"HomeScreen:accessibility.tomorrowDateButton"}
                      weight="bold"
                      tx={
                        "HomeScreen:tomorrowDateButton"
                      }
                    />
                  </Button>
                  <Button
                    onPress={() => { }}
                    onLongPress={() => { }}
                    style={[themed([$dateButton]), { gap: 5 }]}
                    accessibilityLabel={
                      "HomeScreen:accessibility.otherDateButton"
                    }
                    LeftAccessory={ButtonDateLeftAccessory}
                  >
                    <Text
                      size="xs"
                      accessibilityLabel={"HomeScreen:accessibility.otherDateButton"}
                      weight="bold"
                      tx={
                        "HomeScreen:otherDateButton"
                      }
                    />
                  </Button>
                </View>
              </View>
            </>
          }
          renderItem={({ item }) => (
            <>

              <TripCard
                trip={item}
                onPress={() => {}}
              />
            </>

          )}
        />
      </Screen>
    )
  },
)

const TripCard = observer(function TripCard({
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
          onPress={() => { }}
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

// #region Styles


const $greeting: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.text,

})
const $heading: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  marginBottom: spacing.lg,
  backgroundColor: colors.palette.primary,
  paddingHorizontal: spacing.xl,
  paddingVertical: spacing.xl
})

const $dateSelector: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingHorizontal: spacing.xl,

})

const $itemProfileImage: ThemedStyle<ImageStyle> = ({ }) => ({
  width: 44,
  height: 44
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

const $search: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginTop: spacing.md,
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



const $dateButton: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  borderRadius: 17,
  marginTop: spacing.md,
  justifyContent: "space-between",
  alignItems: 'center',
  borderColor: colors.palette.neutral300,
  paddingHorizontal: spacing.lg,
  paddingTop: spacing.xxxs,
  paddingBottom: 0,
  minHeight: 32,
  alignSelf: "flex-start",
})



const $emptyState: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginTop: spacing.xxl,
})

const $emptyStateImage: ImageStyle = {
  transform: [{ scaleX: isRTL ? -1 : 1 }],
}
// #endregion
