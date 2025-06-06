import { useDebouncedCallback } from "@charlietango/hooks/use-debounced-callback";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { pdfjs } from "react-pdf";
import { RTEditor } from "./RTEditor";
import "./App.css";

pdfjs.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.js";

const pdfToText = async (file: File | Blob | MediaSource): Promise<string> => {
  // Create a blob URL for the PDF file
  const blobUrl = URL.createObjectURL(file);

  // Load the PDF file
  //const reactPdf = require("react-pdf");
  //const loadingTask = reactPdf.getDocument(blobUrl);

  const loadingTask = pdfjs.getDocument(blobUrl);

  let extractedText = "";
  try {
    const pdf = await loadingTask.promise;
    //const numPages = pdf.numPages;
    const numPages = 1;

    // Iterate through each page and extract text
    for (let pageNumber = 1; pageNumber <= numPages; pageNumber++) {
      const page = await pdf.getPage(pageNumber);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        //.map((item) => ("str" in item ? item.str : ""))
        .map((item) => {
          console.log("🚀 ~ .map ~ item:", item);
          if (item.hasEOL && item.height === 0) return "\n";
          return item.str;
        })
        .join(" ");
      extractedText += pageText;
    }
  } catch (error) {
    throw new Error(`Failed to extract text from PDF: ${error}`);
  } finally {
    // Clean up the blob URL
    URL.revokeObjectURL(blobUrl);

    // Free memory from loading task
    loadingTask.destroy();
  }

  return extractedText;
};

function extractText(file: File | null) {
  if (file)
    pdfToText(file)
      .then((text) => console.log(text))
      .catch((error) =>
        console.error("Failed to extract text from pdf", error),
      );
}

const fullDateString = (date: Date) => {
  return format(date, "eeee dd MMMM yyyy à H'h'mm", {
    locale: fr,
  });
};

function App() {
  const debouncedCallback = useDebouncedCallback(() => {
    console.log("called after 1000ms");
  }, 1000);
  useEffect(() => {
    debouncedCallback();
  }, []);

  const [html, setHtml] = useState("");

  return (
    <>
      <div style={{ marginBottom: "24px" }}>
        <input
          type="file"
          id="pdf"
          accept="application/pdf"
          onChange={(e) =>
            extractText(e.target.files ? e.target.files[0] : null)
          }
        />
        <label htmlFor="pdf">PDF</label>
      </div>

      <div style={{ marginBottom: "24px" }}>
        <input
          type="file"
          id="html"
          accept="text/html"
          onChange={async (e) => {
            const file = e.target.files ? e.target.files[0] : null;
            if (file) setHtml(await file.text());
          }}
        />
        <label htmlFor="html">HTML</label>
      </div>

      <RTEditor
        defaultValue={html}
        onChange={async (e) => {
          setHtml(e.html);
        }}
      />

      <div style={{ marginTop: "12px" }}>
        <button
          onClick={async () => {
            var bl = new Blob(
              [
                `<html>
              <head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><link rel="stylesheet" type="text/css" href="./spectral.css"><style type="text/css">
      body {
        font-family: 'Spectral', Georgia, ui-serif, serif;
        font-size: 19px;
        text-align: justify;
      }
      hr {
        border-top-width: 3px;
        margin: 0 24px;
      }
      p {
        margin: 0;
        padding: 0;
      }
    </style></head>
              <body>${html}</body></html>`,
              ],
              { type: "text/html" },
            );
            var a = document.createElement("a");
            a.href = URL.createObjectURL(bl);
            a.download = `${fullDateString(new Date())}.html`;
            a.hidden = true;
            document.body.appendChild(a);
            a.click();
          }}
        >
          Save
        </button>
      </div>
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
