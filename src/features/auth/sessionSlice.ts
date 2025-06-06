import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";
//import { AppState } from "store";
import { Session } from "features/auth";

const initialState: {
  isOffline: boolean;
  isSessionLoading: boolean;
  session: Session | null;
} = {
  isOffline: false,
  isSessionLoading: false,
  session: null
};

export const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    setIsOffline: (state, action: PayloadAction<boolean>) => {
      state.isOffline = action.payload;
    },
    setIsSessionLoading: (state, action: PayloadAction<boolean>) => {
      state.isSessionLoading = action.payload;
    },
    setSession: (state, action: PayloadAction<Session | null>) => {
      state.session = action.payload;
    }
  },

  extraReducers: (builder) => {
    builder.addCase(
      HYDRATE,
      (
        state,
        action: PayloadAction<{ session: typeof sessionSlice }, typeof HYDRATE>
      ) => {
        return {
          ...state,
          ...action.payload.session
        };
      }
    );
  }
});

export const { setIsOffline, setIsSessionLoading, setSession } =
  sessionSlice.actions;

export const selectIsOffline = (state) => state.session.isOffline;
export const selectIsSessionLoading = (state) => state.session.isSessionLoading;
export const selectSession = (state) => state.session.session;

export const session = sessionSlice.reducer;
