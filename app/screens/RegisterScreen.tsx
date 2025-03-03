import { observer } from "mobx-react-lite"
import { ComponentType, FC, useEffect, useMemo, useRef, useState } from "react"
import { TextInput, TextStyle, ViewStyle } from "react-native"
import { Button, Icon, Screen, Text, TextField, TextFieldAccessoryProps } from "../components"
import { useStores } from "../models"
import { AppStackScreenProps } from "../navigators"
import type { ThemedStyle } from "@/theme"
import { useAppTheme } from "@/utils/useAppTheme"
import { useAuth } from "@/contexts/useAuth"


interface RegisterScreenProps extends AppStackScreenProps<"Register"> { }

export const RegisterScreen: FC<RegisterScreenProps> = observer(function RegisterScreen(_props) {
  const authPasswordInput = useRef<TextInput>(null)
  const { signIn } = useAuth()
  const [authPassword, setAuthPassword] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [isAuthPasswordHidden, setIsAuthPasswordHidden] = useState(true)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [attemptsCount, setAttemptsCount] = useState(0)
  const {
    authenticationStore: { authEmail, setAuthEmail, validationError },
  } = useStores()
  const { navigation } = _props

  function goLogin() {
    navigation.navigate("Login")
  }

  const {
    themed,
    theme: { colors },
  } = useAppTheme()

  const error = isSubmitted ? validationError : ""

  async function signInWithEmail() {
    setIsSubmitted(true)
    setAttemptsCount((prev) => prev + 1)

    const { error } = await signIn({ email: authEmail, password: authPassword })

    if (error) {
      // Exibe erro de autenticação se houver
      setIsSubmitted(false)
      return
    }


    setIsSubmitted(false)
    setAuthPassword("")
    setAuthEmail("")


  }

  const PasswordRightAccessory: ComponentType<TextFieldAccessoryProps> = useMemo(
    () =>
      function PasswordRightAccessory(props: TextFieldAccessoryProps) {
        return (
          <Icon
            icon={isAuthPasswordHidden ? "view" : "hidden"}
            color={colors.palette.neutral800}
            containerStyle={props.style}
            size={20}
            onPress={() => setIsAuthPasswordHidden(!isAuthPasswordHidden)}
          />
        )
      },
    [isAuthPasswordHidden, colors.palette.neutral800],
  )

  return (
    <Screen
      preset="auto"
      contentContainerStyle={themed($screenContentContainer)}
      safeAreaEdges={["top", "bottom"]}
    >
      <Text testID="register-heading" tx="registerScreen:register" preset="heading" style={themed($register)} />
      <Text tx="registerScreen:enterDetails" preset="subheading" style={themed($enterDetails)} />
      {attemptsCount > 2 && (
        <Text tx="registerScreen:hint" size="sm" weight="light" style={themed($hint)} />
      )}
       <TextField
        value={firstName}
        onChangeText={setFirstName}
        containerStyle={themed($textField)}
        autoCapitalize="none"
        autoComplete="name"
        autoCorrect={false}
        keyboardType="default"
        labelTx="registerScreen:nameFieldLabel"
        placeholderTx="registerScreen:nameFieldPlaceholder"
        helper={error}
        status={error ? "error" : undefined}
        onSubmitEditing={() => authPasswordInput.current?.focus()}
      />
       <TextField
        value={lastName}
        onChangeText={setLastName}
        containerStyle={themed($textField)}
        autoCapitalize="words"
        autoComplete="additional-name"
        autoCorrect={false}
        keyboardType="default"
        labelTx="registerScreen:lastNameFieldLabel"
        placeholderTx="registerScreen:lastNameFieldPlaceholder"
        helper={error}
        status={error ? "error" : undefined}
        onSubmitEditing={() => authPasswordInput.current?.focus()}
      />

      <TextField
        value={authEmail}
        onChangeText={setAuthEmail}
        containerStyle={themed($textField)}
        autoCapitalize="none"
        autoComplete="email"
        autoCorrect={false}
        keyboardType="email-address"
        labelTx="registerScreen:emailFieldLabel"
        placeholderTx="registerScreen:emailFieldPlaceholder"
        helper={error}
        status={error ? "error" : undefined}
        onSubmitEditing={() => authPasswordInput.current?.focus()}
      />

      <TextField
        ref={authPasswordInput}
        value={authPassword}
        onChangeText={setAuthPassword}
        containerStyle={themed($textField)}
        autoCapitalize="none"
        autoComplete="password"
        autoCorrect={false}
        secureTextEntry={isAuthPasswordHidden}
        labelTx="registerScreen:passwordFieldLabel"
        placeholderTx="registerScreen:passwordFieldPlaceholder"
        onSubmitEditing={signInWithEmail}
        RightAccessory={PasswordRightAccessory}
      />
      
      
      <Button
        testID="login-button"
        tx="registerScreen:tapToRegister"
        style={themed($tapButton)}
        preset="reversed"
        onPress={signInWithEmail}
      />


      <Text
        tx="registerScreen:callToLogin"
        preset="link"
        style={themed($callToLogin)}
        onPress={() => { goLogin() }}
      />
    </Screen>
  )
})

const $screenContentContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingVertical: spacing.xxl,
  paddingHorizontal: spacing.lg,
})

const $register: ThemedStyle<TextStyle> = ({ spacing }) => ({
  marginBottom: spacing.sm,
})

const $callToLogin: ThemedStyle<TextStyle> = ({ spacing }) => ({
  marginTop: spacing.md,
  textAlign:"right"
})


const $enterDetails: ThemedStyle<TextStyle> = ({ spacing }) => ({
  marginBottom: spacing.lg,
})

const $hint: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  color: colors.tint,
  marginBottom: spacing.md,
})

const $textField: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.lg,
})

const $tapButton: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginTop: spacing.xs,
})
