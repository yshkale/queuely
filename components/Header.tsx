"use client";

import { changeActiveTab, toggleQueueCard } from "@/store/App/app.slice";
import { AddContentDialog } from "./AddContentDialog";
import { Logo } from "./Logo";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "./ui/button";
import { PlusIcon } from "lucide-react";

export const Header = () => {
  const activeTab = useSelector((state: any) => state.app.activeTab);
  const dispatch = useDispatch();

  const isDialogOpen = useSelector((state: any) => state.app.openQueueCard);

  const handleTabChange = (tab: "backlog" | "history" | "active") => {
    dispatch(changeActiveTab(tab));
  };

  return (
    <header className="flex justify-between items-center py-4 border-b border-neutral-100 lg:px-16 px-4">
      <div className="flex items-center gap-8">
        <Logo />
        <Tabs
          value={activeTab}
          defaultValue="backlog"
          className="w-[400px] mt-1.5 hidden md:block"
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

      <Button
        className="flex items-center gap-1.5 px-3 py-2 rounded-md md:rounded-lg bg-neutral-900 text-white cursor-pointer h-10"
        onClick={() => {
          dispatch(toggleQueueCard(true));
        }}
      >
        <PlusIcon size={13} strokeWidth={3} />
        <p className="text-sm hidden md:block">Add Content</p>
      </Button>

      {isDialogOpen && <AddContentDialog />}
    </header>
  );
};
