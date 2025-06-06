import { Box, useColorMode, Button } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { createCookie, useSession } from "features/auth";
import { Link } from "./common";

export const Layout = ({ children, ...props }) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const router = useRouter();
  const { data: session } = useSession();
  const nextLocale = router.locale === "en" ? "fr" : "en";

  return (
    <Box {...props}>
      {/* <header>
        welcome
        {session
          ? " - you are logged in as " +
            session.user.userName +
            ":" +
            session.user.userId +
            ":" +
            session.user.email
          : " - you are logged out"}
      </header> */}

      <nav>
        <Button
          onClick={() => {
            router.push("/", "/", { shallow: true });
          }}
          mr={3}
        >
          Home
        </Button>

        <Button
          onClick={() => {
            toggleColorMode();
          }}
          mr={3}
        >
          switch
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

        <Link href="/login" shallow>
          login
        </Link>
      </nav>

      <main>{children}</main>
    </Box>
  );
};
