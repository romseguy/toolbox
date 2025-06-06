import { Box, ChakraProvider, cookieStorageManager } from "@chakra-ui/react";
import { unseal } from "@hapi/iron";
import { parse } from "cookie";
import { GetServerSideProps } from "next";
import { wrapper } from "pages/_app";
import {
  setSession,
  getAuthToken,
  sealOptions,
  TOKEN_NAME,
} from "features/auth";
import { Session } from "types";
import { theme } from "./theme";

export const Page = ({ children, ...props }) => {
  const {
    pageProps: { cookie },
  } = props;
  return (
    <ChakraProvider
      resetCSS
      colorModeManager={cookieStorageManager(cookie)}
      theme={theme}
    >
      <Box {...props}>{children}</Box>
    </ChakraProvider>
  );
};

// export const getServerSideProps: GetServerSideProps = async (ctx) => {
//   const cookie = ctx.req.headers.cookie || "";
//   return { props: { cookie } };
// };

export const getServerSideProps: GetServerSideProps =
  wrapper.getServerSideProps((store) => async (ctx) => {
    //console.log("🚀 ~ Page.getServerSideProps ~ headers:", ctx.req.headers);

    // TODO: Load translations
    // console.log("🚀 ~ wrapper.getServerSideProps ~ ctx:", ctx.locale);

    const cookie = ctx.req.headers.cookie || "";
    let authToken =
      typeof cookie === "string" && cookie.includes(TOKEN_NAME)
        ? getAuthToken(parse(cookie))
        : "Fe26.2**fe8ddcbbacd0353945bba46ed1e083f8a1ec5bfdeb5af437f7e2d1ca7e9e3a8f*vN8tuI4gLRhFhiM-nVPcLQ*hNHGxKGg86mm_S_MEZaXTXLG7dZRK3VMgc44AQODV5eR-98e2B0nz0-PLh6ROER1YSLt7EpD4yAC7w-F3bsWgx-8WeFr7Sgw-VYlABROOon7UQwyFpfm6WNmCGRuo-2H**2cbcd8e4b8ddde68589b7bcdab9193720bf69a23e49c25aaa35a0169a223dfae*sWfxmxyosK-M8w0iq03MQqDZh9DYOjbHFJ6l43P3XUI";
    let session: Session = {
      user: null,
      [TOKEN_NAME]: authToken,
    };

    if (authToken) {
      const user = await unseal(authToken, process.env.SECRET, sealOptions);

      if (user) {
        const isAdmin =
          typeof process.env.NEXT_PUBLIC_ADMIN_EMAILS === "string"
            ? process.env.NEXT_PUBLIC_ADMIN_EMAILS.split(",").includes(
                user.email,
              )
            : false;
        session = {
          ...session,
          user: {
            ...user,
            isAdmin,
          },
        };
      }
    }

    store.dispatch(setSession(session));
    return { props: { cookie, session } };
  });
