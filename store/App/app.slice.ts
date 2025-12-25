import { SearchResult } from "@/app/api/search/route";
import { ActionState, AsyncState } from "@/helper/constants";
import { createSlice } from "@reduxjs/toolkit";
import { Actions } from "./app.saga";
import { PayloadAction } from "@reduxjs/toolkit";
import { createAction } from "@reduxjs/toolkit";
import { QueueItem } from "@/types";
import { UpdateQueueStatusRequest } from "@/services";

export interface AppState {
  activeTab: "backlog" | "history" | "active";
  activeCategory: "all" | "movies" | "tv-shows" | "books";
  searchedContent: SearchResult[];
  searchContentApiStatus: string;
  addContentToQueueResponse: any;
  addContentToQueueApiStatus: string;
  queues: QueueItem[];
  getQueuesApiStatus: string;
  openQueueCard: boolean;
  updateQueueStatusResponse: null | QueueItem;
  updateQueueStatusApiStatus: string;
}

const initialState: AppState = {
  activeTab: "backlog",
  activeCategory: "all",
  searchedContent: [],
  searchContentApiStatus: AsyncState.IDLE,

  addContentToQueueResponse: null,
  addContentToQueueApiStatus: AsyncState.IDLE,

  queues: [],
  getQueuesApiStatus: AsyncState.IDLE,
  openQueueCard: false,

  updateQueueStatusResponse: null,
  updateQueueStatusApiStatus: AsyncState.IDLE,
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
    toggleQueueCard: (state, action) => {
      state.openQueueCard = action.payload;
    },
    addQueueItemOptimistically: (state, action: PayloadAction<QueueItem>) => {
      state.queues.unshift(action.payload);
    },
    updateQueueStatusOptimistically: (
      state,
      action: PayloadAction<UpdateQueueStatusRequest>,
    ) => {
      state.queues = state.queues.map((queue) => {
        if (queue.id === action.payload.id) {
          return {
            ...queue,
            status: action.payload.status,
          };
        }
        return queue;
      });
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

    builder.addCase(
      Actions.addContentToQueue + ActionState.PENDING,
      (state) => {
        state.addContentToQueueApiStatus = AsyncState.PENDING;
      },
    );
    builder.addCase(
      Actions.addContentToQueue + ActionState.FULFILLED,
      (state, action: PayloadAction<QueueItem>) => {
        state.addContentToQueueResponse = action.payload;
        state.addContentToQueueApiStatus = AsyncState.FULFILLED;
      },
    );
    builder.addCase(
      Actions.addContentToQueue + ActionState.REJECTED,
      (state) => {
        state.addContentToQueueApiStatus = AsyncState.REJECTED;
        state.addContentToQueueResponse = null;
      },
    );

    builder.addCase(Actions.getQueues + ActionState.PENDING, (state) => {
      state.getQueuesApiStatus = AsyncState.PENDING;
    });
    builder.addCase(
      Actions.getQueues + ActionState.FULFILLED,
      (state, action: PayloadAction<QueueItem[]>) => {
        state.queues = action.payload;
        state.getQueuesApiStatus = AsyncState.FULFILLED;
      },
    );
    builder.addCase(Actions.getQueues + ActionState.REJECTED, (state) => {
      state.getQueuesApiStatus = AsyncState.REJECTED;
      state.queues = [];
    });

    builder.addCase(
      Actions.updateQueueStatus + ActionState.PENDING,
      (state) => {
        state.updateQueueStatusApiStatus = AsyncState.PENDING;
      },
    );
    builder.addCase(
      Actions.updateQueueStatus + ActionState.FULFILLED,
      (state, action: PayloadAction<QueueItem>) => {
        state.updateQueueStatusResponse = action.payload;
        state.updateQueueStatusApiStatus = AsyncState.FULFILLED;
      },
    );
    builder.addCase(
      Actions.updateQueueStatus + ActionState.REJECTED,
      (state) => {
        state.updateQueueStatusApiStatus = AsyncState.REJECTED;
      },
    );
  },
});

export const {
  resetAppState,
  changeActiveTab,
  changeActiveCategory,
  resetSearchedContent,
  toggleQueueCard,
  addQueueItemOptimistically,
  updateQueueStatusOptimistically,
} = slice.actions;

export const searchContent = createAction<string>(Actions.searchContent);
export const addContentToQueue = createAction<QueueItem>(
  Actions.addContentToQueue,
);
export const getAllQueues = createAction(Actions.getQueues);
export const updateQueueStatus = createAction<UpdateQueueStatusRequest>(
  Actions.updateQueueStatus,
);

export const AppReducer = slice.reducer;
