import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { selectSession, TOKEN_NAME } from "features/auth";
import { isServer } from "./isServer";

export function objectToQueryString(obj: { [key: string]: string } | {}) {
  const keys = Object.keys(obj);

  if (!keys.length) return "";

  return keys
    .filter((key) => {
      return typeof obj[key] !== "undefined";
    })
    .map((key) => {
      return `${key}=${obj[key]}`;
    })
    .join("&");
}

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API,
  // credentials: "include",
  // mode: "cors",
  prepareHeaders: (headers, { getState, extra, endpoint, forced, type }) => {
    //@ts-ignore
    if (isServer() && !headers.cookie) {
      // console.log("🚀 ~ RTKQ should have set headers, working around...");
      //@ts-ignore
      const session = selectSession(getState());
      const authToken = session ? session[TOKEN_NAME] : "";
      if (authToken) {
        // console.log("🚀 ~ Manually setting auth token in request headers");
        headers.set("cookie", `api_token=${authToken}`);
      }
    }
    return headers;
  }
});

export default baseQuery;
