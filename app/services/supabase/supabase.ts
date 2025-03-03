import Config from "app/config"
import { createClient } from "@supabase/supabase-js"
import * as storage from '../../utils/storage'
import { AppState } from "react-native"

// Create a wrapper to supabase understand MMKV functions
const supabaseStorage = {
  getItem: (key: string) => Promise.resolve(storage.loadString(key) ?? null),
  setItem: (key: string, value: string) => {
    storage.saveString(key, value)
    return Promise.resolve()
  },
  removeItem: (key: string) => {
    storage.remove(key)
    return Promise.resolve()
  }
}


export const supabase = createClient(
  Config.supabaseUrl,
  Config.supabaseAnonKey,
  {
    auth: {
      storage: supabaseStorage,
      autoRefreshToken: true,
      detectSessionInUrl: false,
    },
  }
)

export { type Session, type AuthError } from "@supabase/supabase-js"

/**
 * Tells Supabase to autorefresh the session while the application
 * is in the foreground. (Docs: https://supabase.com/docs/reference/javascript/auth-startautorefresh)
 */
AppState.addEventListener("change", (nextAppState) => {
  if (nextAppState === "active") {
    supabase.auth.startAutoRefresh()
  } else {
    supabase.auth.stopAutoRefresh()
  }
})