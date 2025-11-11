import {
  Alert,
  AlertIcon,
  Badge,
  Box,
  Flex,
  Image,
  Link,
  Spinner,
} from "@chakra-ui/react";
import { StrictMode, useCallback, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./App.css";
import { divideArray, hasItems } from "./array";
import { client } from "./client";
import * as stringUtils from "./string";
import { ThemeProvider } from "./ThemeProvider";
import { pxBreakpoints } from "./theme";

const controller = new AbortController();
const signal = controller.signal;

export interface RemoteFile {
  bytes: number;
  hUnits: string;
  wUnits: string;
  mime: string;
  type: string;
  url: string;
  width: number;
  time?: number;
}

export interface RemoteImage extends RemoteFile {
  height: number;
  width: number;
  cached?: boolean;
}

function App() {
  const isFetching = false;
  const isLoading = false;

  const [screenWidth, setScreenWidth] = useState(0);
  useEffect(() => {
    const updateScreenWidth = () => {
      const newScreenWidth = window.innerWidth - 15;
      if (newScreenWidth !== screenWidth) setScreenWidth(newScreenWidth);
    };

    updateScreenWidth();
    window.addEventListener("resize", updateScreenWidth);
    signal.addEventListener("abort", () => {
      window.removeEventListener("resize", updateScreenWidth);
    });
  }, []);

  const [images, setImages] = useState<RemoteImage[]>([]);
  const [imagesSize, setImagesSize] = useState(0);
  useEffect(() => {
    (async () => {
      const url = new URL(
        "https://api.romseguy.com/?orgId=64d0a600d9222e2015596ec9",
      );
      const res = await client.get<RemoteFile[]>(url.toString());
      if (res.data && hasItems(res.data)) {
        let count = 0;
        let arr: RemoteImage[] = [];
        let data = res.data.filter(
          ({ mime }) => !!mime && mime.includes("image"),
        ) as RemoteImage[];

        for (const file of data) {
          count += file.bytes;
          arr.push({
            ...file,
            url: `http://138.68.66.61/64d0a600d9222e2015596ec9/${encodeURIComponent(
              file.url,
            )}`,
          });
        }

        setImages(arr.sort((a, b) => (a.time < b.time ? 1 : -1)));
        setImagesSize(count);
      }
    })();
  }, []);

  const [columnCount, setColumnCount] = useState<number>(1);
  useEffect(() => {
    const getColumnCount = () => {
      let col = 1;
      if (hasItems(images) && screenWidth) {
        if (screenWidth >= pxBreakpoints.xl)
          col = images.length >= 4 ? 4 : images.length;
        else if (screenWidth >= pxBreakpoints.lg) col = 3;
        else if (screenWidth >= pxBreakpoints.md) col = 2;
        else col = 1;
      }
      return col;
    };
    const col = getColumnCount();
    if (col !== columnCount) setColumnCount(col);
  }, [images, screenWidth]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const pageImageCount = 10;
  const pagesCount =
    images.length > pageImageCount ? images.length % pageImageCount : 1;
  //const pageLength = images.length / pagesCount;
  const pages = divideArray(images, pagesCount);
  const masonry = divideArray<RemoteImage>(
    pages.reduce((arr, page, index) => {
      return arr.concat(page);
      //return index <= currentIndex ? arr.concat(page) : arr
    }, []),
    columnCount,
  );
  return (
    <Box>
      <Flex alignItems="center" p={3}>
        <h1>{images.length} images</h1>
        <Badge variant="subtle" colorScheme="green" ml={1}>
          {stringUtils.bytesForHuman(imagesSize)}
        </Badge>
      </Flex>

      {isLoading || isFetching ? (
        <Spinner m={3} />
      ) : !hasItems(images) ? (
        <Alert status="info">
          <AlertIcon />
          Aucune images.
        </Alert>
      ) : (
        !!columnCount && (
          <>
            <Flex justifyContent="center">
              {masonry.map((column, index) => {
                return (
                  <Flex key={index} flexDirection="column" width="100%">
                    {column.map((image, columnIndex) => {
                      let marginAround = 2 * (4 * 12 + 24);
                      const marginBetween = (columnCount - 1) * 24;
                      let newMW = screenWidth - marginAround;

                      if (screenWidth > pxBreakpoints["2xl"]) {
                        marginAround = 2 * (5 * 12 + 20 + 84);
                        newMW =
                          (screenWidth - marginAround - marginBetween) /
                          columnCount;
                        // console.log(
                        //   "1",
                        //   columnCount,
                        //   screenWidth,
                        //   newMW,
                        //   marginAround,
                        //   marginBetween
                        // );
                      } else if (columnCount !== 1) {
                        marginAround = 2 * (4 * 12 + 20);
                        newMW =
                          (screenWidth - marginAround - marginBetween) /
                          columnCount;
                      }

                      const width = image.width > newMW ? newMW : image.width;
                      const currentIndex = images.findIndex(
                        ({ url }) => url === image.url,
                      );

                      return (
                        <>
                          <Box style={{ float: "left" }}>{currentIndex}</Box>
                          <Link href={image.url} isExternal>
                            <Image
                              key={`image-${columnIndex}`}
                              //ref={imageRefs[image.url]}
                              src={image.url}
                              width={`${width}px`}
                              borderRadius="12px"
                              cursor="pointer"
                              mb={3}
                              mx={3}
                              onClick={() => {
                                //onOpen(image);
                              }}
                              // onLoad={() => {
                              //   if (!isLoaded[image.url])
                              //     setIsLoaded({ [image.url]: true });
                              // }}
                            />
                          </Link>
                        </>
                      );
                    })}
                  </Flex>
                );
              })}
            </Flex>

            {/* {Array.isArray(pages[currentIndex + 1]) && (
              <Button
                onClick={() => {
                  setCurrentIndex(currentIndex + 1);
                }}
              >
                Charger les images suivantes{" "}
                <Badge colorScheme="teal">
                  {stringUtils.bytesForHuman(
                    pages[currentIndex + 1].reduce((sum, cur) => {
                      return sum + cur.bytes;
                    }, 0),
                  )}
                </Badge>
              </Button>
            )} */}
          </>
        )
      )}

      {/* {modalState.isOpen && modalState.image && (
        <FullscreenModal
          //header={modalState.image.url.match(/[^=]+$/)![0]}
          header={
            <HStack>
              <FaImage />
              <Text>
                {modalState.image.url.substring(
                  modalState.image.url.lastIndexOf("/") + 1
                )}
              </Text>
            </HStack>
          }
          bodyProps={{ bg: "black" }}
          onClose={onClose}
        >
          <Image
            alignSelf="center"
            src={modalState.image.url}
            width={`${modalState.image.width}px`}
          />
        </FullscreenModal>
      )} */}
    </Box>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>,
);

{
  /*
// #0
// import pdfToText from "react-pdftotext";

// #1
// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;

// #2
// import type * as reactPdfType from "react-pdf";
// let reactPdf: typeof reactPdfType | undefined;
// if (typeof window !== "undefined") {
//   reactPdf = require("react-pdf");
// }
// if (reactPdf?.pdfjs && typeof window !== "undefined") {
//   const workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${reactPdf.pdfjs.version}/pdf.worker.min.mjs`;
//   reactPdf.pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;
// }
  */
}

{
  /*
  const debouncedCallback = useDebouncedCallback(() => {
    console.log("called after 1000ms");
  }, 1000);
  */
}
