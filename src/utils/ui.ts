import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";

export const uiSlice = createSlice({
  name: "ui",
  initialState: {
    isMobile: false,
    rteditorIndex: 0,
    screenHeight: 0,
    screenWidth: 0
  },

  reducers: {
    incrementRTEditorIndex: (state, action: PayloadAction<undefined>) => {
      state.rteditorIndex++;
    },
    setIsMobile: (state, action: PayloadAction<boolean>) => {
      state.isMobile = action.payload;
    },
    setScreenHeight: (state, action: PayloadAction<number>) => {
      if (typeof action.payload === "number" && action.payload > 0)
        state.screenHeight = action.payload;
    },
    setScreenWidth: (state, action: PayloadAction<number>) => {
      state.screenWidth = action.payload;
    }
  },

  extraReducers: (builder) => {
    builder.addCase(
      HYDRATE,
      (
        state,
        action: PayloadAction<{ ui: typeof uiSlice }, typeof HYDRATE>
      ) => {
        return {
          ...state,
          ...action.payload.ui
        };
      }
    );
  }
});

export const {
  incrementRTEditorIndex,
  setIsMobile,
  setScreenHeight,
  setScreenWidth
} = uiSlice.actions;
export const selectRTEditorIndex = (state) => state.ui.rteditorIndex;
export const selectIsMobile = (state) => state.ui.isMobile;
export const selectScreenHeight = (state) => state.ui.screenHeight;
export const selectScreenWidth = (state) => state.ui.screenWidth;

export default uiSlice.reducer;
