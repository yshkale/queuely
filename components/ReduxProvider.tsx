"use client";

import { store } from "@/store";
import { Provider } from "react-redux";
import { Toaster } from "./ui/sonner";

export const ReduxProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <Provider store={store}>
      {children}
      <Toaster />
    </Provider>
  );
};
