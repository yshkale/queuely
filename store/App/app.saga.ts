import { call, put, takeLatest } from "redux-saga/effects";
import { PayloadAction } from "@reduxjs/toolkit";
import { ActionState } from "../../helper/constants";
import {
  addContentToQueue,
  deleteQueue,
  DeleteQueueRequest,
  getQueues,
  searchContent,
  updateQueueStatus,
  UpdateQueueStatusRequest,
} from "@/services";
import { SagaIterator } from "redux-saga";
import { QueueItem } from "@/types";
import { toast } from "sonner";
import {
  addQueueItemBack,
  removeQueueItemOptimistically,
  updateQueueStatusOptimistically,
} from "./app.slice";

export const Actions = {
  searchContent: "search-content/",
  addContentToQueue: "add-content-to-queue/",
  getQueues: "get-queues/",
  updateQueueStatus: "update-queue-status/",
  deleteQueue: "delete-queue/",
};

function* searchContentSaga() {
  yield takeLatest(
    Actions.searchContent,
    function* (action: PayloadAction<string>): SagaIterator {
      try {
        yield put({
          type: Actions.searchContent + ActionState.PENDING,
          payload: {},
        });

        const query = action.payload;
        const data = yield call(async () => {
          return searchContent(query);
        });

        yield put({
          type: Actions.searchContent + ActionState.FULFILLED,
          payload: data,
        });
      } catch (err) {
        yield put({
          type: Actions.searchContent + ActionState.REJECTED,
          payload: err,
        });
        toast.error("Search failed. Please try again.");
      }
    },
  );
}

function* addContentToQueueSaga() {
  yield takeLatest(
    Actions.addContentToQueue,
    function* (action: PayloadAction<QueueItem>): SagaIterator {
      try {
        yield put({
          type: Actions.addContentToQueue + ActionState.PENDING,
          payload: {},
        });

        const queueItem = action.payload;
        const data = yield call(async () => {
          return addContentToQueue(queueItem);
        });

        yield put({
          type: Actions.addContentToQueue + ActionState.FULFILLED,
          payload: data,
        });
        toast.success("Added to your queue!");
      } catch (err) {
        yield put({
          type: Actions.addContentToQueue + ActionState.REJECTED,
          payload: err,
        });
        yield put(
          removeQueueItemOptimistically({ contentId: action.payload.contentId }),
        );
        toast.error("Failed to add item. Please try again.");
      }
    },
  );
}

function* getQueuesSaga() {
  yield takeLatest(Actions.getQueues, function* (): SagaIterator {
    try {
      yield put({
        type: Actions.getQueues + ActionState.PENDING,
        payload: {},
      });

      const data = yield call(async () => {
        return getQueues();
      });

      yield put({
        type: Actions.getQueues + ActionState.FULFILLED,
        payload: data,
      });
    } catch (err) {
      yield put({
        type: Actions.getQueues + ActionState.REJECTED,
        payload: err,
      });
    }
  });
}

function* updateQueueStatusSaga() {
  yield takeLatest(
    Actions.updateQueueStatus,
    function* (action: PayloadAction<UpdateQueueStatusRequest>): SagaIterator {
      try {
        yield put({
          type: Actions.updateQueueStatus + ActionState.PENDING,
          payload: {},
        });

        const payload = action.payload;
        const data = yield call(async () => {
          return updateQueueStatus(payload);
        });

        yield put({
          type: Actions.updateQueueStatus + ActionState.FULFILLED,
          payload: data,
        });
        toast.success("Status updated!");
      } catch (err) {
        yield put({
          type: Actions.updateQueueStatus + ActionState.REJECTED,
          payload: err,
        });
        if (action.payload.originalStatus !== undefined) {
          yield put(
            updateQueueStatusOptimistically({
              id: action.payload.id,
              status: action.payload.originalStatus,
            }),
          );
        }
        toast.error("Failed to update status. Changes reverted.");
      }
    },
  );
}

function* deleteQueueSaga() {
  yield takeLatest(
    Actions.deleteQueue,
    function* (action: PayloadAction<DeleteQueueRequest>): SagaIterator {
      try {
        yield put({
          type: Actions.deleteQueue + ActionState.PENDING,
          payload: {},
        });

        const payload = action.payload;
        const data = yield call(async () => {
          return deleteQueue(payload);
        });

        yield put({
          type: Actions.deleteQueue + ActionState.FULFILLED,
          payload: data,
        });
        toast.success("Removed from queue!");
      } catch (err) {
        yield put({
          type: Actions.deleteQueue + ActionState.REJECTED,
          payload: err,
        });
        if (action.payload.originalItem) {
          yield put(addQueueItemBack(action.payload.originalItem));
        }
        toast.error("Failed to remove item. Changes reverted.");
      }
    },
  );
}

export const appSaga = [
  ...searchContentSaga(),
  ...addContentToQueueSaga(),
  ...getQueuesSaga(),
  ...updateQueueStatusSaga(),
  ...deleteQueueSaga(),
];
