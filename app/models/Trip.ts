import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"
import { formatDate } from "../utils/formatDate"
import { translate } from "@/i18n"

interface Enclosure {
  link: string
  type: string
  length: number
  duration: number
  rating: { scheme: string; value: string }
}

/**
 * This represents an trip of React Native Radio.
 */
export const TripModel = types
  .model("Trip")
  .props({
    id: types.identifier, // UUID
    departure: types.string, // Data e hora da saída
    origin: types.string,
    destination: types.string,
    seats: types.number,
    driver: types.model({
      firstName: types.string,
      profileImage: types.maybeNull(types.string), // Pode ser null
    }),
  })
  .actions(withSetPropAction)
  .views((trip) => ({
    get datePublished() {
      try {
        const formatted = formatDate(trip.departure);
        return {
          textLabel: formatted,
          accessibilityLabel: translate("HomeScreen:accessibility.publishLabel", {
            date: formatted,
          }),
        };
      } catch {
        return { textLabel: "", accessibilityLabel: "" };
      }
    },
  }));
  
export interface Trip extends Instance<typeof TripModel> {}
export interface TripSnapshotOut extends SnapshotOut<typeof TripModel> {}
export interface TripSnapshotIn extends SnapshotIn<typeof TripModel> {}
