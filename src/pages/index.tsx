import { Flex } from "@chakra-ui/react";
import { css } from "@emotion/react";
//import { useSession } from "features/auth";
import { Page } from "features/Page";
import { Layout } from "features/Layout";
import dynamic from "next/dynamic";

const Base = dynamic(() => import("../features/stages/Base"), {
  ssr: false,
});
const Triangle = dynamic(() => import("../features/stages/Triangle"), {
  ssr: false,
});
const Trapeze = dynamic(() => import("../features/stages/Trapeze"), {
  ssr: false,
});

const IndexPage = (props) => {
  //const { data: session } = useSession();

  return (
    <Page {...props}>
      <Layout noHeader noNav>
        {/* <Flex
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
        </Flex> */}

        <Flex direction="column" align="center" mt={3}>
          <Triangle />
          <Trapeze />
          <Base />
        </Flex>
      </Layout>
    </Page>
  );
};

export { getServerSideProps } from "features/Page";

export default IndexPage;
