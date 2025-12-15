import { createSlice } from "@reduxjs/toolkit";

export interface AppState {
  activeTab: "backlog" | "history" | "active";
  activeCategory: "all" | "movies" | "tv-shows" | "books";
}

const initialState: AppState = {
  activeTab: "backlog",
  activeCategory: "all",
};

const slice = createSlice({
  name: "app",
  initialState,
  reducers: {
    resetAppState: () => initialState,
    changeActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    changeActiveCategory: (state, action) => {
      state.activeCategory = action.payload;
    },
  },
});

export const { resetAppState, changeActiveTab, changeActiveCategory } =
  slice.actions;

export const AppReducer = slice.reducer;
