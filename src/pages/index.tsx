import { Heading, Box, Input, HStack, VStack, Badge } from "@chakra-ui/react";
import { css } from "@emotion/react";
import { useEffect, useState } from "react";
import { Layout } from "features/Layout";
import { Page } from "features/Page";
import { rootApi, useAppDispatch } from "./_app";

const IndexPage = (props) => {
  const dispatch = useAppDispatch();

  const defaultPath = "/home/x240/MEGA/sauvegarder";
  const [isAll, setIsAll] = useState(false);
  const [isHtml, setIsHtml] = useState(false);
  const [is2025, setIs2025] = useState(false);
  const [path, setPath] = useState(defaultPath);
  const [initialFileNames, setInitialFileNames] = useState([]);
  const [fileNames, setFileNames] = useState([]);

  const handleBlur = (str) => {
    setPath(str);
  };

  useEffect(() => {
    (async () => {
      const { data: filePaths } = await dispatch(
        rootApi.endpoints.getList.initiate({
          path: isAll ? path + "/**/*" : path + "/*",
        }),
      );
      const fns = filePaths.map((filePath) => filePath.replace(path, ""));
      setInitialFileNames(fns);
      setFileNames(fns);
    })();
  }, [path, isAll]);

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
            padding: 12px;
          }
        `}
      >
        <Box>
          <VStack>
            <Heading>dir-list</Heading>
            <Input
              defaultValue={defaultPath}
              onBlur={(e) => handleBlur(e.target.value)}
            />
          </VStack>
          <HStack>
            <Badge
              colorScheme={isAll ? "green" : "red"}
              css={css`
                cursor: pointer;
                margin: 12px;
              `}
              onClick={() => {
                setIsAll(!isAll);
              }}
            >
              ALL
            </Badge>

            <Badge
              colorScheme={isHtml ? "green" : "red"}
              css={css`
                cursor: pointer;
                margin: 12px;
              `}
              onClick={() => {
                setIsHtml(!isHtml);
              }}
            >
              HTML
            </Badge>

            <Badge
              colorScheme={is2025 ? "green" : "red"}
              css={css`
                cursor: pointer;
                margin: 12px;
              `}
              onClick={() => {
                setIs2025(!is2025);
              }}
            >
              2025
            </Badge>
          </HStack>
          <ul>
            {fileNames
              .filter((fn) => {
                if (isHtml && is2025) {
                  return fn.includes("2025") && fn.includes("html");
                }

                if (isHtml) {
                  return fn.includes("html");
                }

                if (is2025) {
                  return fn.includes("2025");
                }

                return true;
              })
              .map((name) => {
                return (
                  <li>
                    <a href={"http://localhost:8000" + name}>{name}</a>
                  </li>
                );
              })}
          </ul>
        </Box>
      </Layout>
    </Page>
  );
};

export { getServerSideProps } from "features/Page";

export default IndexPage;
