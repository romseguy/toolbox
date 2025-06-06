import {
  extendTheme,
  theme as baseTheme,
  withDefaultColorScheme
} from "@chakra-ui/react";

export const theme = extendTheme(
  { components: { Button: { defaultProps: { variant: "outline" } } } },
  withDefaultColorScheme({ colorScheme: "red" }),
  baseTheme
);
