const pt = {
  common: {
    ok: "OK!",
    cancel: "Cancelar",
    back: "Voltar",
    logOut: "Sair",
  },
  welcomeScreen: {
    postscript:
      "psst — Parabéns, você está pronto para pegar a estrada! Se ainda não, pelo menos não vai precisar encarar um ônibus lotado.",
    readyForLaunch: "Seu carro está lhe esperando! ",
    exciting: "(ohh, isso é empolgante!)",
    letsGo: "Vamos lá!",
  },
  errorScreen: {
    title: "Algo deu errado!",
    friendlySubtitle:
      "Esta é a tela que seus usuários verão em produção quando ocorrer um erro. Você vai querer personalizar essa mensagem (localizada em `app/i18n/en.ts`) e provavelmente o layout também (`app/screens/ErrorScreen`). Se quiser remover isso completamente, verifique `app/app.tsx` para o componente <ErrorBoundary>.",
    reset: "REINICIAR APP",
    traceTitle: "Erro na pilha de %{name}",
  },
  emptyStateComponent: {
    generic: {
      heading: "Tão vazio... tão triste",
      content: "Nenhum dado encontrado ainda. Tente clicar no botão para atualizar ou recarregar o app.",
      button: "Vamos tentar novamente",
    },
  },

  errors: {
    invalidEmail: "Endereço de e-mail inválido.",
  },
  loginScreen: {
    logIn: "Entrar",
    enterDetails:
      "Insira seus dados abaixo para acessar detalhes da sua viagem. Descubra horários, motoristas disponíveis e tarifas especiais. Viajar nunca foi tão fácil!",
    emailFieldLabel: "E-mail",
    passwordFieldLabel: "Senha",
    emailFieldPlaceholder: "Digite seu endereço de e-mail",
    passwordFieldPlaceholder: "Senha super secreta aqui",
    tapToLogIn: "Toque para entrar!",
    hint: "Dica: você pode usar qualquer endereço de e-mail e sua senha favorita :)",
  },
  Navigator: {
    accountTab: "Conta",
    HomeTab: "Início",
  },
  AccountScreen: {
    howTo: "COMO FAZER",
    title: "Conta",
    tagLine:
      "Parabéns, você tem um modelo de app React Native muito avançado aqui. Aproveite esta base!",
    reactotron: "Enviar para Reactotron",
    reportBugs: "Reportar Bugs",
    List: " Lista",
    PodcastList: " Lista de Podcasts",
    appVersion: "Versão do App",
    androidReactotronHint:
      "Se isso não funcionar, certifique-se de que o aplicativo Reactotron está em execução, execute adb reverse tcp:9090 tcp:9090 no terminal e recarregue o app.",
    iosReactotronHint:
      "Se isso não funcionar, certifique-se de que o aplicativo Reactotron está em execução e recarregue o app.",
    macosReactotronHint:
      "Se isso não funcionar, certifique-se de que o aplicativo Reactotron está em execução e recarregue o app.",
    webReactotronHint:
      "Se isso não funcionar, certifique-se de que o aplicativo Reactotron está em execução e recarregue o app.",
    windowsReactotronHint:
      "Se isso não funcionar, certifique-se de que o aplicativo Reactotron está em execução e recarregue o app.",
  },
  HomeScreen: {
    title: "Carros disponíveis na sua região",
    onlyFavorites: "Mostrar apenas favoritos",
    favoriteButton: "Favoritar",
    unfavoriteButton: "Desfavoritar",
    accessibility: {
      cardHint:
        "Toque duas vezes para ouvir o episódio. Toque duas vezes e segure para {{action}} este episódio.",
      switch: "Ative para mostrar apenas favoritos",
      favoriteAction: "Alternar Favorito",
      favoriteIcon: "Episódio não favoritado",
      unfavoriteIcon: "Episódio favoritado",
      publishLabel: "Publicado em {{date}}",
      durationLabel: "Duração: {{hours}} horas {{minutes}} minutos {{seconds}} segundos",
    },
    noFavoritesEmptyState: {
      heading: "Isso parece um pouco vazio",
      content:
        "Nenhum favorito foi adicionado ainda. Toque no coração de um episódio para adicioná-lo aos favoritos!",
    },
  },
}

export default pt
export type Translations = typeof pt