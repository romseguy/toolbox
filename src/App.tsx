import { useDebouncedCallback } from "@charlietango/hooks/use-debounced-callback";
import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./App.css";
import { divideArray, hasItems } from "./array";
import { Flex, Image } from "@chakra-ui/react";
import { client } from "./client";

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
  type?: string;
  cached?: boolean;
}

export const breakpoints = {
  sm: "28em",
  md: "40em",
  lg: "52em",
  xl: "64em",
  "2xl": "80em",
  nav: "1003px",
};

export const pxBreakpoints = {
  sm: 448,
  md: 640,
  lg: 832,
  xl: 1024,
  "2xl": 1280,
};

function App() {
  //#region column count relative to screen width
  const [screenWidth, setScreenWidth] = useState(0);
  const [images, setImages] = useState<RemoteImage[]>([]);
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
  //#endregion

  //#region masonry state
  const [currentIndex, setCurrentIndex] = useState(0);
  const pageImageCount = 10;
  const pagesCount =
    images.length > pageImageCount ? images.length % pageImageCount : 1;
  //const pageLength = images.length / pagesCount;
  const pages = divideArray(images, pagesCount);
  const masonry = divideArray<RemoteImage>(
    pages.reduce(
      (arr, page, index) => (index <= currentIndex ? arr.concat(page) : arr),
      [],
    ),
    columnCount,
  );
  //#endregion

  const debouncedCallback = useDebouncedCallback(() => {
    console.log("called after 1000ms");
    const updateScreenWidth = () => {
      const newScreenWidth = window.innerWidth - 15;
      if (newScreenWidth !== screenWidth) setScreenWidth(newScreenWidth);
    };

    updateScreenWidth();
    window.addEventListener("resize", updateScreenWidth);
    signal.addEventListener("abort", () => {
      window.removeEventListener("resize", updateScreenWidth);
    });
  }, 1000);

  useEffect(() => {
    (async () => {
      const url = new URL(
        "https://api.romseguy.com/?orgId=64d0a600d9222e2015596ec9",
      );
      const res = await client.get(url.toString());
      console.log("🚀 ~ res:", res);
    })();

    debouncedCallback();
  }, []);

  return (
    <>
      {masonry.map((column, index) => {
        console.log("🚀 ~ {masonry.map ~ column:", column);
        return (
          <Flex key={index} flexDirection="column" width="100%">
            {column.map((image, imageIndex) => {
              let marginAround = 2 * (4 * 12 + 24);
              const marginBetween = (columnCount - 1) * 24;
              let newMW = screenWidth - marginAround;

              if (screenWidth > pxBreakpoints["2xl"]) {
                marginAround = 2 * (5 * 12 + 20 + 84);
                newMW =
                  (screenWidth - marginAround - marginBetween) / columnCount;
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
                  (screenWidth - marginAround - marginBetween) / columnCount;
              }

              const width = image.width > newMW ? newMW : image.width;

              return (
                <Image
                  key={`image-${imageIndex}`}
                  //ref={imageRefs[image.url]}
                  src={image.url}
                  width={`${width}px`}
                  borderRadius="12px"
                  cursor="pointer"
                  mb={3}
                  mx={3}
                  // onClick={() => {
                  //   onOpen(image);
                  // }}
                  // onLoad={() => {
                  //   if (!isLoaded[image.url])
                  //     setIsLoaded({ [image.url]: true });
                  // }}
                />
              );
            })}
          </Flex>
        );
      })}
    </>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
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
