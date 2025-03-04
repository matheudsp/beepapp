import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "../helpers/withSetPropAction"

/**
 * User profile model
 */
export const ProfileModel = types
  .model("Profile")
  .props({
    id: types.identifier, // UUID
    email: types.maybeNull(types.string),
    first_name: types.string,
    last_name: types.string,
    profile_image: types.maybeNull(types.string),
    cpf: types.maybeNull(types.string),
    phone_number: types.maybeNull(types.string),
    role: types.maybeNull(types.enumeration("Role", ["DRIVER", "PASSENGER"]))
  })
  .actions(withSetPropAction)
  .views((profile) => ({
    get fullName() {
      return `${profile.first_name} ${profile.last_name}`;
    }
  }));

export interface Profile extends Instance<typeof ProfileModel> {}
export interface ProfileSnapshotOut extends SnapshotOut<typeof ProfileModel> {}
export interface ProfileSnapshotIn extends SnapshotIn<typeof ProfileModel> {}