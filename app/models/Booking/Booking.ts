// app/models/Booking/Booking.ts
import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "../helpers/withSetPropAction"
import { ProfileModel } from "../Profile/Profile"
import { TripModel } from "../Trip/Trip"

export const BookingModel = types
  .model("Booking")
  .props({
    id: types.identifier,
    trip_id: types.string,
    trip: types.maybeNull(types.reference(types.late(() => TripModel))),
    passenger_id: types.string,
    passenger: types.maybeNull(types.reference(types.late(() => ProfileModel))),
    pickup_point: types.string,
    dropoff_point: types.string,
    status: types.enumeration("BookingStatus", ["PENDING", "CONFIRMED", "CANCELED"]),
    created_at: types.optional(types.string, () => new Date().toISOString()),
    updated_at: types.optional(types.string, () => new Date().toISOString())
  })
  .actions(withSetPropAction)
  .views((booking) => ({
    get isPending() {
      return booking.status === "PENDING"
    },
    
    get isConfirmed() {
      return booking.status === "CONFIRMED"
    },
    
    get isCanceled() {
      return booking.status === "CANCELED"
    },
    
    get passengerName() {
      return booking.passenger ? booking.passenger.fullName : "Unknown passenger"
    }
  }))

export interface Booking extends Instance<typeof BookingModel> {}
export interface BookingSnapshotOut extends SnapshotOut<typeof BookingModel> {}
export interface BookingSnapshotIn extends SnapshotIn<typeof BookingModel> {}