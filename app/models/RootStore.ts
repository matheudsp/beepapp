// app/models/RootStore.ts
import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { AuthenticationStoreModel } from "./AuthenticationStore"
import { TripStoreModel } from "./Trip/TripStore"
import { ProfileStoreModel } from "./Profile/ProfileStore"
import { BookingStoreModel } from "./Booking/BookingStore"

export const RootStoreModel = types.model("RootStore").props({
  authenticationStore: types.optional(AuthenticationStoreModel, {}),
  tripStore: types.optional(TripStoreModel, {
    trips: [],
    isLoading: false,
    searchParams: {
      origin: "",
      destination: "",
      departureDate: ""
    }
  }),
  profileStore: types.optional(ProfileStoreModel, {
    profiles: [],
    isLoading: false
  }),
  bookingStore: types.optional(BookingStoreModel, {
    bookings: [],
    isLoading: false
  })
})

export interface RootStore extends Instance<typeof RootStoreModel> {}
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {}