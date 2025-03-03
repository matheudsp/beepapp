import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useState,
} from "react"
import { Session, supabase } from "../services/supabase/supabase"
import { AuthResponse, AuthTokenResponsePassword, User } from "@supabase/supabase-js"
import * as Toast from 'burnt'


type AuthState = {
  isAuthenticated: boolean
  token?: Session["access_token"]
  user?: User & { image?: string };
}

type SignInProps = {
  email: string
  password: string
}

type SignUpProps = {
  email: string
  password: string,
  firstName: string,
  lastName: string,
}

type AuthContextType = {
  signIn: (props: SignInProps) => Promise<AuthTokenResponsePassword>
  signUp: (props: SignUpProps) => Promise<AuthResponse>
  signOut: () => void,
} & AuthState

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  token: undefined,
  user: undefined,
  signIn: () => new Promise(() => ({})),
  signUp: () => new Promise(() => ({})),
  signOut: () => undefined,
})

export function useAuth() {
  const value = useContext(AuthContext)

  if (__DEV__) {
    if (!value) {
      throw new Error("useAuth must be used within an AuthProvider")
    }
  }

  return value
}

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [token, setToken] = useState<AuthState["token"]>(undefined)
  const [user, setUser] = useState<AuthState["user"]>(undefined);

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("image")
      .eq("user_id", userId)
      .single();

    if (error) {
      Toast.toast({
        title:"Erro ao buscar perfil",
        preset:"error",
        message: error.message,
        haptic: 'error',
        duration:2,
        shouldDismissByDrag:true,
        from:'bottom'
      })
      return null;
    }

    return data;
  };

  const signIn = useCallback(
    async ({ email, password }: SignInProps) => {

      const result = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (result.error) {
        Toast.toast({
          title: "Erro ao acessar!",
          preset: "error",
          message: result.error.message,
          haptic: "error",
          duration: 2,
          shouldDismissByDrag: true,
          from: "bottom",
        })
        return result
      }
      const session = result.data?.session;
      if (session?.access_token) {
        setToken(session.access_token)

        const {data} = await supabase.auth.getUser();
        if(data){
          const profile = await fetchProfile(data.user?.id!)
          setUser({...user!, image:profile?.image!})
        }
      }
        

      return result
    },
    [supabase]
  )

  const signUp = useCallback(
    async ({ email, password, firstName, lastName }: SignUpProps) => {
      const result = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            email_verified: true,
          }
        }
      })

      if (result.data?.session?.access_token) {
        setToken(result.data.session.access_token)
      }

      return result
    },
    [supabase]
  )

  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
    setToken(undefined)
    setUser(undefined)
  }, [supabase])

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!token,
        user,
        token,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}