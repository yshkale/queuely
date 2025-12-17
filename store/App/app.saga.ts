import { call, put, takeLatest } from "redux-saga/effects";
import { PayloadAction } from "@reduxjs/toolkit";
import { ActionState } from "../../helper/constants";
import { searchContent } from "@/services";
import { SagaIterator } from "redux-saga";

export const Actions = {
  searchContent: "search-content/",
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

export const appSaga = [...searchContentSaga()];
