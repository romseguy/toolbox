import { Flex } from "@chakra-ui/react";
import { Row } from "features/common";
import { Layout } from "features/Layout";
import { useRouter } from "next/router";
import React, { PropsWithChildren, useEffect } from "react";

export const NotFound = ({
  children,
  isRedirect = false,
  message = "",
  ...props
}: PropsWithChildren<{ isRedirect?: boolean; message?: string }>) => {
  const router = useRouter();
  // const [entityName, _] = Array.isArray(router.query.name)
  //   ? router.query.name
  //   : [];
  const entityName = router.asPath.substring(1, router.asPath.length);

  useEffect(() => {
    if (isRedirect)
      setTimeout(() => {
        router.push("/");
      }, 2000);
  }, []);

  return (
    <Layout {...props} pageTitle="404">
      <Flex flexDir="column" alignItems="flex-start" p={3}>
        {children ? (
          <>
            {message && (
              <Row
                border={!message && !isRedirect ? 0 : undefined}
                p={3}
                mb={3}
              >
                {message}
              </Row>
            )}
            {children}
            {isRedirect && (
              <Row
                border={!message && !isRedirect ? 0 : undefined}
                p={3}
                mt={message || children ? 3 : undefined}
              >
                Vous allez être redirigé vers la page d'accueil dans quelques
                secondes...
              </Row>
            )}
          </>
        ) : message || isRedirect ? (
          <>
            {message && (
              <Row border={!message && !isRedirect ? 0 : undefined} p={3}>
                {message}
              </Row>
            )}
            {isRedirect && (
              <Row
                border={!message && !isRedirect ? 0 : undefined}
                p={3}
                mt={message ? 3 : undefined}
              >
                Vous allez être redirigé vers la page d'accueil dans quelques
                secondes...
              </Row>
            )}
          </>
        ) : null}
      </Flex>
    </Layout>
  );
};
