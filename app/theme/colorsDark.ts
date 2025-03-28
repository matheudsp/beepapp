const palette = {
  neutral900: "#FFFFFF",
  neutral800: "#CCCCCC",
  neutral700: "#A6A6A6",
  neutral600: "#808080",
  neutral500: "#666666",
  neutral400: "#4D4D4D",
  neutral300: "#333333",
  neutral200: "#1A1A1A",
  neutral100: "#000000",
  
  
  primary: '#20463C',
  primary600: "#2E6647",
  primary500: "#365B51",
  primary400: "#4D8C6A",
  primary300: "#6BAE8C",
  primary200: "#8BC8A9",
  primary100: "#B2E0C4",

  secondary500: "#DCDDE9",
  secondary400: "#BCC0D6",
  secondary300: "#9196B9",
  secondary200: "#626894",
  secondary100: "#41476E",

  accent500: "#FFEED4",
  accent400: "#FFE1B2",
  accent300: "#FDD495",
  accent200: "#FBC878",
  accent100: "#FFBB50",

  angry100: "#F2D6CD",
  angry500: "#C03403",

  overlay20: "rgba(25, 16, 21, 0.2)",
  overlay50: "rgba(25, 16, 21, 0.5)",
} as const

export const colors = {
  palette,
  transparent: "rgba(0, 0, 0, 0)",
  text: palette.neutral800,
  textDim: palette.neutral700,
  background: palette.neutral200,
  border: palette.neutral400,
  tint: palette.primary500,
  tintInactive: palette.neutral300,
  separator: palette.neutral300,
  error: palette.angry500,
  errorBackground: palette.angry100,
} as const
