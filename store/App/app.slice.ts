import { createSlice } from "@reduxjs/toolkit";

export interface AppState {
  activeTab: "backlog" | "history" | "active";
}

const initialState: AppState = {
  activeTab: "backlog",
};

const slice = createSlice({
  name: "app",
  initialState,
  reducers: {
    resetAppState: () => initialState,
    changeActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
  },
});

export const { resetAppState, changeActiveTab } = slice.actions;

export const AppReducer = slice.reducer;
