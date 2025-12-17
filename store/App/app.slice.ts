import { SearchResult } from "@/app/api/search/route";
import { ActionState, AsyncState } from "@/helper/constants";
import { createSlice } from "@reduxjs/toolkit";
import { Actions } from "./app.saga";
import { PayloadAction } from "@reduxjs/toolkit";
import { createAction } from "@reduxjs/toolkit";

export interface AppState {
  activeTab: "backlog" | "history" | "active";
  activeCategory: "all" | "movies" | "tv-shows" | "books";
  searchedContent: SearchResult[];
  searchContentApiStatus: string;
}

const initialState: AppState = {
  activeTab: "backlog",
  activeCategory: "all",
  searchedContent: [],
  searchContentApiStatus: AsyncState.IDLE,
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
    resetSearchedContent: (state) => {
      state.searchedContent = [];
      state.searchContentApiStatus = AsyncState.IDLE;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(Actions.searchContent + ActionState.PENDING, (state) => {
      state.searchContentApiStatus = AsyncState.PENDING;
    });
    builder.addCase(
      Actions.searchContent + ActionState.FULFILLED,
      (state, action: PayloadAction<SearchResult[]>) => {
        state.searchedContent = action.payload;
        state.searchContentApiStatus = AsyncState.FULFILLED;
      },
    );
    builder.addCase(Actions.searchContent + ActionState.REJECTED, (state) => {
      state.searchContentApiStatus = AsyncState.REJECTED;
      state.searchedContent = [];
    });
  },
});

export const {
  resetAppState,
  changeActiveTab,
  changeActiveCategory,
  resetSearchedContent,
} = slice.actions;

export const searchContent = createAction<string>(Actions.searchContent);

export const AppReducer = slice.reducer;
