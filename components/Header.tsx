"use client";

import { toggleQueueCard } from "@/store/App/app.slice";
import { AddContentDialog } from "./AddContentDialog";
import { Logo } from "./Logo";
import { createClient } from "@/lib/supabase/client";

import { useDispatch, useSelector } from "react-redux";
import { Button } from "./ui/button";
import { PlusIcon, LogOut } from "lucide-react";
import { StatusTabs } from "./StatusTabs";
import { useRouter } from "next/navigation";

export const Header = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const isDialogOpen = useSelector((state: any) => state.app.openQueueCard);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/landing");
    router.refresh();
  };

  return (
    <header className="flex justify-between items-center py-4 border-b border-neutral-100 lg:px-16 px-4">
      <div className="flex items-center gap-8">
        <Logo />
        <StatusTabs className="hidden md:block" />
      </div>

      <div className="flex items-center gap-2">
        <Button
          className="flex items-center gap-1.5 px-3 py-2 rounded-md md:rounded-lg bg-neutral-900 text-white cursor-pointer h-10"
          onClick={() => {
            dispatch(toggleQueueCard(true));
          }}
        >
          <PlusIcon size={13} strokeWidth={3} />
          <p className="text-sm hidden md:block">Add Content</p>
        </Button>

        <Button
          variant="secondary"
          className="h-10 w-10 p-0 text-neutral-500 hover:text-neutral-900"
          onClick={handleSignOut}
          title="Sign out"
        >
          <LogOut size={16} />
        </Button>
      </div>

      {isDialogOpen && <AddContentDialog />}
    </header>
  );
};
