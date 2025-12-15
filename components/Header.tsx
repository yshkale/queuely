"use client";

import { AppState, changeActiveTab } from "@/store/App/app.slice";
import { AddContentDialog } from "./AddContentDialog";
import { Logo } from "./Logo";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { useDispatch, useSelector } from "react-redux";

export const Header = () => {
  const activeTab = useSelector((state: AppState) => state.activeTab);
  const dispatch = useDispatch();

  const handleTabChange = (tab: "backlog" | "history" | "active") => {
    dispatch(changeActiveTab(tab));
  };

  return (
    <header className="flex justify-between items-center py-4 border-b border-neutral-200 px-16">
      <div className="flex items-center gap-8">
        <Logo />
        <Tabs
          value={activeTab}
          defaultValue="backlog"
          className="w-[400px] mt-1.5"
          onValueChange={(value: string) =>
            handleTabChange(value as "backlog" | "history" | "active")
          }
        >
          <TabsList>
            <TabsTrigger value="backlog">
              Backlog{" "}
              <span className="text-xs mt-0.5 text-neutral-500 font-medium">
                65
              </span>
            </TabsTrigger>
            <TabsTrigger value="active">
              Active{" "}
              <span className="text-xs mt-0.5 text-neutral-500 font-medium">
                2
              </span>
            </TabsTrigger>
            <TabsTrigger value="history">
              History{" "}
              <span className="text-xs mt-0.5 text-neutral-500 font-medium">
                4
              </span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <AddContentDialog />
    </header>
  );
};
