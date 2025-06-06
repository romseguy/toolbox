import {
  Alert,
  AlertIcon,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Spinner,
  Stack,
  Text,
  useColorMode
} from "@chakra-ui/react";
import { useToast } from "utils/useToast";

import { OAuthProvider } from "@magic-ext/oauth";
import bcrypt from "bcryptjs";
import { FaPowerOff } from "react-icons/fa";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { getUser } from "features/user";
import {
  Button,
  Column,
  EmailControl,
  ErrorMessageText,
  PasswordControl
} from "features/common";
//import { SocialLogins } from "features/session/SocialLogins";
import { useRouterLoading } from "utils/useRouterLoading";
import { useSession } from "features/auth";
import { useAppDispatch } from "pages/_app";
//import api from "utils/api";
import { client } from "features/auth";
import { handleError } from "utils/form";
import { ErrorMessage } from "@hookform/error-message";
import { useSelector } from "react-redux";
import { selectIsMobile } from "utils/ui";

const onLoginWithSocial = async (provider: OAuthProvider) => {
  await client.oauth.loginWithRedirect({
    provider,
    redirectURI: new URL("/callback", window.location.origin).href
  });
};

export const LoginForm = ({
  title = "Connexion",
  ...props
}: {
  title?: string;
}) => {
  const isMobile = useSelector(selectIsMobile);
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const dispatch = useAppDispatch();
  const router = useRouter();
  const routerLoading = useRouterLoading();
  const {
    data: session,
    loading: isSessionLoading,
    setSession,
    setIsSessionLoading
  } = useSession();
  const toast = useToast({ position: "top" });
  //const [postResetPasswordMail] = usePostResetPasswordMailMutation();

  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const isLoading = isLoggingIn || routerLoading.isLoading;
  const [isPassword, setIsPassword] = useState(false);
  //const [isSent, setIsSent] = useState(false);

  //#region form
  const { clearErrors, register, control, errors, setError, handleSubmit } =
    useForm({ mode: "onChange" });
  //const email = useWatch<string>({ control, name: "email" });
  //const password = useWatch<string>({ control, name: "password" });

  const onChange = () => {
    clearErrors("formErrorMessage");
  };
  const onSubmit = async (form: { email: string; password?: string }) => {
    console.log("submitted", form);
    setIsLoggingIn(true);

    try {
      if (form.password) {
        const { data: user } = await dispatch(
          getUser.initiate({ slug: form.email })
        );

        if (!user) throw new Error("Identifiants incorrects");

        if (user?.passwordSalt) {
          const hash = await bcrypt.hash(form.password, user.passwordSalt);
          const { data } = await api.post("login", { email: form.email, hash });

          if (data && data.authenticated)
            router.push("/", "/", { shallow: true });
          else
            toast({
              status: "error",
              title: "L'adresse e-mail et le mot de passe ne correspondent pas"
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
        await client.auth.loginWithMagicLink({
          email: form.email,
          redirectURI: new URL("/callback", window.location.origin).href
        });
      }
    } catch (error) {
      console.log("🚀 ~ onSubmit ~ error:", error);
      setIsLoggingIn(false);
      handleError(error, (message, field) => {
        console.log("🚀 ~ handleError ~ message:", message);
        console.log("🚀 ~ handleError ~ field:", field);
        setError(field || "formErrorMessage", {
          type: "manual",
          message
        });
      });
    }
  };
  //#endregion

  return (
    <Flex flexDirection="column" width={isMobile ? "auto" : "md"} m="0 auto">
      <Heading textAlign="center" smaller>
        {title}
      </Heading>

      <form onChange={onChange} onSubmit={handleSubmit(onSubmit)}>
        <Column borderRadius={isMobile ? 0 : undefined} mt={3} mb={5}>
          <Flex
            flexDirection="column"
            //width={isMobile ? "auto" : "md"}
            m="0 auto"
          >
            <Alert
              fontSize="18px"
              status="info"
              m="0 auto"
              mb={5}
              {...(isMobile ? { mt: 12 } : {})}
            >
              <AlertIcon />
              <Text align="justify">
                <b>
                  Saisissez votre adresse e-mail ci-dessous pour recevoir un
                  e-mail qui vous permettra de vous identifier.
                </b>
              </Text>
            </Alert>
          </Flex>

          <EmailControl
            name="email"
            control={control}
            errors={errors}
            register={register}
            isDisabled={isLoggingIn}
            isMultiple={false}
            isRequired
            mb={0}
          />

          <FormControl display="flex" flexDir="row" mb={0}>
            <FormLabel mt={3}>Mot de passe</FormLabel>
            <Checkbox
              borderColor={isDark ? "white" : "black"}
              onChange={() => setIsPassword(!isPassword)}
            />
          </FormControl>

          {isPassword && (
            <PasswordControl
              errors={errors}
              register={register}
              noLabel
              mb={3}
            />
          )}

          <ErrorMessage
            errors={errors}
            name="formErrorMessage"
            render={({ message }) => (
              <Alert status="error" mb={3}>
                <AlertIcon />
                <ErrorMessageText>{message}</ErrorMessageText>
              </Alert>
            )}
          />

          <Button
            type="submit"
            colorScheme="green"
            isLoading={isLoading}
            isDisabled={isLoading || Object.keys(errors).length > 0}
            fontSize="sm"
          >
            {isPassword ? "Se connecter" : "Envoyer un e-mail de connexion"}
          </Button>
        </Column>

        <Column borderRadius={isMobile ? 0 : undefined} pb={0}>
          <SocialLogins flexDirection="column" onSubmit={onLoginWithSocial} />
        </Column>
      </form>
    </Flex>
  );
};
