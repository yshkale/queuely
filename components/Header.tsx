"use client";

import { toggleQueueCard } from "@/store/App/app.slice";
import { AddContentDialog } from "./AddContentDialog";
import { Logo } from "./Logo";

import { useDispatch, useSelector } from "react-redux";
import { Button } from "./ui/button";
import { PlusIcon } from "lucide-react";
import { StatusTabs } from "./StatusTabs";

export const Header = () => {
  const dispatch = useDispatch();

  const isDialogOpen = useSelector((state: any) => state.app.openQueueCard);

  return (
    <header className="flex justify-between items-center py-4 border-b border-neutral-100 lg:px-16 px-4">
      <div className="flex items-center gap-8">
        <Logo />
        <StatusTabs className="hidden md:block" />
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
