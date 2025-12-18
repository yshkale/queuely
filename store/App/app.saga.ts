import { call, put, takeLatest } from "redux-saga/effects";
import { PayloadAction } from "@reduxjs/toolkit";
import { ActionState } from "../../helper/constants";
import { addContentToQueue, getQueues, searchContent } from "@/services";
import { SagaIterator } from "redux-saga";
import { QueueItem } from "@/types";

export const Actions = {
  searchContent: "search-content/",
  addContentToQueue: "add-content-to-queue/",
  getQueues: "get-queues/",
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
      } catch (err) {
        yield put({
          type: Actions.addContentToQueue + ActionState.REJECTED,
          payload: err,
        });
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

export const appSaga = [
  ...searchContentSaga(),
  ...addContentToQueueSaga(),
  ...getQueuesSaga(),
];
