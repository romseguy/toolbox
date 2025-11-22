import { Flex } from "@chakra-ui/react";
import { css } from "@emotion/react";
import { useSession } from "features/auth";
import { Page } from "features/Page";
import { Layout } from "features/Layout";

const IndexPage = (props) => {
  const { data: session } = useSession();

  return (
    <Page {...props}>
      <Layout>
        <Flex
          css={css`
            color: red;
          `}
        >
          {session
            ? session.user.userName +
              ":" +
              session.user.userId +
              ":" +
              session.user.email
            : "logged out"}
        </Flex>
      </Layout>
    </Page>
  );
};

export { getServerSideProps } from "features/Page";

export default IndexPage;
