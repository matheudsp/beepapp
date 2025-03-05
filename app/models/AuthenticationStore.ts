// app/models/AuthenticationStore.ts
import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { supabase } from "../services/supabase/supabase"
import { withSetPropAction } from "./helpers/withSetPropAction"

export const AuthenticationStoreModel = types
  .model("AuthenticationStore")
  .props({
    authToken: types.maybe(types.string),
    authEmail: "",
    isLoading: types.optional(types.boolean, false)
  })
  .views((store) => ({
    get isAuthenticated() {
      return !!store.authToken
    },
    get validationError() {
      if (store.authEmail.length === 0) return "can't be blank"
      if (store.authEmail.length < 6) return "must be at least 6 characters"
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(store.authEmail))
        return "must be a valid email address"
      return ""
    },
  }))
  .actions(withSetPropAction)
  .actions((store) => ({
    setAuthToken(value?: string) {
      store.authToken = value
    },
    setAuthEmail(value: string) {
      store.authEmail = value.replace(/ /g, "")
    },
    logout() {
      store.setProp("isLoading", true)
      supabase.auth.signOut()
        .then(() => {
          store.authToken = undefined
          store.authEmail = ""
        })
        .finally(() => {
          store.setProp("isLoading", false)
        })
    },
    async login(password: string) {
      try {
        store.setProp("isLoading", true)
        const { data, error } = await supabase.auth.signInWithPassword({
          email: store.authEmail,
          password,
        })
        
        if (error) throw error
        
        store.setProp("authEmail",(data.session?.access_token))
        return { success: true }
      } catch (error) {
        console.error("Login error:", error)
        return { success: false, error }
      } finally {
        store.setProp("isLoading", false)
      }
    }
  }))