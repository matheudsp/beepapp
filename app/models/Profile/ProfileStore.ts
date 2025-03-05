// app/models/Profile/ProfileStore.ts
import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { ProfileModel } from "./Profile"
import { withSetPropAction } from "../helpers/withSetPropAction"
import { supabase } from "@/services/supabase/supabase"
import { profileService } from "@/services/supabase/queries/profiles"

export const ProfileStoreModel = types
  .model("ProfileStore")
  .props({
    currentProfile: types.maybeNull(types.reference(ProfileModel)),
    profiles: types.array(ProfileModel),
    isLoading: types.optional(types.boolean, false)
  })
  .actions(withSetPropAction)
  .actions((store) => ({
    async fetchCurrentProfile() {
      try {
        store.setProp("isLoading", true)
        
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return null
        
        const profile = await profileService.findById(user.id)
        if (!profile) return null
        
        const profileData = {
          id: profile.id,
          email: profile.email,
          first_name: profile.first_name,
          last_name: profile.last_name,
          profile_image: profile.profile_image ,
          cpf: null,
          phone_number: profile.phone_number,
          role: profile.role
        }
        
        // Update or add profile
        const existingIndex = store.profiles.findIndex(p => p.id === profile.id)
        if (existingIndex >= 0) {
          store.profiles[existingIndex] = profileData
        } else {
          store.profiles.push(profileData)
        }
        
        store.setProp("currentProfile", profile.id)
        return profile
      } catch (error) {
        console.error("Error fetching current profile:", error)
        return null
      } finally {
        store.setProp("isLoading", false)
      }
    },

    async fetchProfileById(id: string) {
      try {
        store.setProp("isLoading", true)
        const profile = await profileService.findById(id)
        if (!profile) return null
        
        const profileData = {
          id: profile.id,
          email: profile.email,
          first_name: profile.first_name,
          last_name: profile.last_name,
          profile_image: profile.profile_image,
          cpf: null,
          phone_number: profile.phone_number,
          role: profile.role
        }
        
        // Update or add profile
        const existingIndex = store.profiles.findIndex(p => p.id === profile.id)
        if (existingIndex >= 0) {
          store.profiles[existingIndex] = profileData
        } else {
          store.profiles.push(profileData)
        }
        
        return profile
      } catch (error) {
        console.error(`Error fetching profile with ID ${id}:`, error)
        return null
      } finally {
        store.setProp("isLoading", false)
      }
    }
  }))
  .views((store) => ({
    get isDriver() {
      return store.currentProfile?.role === "DRIVER"
    },
    
    getProfileById(id: string) {
      return store.profiles.find(profile => profile.id === id)
    }
  }))