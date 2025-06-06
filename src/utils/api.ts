import { createApi } from "@reduxjs/toolkit/query/react";
import { HYDRATE } from "next-redux-wrapper";
import baseQuery, { objectToQueryString } from "utils/query";

export enum TagTypes {
  USERS = "Users"
}

export const api = createApi({
  baseQuery,
  extractRehydrationInfo(action, { reducerPath }) {
    if (action.type === HYDRATE) {
      return action.payload[reducerPath];
    }
  },
  tagTypes: [TagTypes.USERS],
  endpoints: () => ({})
});

export const {
  util: { getRunningQueriesThunk }
} = api;
