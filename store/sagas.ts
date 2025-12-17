import { all } from "redux-saga/effects";
import { appSaga } from "./App/app.saga";

export function* rootSaga() {
  // Add new Sagas here
  yield all([...appSaga]);
}
