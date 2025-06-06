import { configureStore, createSlice } from "@reduxjs/toolkit";
import { ToolkitStore } from "@reduxjs/toolkit/dist/configureStore";
import { setupListeners } from "@reduxjs/toolkit/query/react";
import { createWrapper } from "next-redux-wrapper";
import { useDispatch } from "react-redux";
import { session } from "features/auth";
import ui from "utils/ui";
import { api } from "utils/api";
import { objectToQueryString } from "utils/query";

const App = ({ Component, ...props }) => {
  return <Component {...props} />;
};

export const rootApi = api.injectEndpoints({
  endpoints: (build) => ({
    getList: build.query({
      query: ({ ...query }) => {
        return { url: "/?" + objectToQueryString(query) };
      }
    })
  }),
  overrideExisting: true
});
const rootSlice = createSlice({ name: "root", initialState: {}, reducers: {} });

export const store: ToolkitStore = configureStore({
  reducer: {
    [rootApi.reducerPath]: rootApi.reducer,
    root: rootSlice.reducer,
    session,
    ui
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat([
      rootApi.middleware
    ]),
  devTools: false
});

setupListeners(store.dispatch);

export const useAppDispatch = () => useDispatch();

export const wrapper = createWrapper(() => store);

export default wrapper.withRedux(App);
