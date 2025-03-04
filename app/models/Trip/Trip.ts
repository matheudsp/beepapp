import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "../helpers/withSetPropAction"
import { formatDate } from "@/utils/formatDate"
import { translate } from "@/i18n"
import { ProfileModel } from "../Profile/Profile"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale/pt-BR"

/**
 * Trip model representing a driver's trip offering
 */
export const TripModel = types
  .model("Trip")
  .props({
    id: types.identifier, // UUID
    departure: types.string, // Data e hora da saída
    origin: types.string,
    destination: types.string,
    seats: types.number,
    driver: types.reference(types.late(() => ProfileModel)),
    created_at: types.optional(types.string, () => new Date().toISOString()),
    updated_at: types.optional(types.string, () => new Date().toISOString())
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
    
    get formattedDeparture() {
      return format(new Date(trip.departure), "dd/MM/yyyy HH:mm", { locale: ptBR }) + 'h';
    },
    
    get formattedRoute() {
      return `${trip.origin} → ${trip.destination}`;
    }
  }));
  
export interface Trip extends Instance<typeof TripModel> {}
export interface TripSnapshotOut extends SnapshotOut<typeof TripModel> {}
export interface TripSnapshotIn extends SnapshotIn<typeof TripModel> {}