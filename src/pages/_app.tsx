import { configureStore } from "@reduxjs/toolkit";
import { ToolkitStore } from "@reduxjs/toolkit/dist/configureStore";
import { setupListeners } from "@reduxjs/toolkit/query/react";
import { createWrapper } from "next-redux-wrapper";
import { useDispatch } from "react-redux";
import { session } from "features/auth";
import ui from "utils/ui";

const App = ({ Component, ...props }) => {
  return <Component {...props} />;
};

export const store: ToolkitStore = configureStore({
  reducer: { session, ui },
  devTools: false
});

setupListeners(store.dispatch);

export const useAppDispatch = () => useDispatch();

export const wrapper = createWrapper(() => store);

export default wrapper.withRedux(App);
