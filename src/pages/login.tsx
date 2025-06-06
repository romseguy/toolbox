import {
  Alert,
  AlertIcon,
  Button,
  Flex,
  Spinner,
  Stack,
  Text,
  useColorMode,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { css } from "@emotion/react";
import bcrypt from "bcryptjs";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FaPowerOff } from "react-icons/fa";
import { useSelector } from "react-redux";
import { client, useSession } from "features/auth";
import { Column } from "features/common";
import { Layout } from "features/Layout";
import { Page } from "features/Page";
import { getUser, LoginForm, resetUserEmail } from "features/user";
import { selectIsMobile } from "utils/ui";
import { useToast } from "utils/useToast";
import { useAppDispatch } from "./_app";

const BackButton = ({ ...props }) => {
  const router = useRouter();
  return (
    <Button
      colorScheme="blue"
      leftIcon={<ArrowBackIcon />}
      onClick={() => router.push("/", "/", { shallow: true })}
      {...props}
    >
      Retour à l'accueil
    </Button>
  );
};

const LoginPage = (props) => {
  const isMobile = useSelector(selectIsMobile);
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const dispatch = useAppDispatch();
  //const router = useRouter();
  const {
    data: session,
    loading: isSessionLoading,
    setSession,
    setIsSessionLoading,
  } = useSession();
  const title = `Connexion – ${process.env.NEXT_PUBLIC_SHORT_URL}`;
  const toast = useToast({ position: "top" });
  //const [postResetPasswordMail] = usePostResetPasswordMailMutation();

  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isPassword, setIsPassword] = useState(false);
  //const [isSent, setIsSent] = useState(false);

  //#region form
  const { clearErrors, register, control, errors, setError, handleSubmit } =
    useForm({ mode: "onChange" });
  //const email = useWatch<string>({ control, name: "email" });
  //const password = useWatch<string>({ control, name: "password" });

  const onSubmit = async (form: { email: string; password?: string }) => {
    console.log("submitted", form);
    setIsLoggingIn(true);

    try {
      if (form.password) {
        const { data: user } = await dispatch(
          getUser.initiate({ slug: form.email }),
        );

        if (user?.passwordSalt) {
          const hash = await bcrypt.hash(form.password, user.passwordSalt);
          // const {
          //   data: { authenticated }
          // } = await api.post("login", { email: form.email, hash });

          if (authenticated) window.location.href = "/";
          else
            toast({
              status: "error",
              title: "L'adresse e-mail et le mot de passe ne correspondent pas",
            });

          // todo: POST hash to /api/login

          // if (user.password === hash) {
          //   toast({ title: "OK" });
          //   const userToken = {
          //     email: form.email,
          //     userId: user._id,
          //     userName: user.userName
          //   };

          //   const authToken = await seal(userToken, "i9udjxke5S", sealOptions);

          //   dispatch(
          //     setSession({
          //       user: userToken,
          //       [TOKEN_NAME]: authToken
          //     })
          //   );
          // } else toast({ title: "NOK" });
        }

        setIsLoggingIn(false);
      } else {
        await client.auth.loginWithclientLink({
          email: form.email,
          redirectURI: new URL("/callback", window.location.origin).href,
        });
      }
    } catch (error) {
      setIsLoggingIn(false);
    }
  };
  //#endregion

  return (
    <Page
      css={css`
        margin: 0 auto;
        width: 50%;
      `}
      {...props}
    >
      <Layout
        css={css`
          main > div {
            border: 1px solid white;
            margin-top: 12px;
          }
        `}
      >
        <Flex flexDirection="column">
          {isSessionLoading && <Spinner mb={3} />}

          {!isSessionLoading && (
            <>
              {session && (
                <Column>
                  <Alert bg={isDark ? "gray.600" : undefined} status="success">
                    <AlertIcon />
                    <Stack spacing={3} textAlign="center">
                      <Text>
                        Vous êtes déjà connecté avec l'adresse e-mail :
                      </Text>

                      <Text fontWeight="bold" ml={1}>
                        {session.user.email}
                      </Text>
                    </Stack>
                  </Alert>

                  <BackButton mt={3} />

                  <Button
                    colorScheme="red"
                    leftIcon={<FaPowerOff />}
                    mt={3}
                    onClick={async () => {
                      dispatch(setIsSessionLoading(true));
                      dispatch(resetUserEmail());
                      if (await client.user.isLoggedIn()) {
                        await client.user.logout();
                      }
                      //await api.get("logout");
                      dispatch(setSession(null));
                      dispatch(setIsSessionLoading(false));
                    }}
                  >
                    Se déconnecter
                  </Button>
                </Column>
              )}

              {!session && (
                <LoginForm
                  {...props}
                  isMobile={isMobile}
                  title=""
                  //title="Veuillez saisir votre adresse e-mail ci-dessous pour accéder aux ateliers"
                />
              )}
            </>
          )}
        </Flex>
      </Layout>
    </Page>
  );
};

// export const getServerSideProps = wrapper.getServerSideProps(
//   (store) => async (ctx) => {
//     return { props: {} };
//   }
// );

export { getServerSideProps } from "features/Page";
export default LoginPage;
