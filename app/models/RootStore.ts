import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { AuthenticationStoreModel } from "./AuthenticationStore"
import { TripStoreModel } from "./Trip/TripStore"
import { ProfileStoreModel } from "./Profile/ProfileStore"

/**
 * A RootStore model.
 */
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
  profileStore: types.optional(ProfileStoreModel, {}),
})

/**
 * The RootStore instance.
 */
export interface RootStore extends Instance<typeof RootStoreModel> {}
/**
 * The data of a RootStore.
 */
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {}
