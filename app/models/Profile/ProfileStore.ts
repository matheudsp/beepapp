import { Instance, SnapshotOut, types } from "mobx-state-tree";
import {  ProfileModel } from "./Profile";
import { withSetPropAction } from "../helpers/withSetPropAction";
import { profileService } from "@/services/supabase/queries/profiles"; // You'll need to create this service

export const ProfileStoreModel = types
  .model("ProfileStore")
  .props({
    currentProfile: types.maybeNull(types.reference(ProfileModel)),
    profiles: types.array(ProfileModel)
  })
  .actions(withSetPropAction)
  .actions((store) => ({
    /**
     * Fetch current user profile from Supabase
     */
    async fetchCurrentProfile() {
      try {
        const profile = await profileService.getCurrentProfile();
        if (profile) {
          // Add to profiles array if not already there
          const existingIndex = store.profiles.findIndex(p => p.id === profile.id);
          if (existingIndex >= 0) {
            store.profiles[existingIndex] = profile;
          } else {
            store.profiles.push(profile);
          }
          
          // Set as current profile
          store.setProp("currentProfile", profile);
        }
        return profile;
      } catch (error) {
        console.error("Error fetching current profile:", error);
        return null;
      }
    },

    /**
     * Fetch a specific profile by ID
     */
    async fetchProfileById(id: string) {
      try {
        const profile = await profileService.getProfileById(id);
        if (profile) {
          // Add to profiles array if not already there
          const existingIndex = store.profiles.findIndex(p => p.id === profile.id);
          if (existingIndex >= 0) {
            store.profiles[existingIndex] = profile;
          } else {
            store.profiles.push(profile);
          }
        }
        return profile;
      } catch (error) {
        console.error(`Error fetching profile with ID ${id}:`, error);
        return null;
      }
    }
  }))
  .views((store) => ({
    /**
     * Check if current profile is a driver
     */
    get isDriver() {
      return store.currentProfile?.role === "DRIVER";
    },

    /**
     * Get profile by ID
     */
    getProfileById(id: string) {
      return store.profiles.find(profile => profile.id === id);
    }
  }));

export interface ProfileStore extends Instance<typeof ProfileStoreModel> {}
export interface ProfileStoreSnapshot extends SnapshotOut<typeof ProfileStoreModel> {}