import { useColorMode, Button } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { createCookie } from "features/auth";
import { Box } from "@chakra-ui/react";

export const Layout = ({ children, noHeader, noNav, ...props }) => {
  const router = useRouter();
  const nextLocale = router.locale === "en" ? "fr" : "en";
  const { colorMode, toggleColorMode } = useColorMode();
  const isDark = colorMode === "dark";
  return (
    <Box {...props}>
      {!noHeader && (
        <header>{router.locale === "en" ? "welcome" : "bienvenue"}</header>
      )}
      {!noNav && (
        <nav>
          <Button
            onClick={() => {
              toggleColorMode();
            }}
          >
            {isDark ? "go to light" : "go to dark"}
          </Button>
          <Button
            onClick={() => {
              document.cookie = createCookie("NEXT_LOCALE", nextLocale);
              //document.cookie = `NEXT_LOCALE=${nextLocale}; max-age=31536000; path=/`;

              router.push(
                { pathname: router.pathname, query: router.query },
                router.asPath,
                { locale: nextLocale },
              );
            }}
          >
            {nextLocale === "fr" ? "go to fr" : "go to en"}
          </Button>
        </nav>
      )}
      <main>{children}</main>
    </Box>
  );
};
