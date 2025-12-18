"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Command, Loader2, PlusIcon, SearchIcon } from "lucide-react";
import { Kbd } from "./ui/kbd";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addContentToQueue,
  resetSearchedContent,
  searchContent,
} from "@/store/App/app.slice";
import { AsyncState } from "@/helper/constants";
import { SearchContentCard } from "./SearchContentCard";
import { SearchResult } from "@/app/api/search/route";

interface AddContentDialogProps {
  className?: string;
  noIcon?: boolean;
  buttonLabel?: string;
  noLabel?: boolean;
  showLabelOnMobile?: boolean;
}

export const AddContentDialog = ({
  className,
  noIcon,
  buttonLabel = "Add Content",
  noLabel,
  showLabelOnMobile = false,
}: AddContentDialogProps) => {
  const dispatch = useDispatch();

  const [searchQuery, setSearchQuery] = useState<string>("");

  const searchedContent = useSelector(
    (state: any) => state.app.searchedContent,
  );
  const searchContentApiStatus = useSelector(
    (state: any) => state.app.searchContentApiStatus,
  );

  useEffect(() => {
    dispatch(resetSearchedContent());
    if (searchQuery.length === 0) return;

    const timeoutId = setTimeout(() => {
      dispatch(searchContent(searchQuery));
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, dispatch]);

  const handleClose = () => {
    dispatch(resetSearchedContent());
    setSearchQuery("");
  };

  const handleAddContentToQueue = (content: SearchResult) => {
    const queueItem = {
      contentId: content.id,
      title: content.title,
      description: content.description || "",
      type: content.type,
      year: content.releaseDate || undefined,
      author: (content.authors?.length && content.authors[0]) || "Unknown",
      imageUrl: content.imageUrl || `https://avatar.vercel.sh/${content.id}`,
      status: "backlog",
    };
    dispatch(addContentToQueue(queueItem));
  };

  return (
    <Dialog onOpenChange={(open) => !open && handleClose()}>
      <DialogTrigger
        className={cn(
          "flex items-center gap-1.5 px-3 py-2 rounded-md md:rounded-lg bg-neutral-900 text-white cursor-pointer h-10",
          className,
        )}
      >
        {noIcon ? null : <PlusIcon size={13} strokeWidth={3} />}
        {!noLabel && (
          <p
            className={cn(
              "text-sm",
              !showLabelOnMobile && "hidden md:block", // Hide on mobile unless showLabelOnMobile is true
            )}
          >
            {buttonLabel}
          </p>
        )}
      </DialogTrigger>
      <DialogContent className="[&>button]:hidden p-0 top-[40%] md:min-w-[520px]">
        <DialogTitle className="hidden">hidden</DialogTitle>
        <DialogDescription className="hidden">hidden</DialogDescription>
        <div className="flex items-center justify-between gap-4 p-4 bg-neutral-100 rounded-t-lg border-b border-neutral-300">
          <div className="flex items-center w-full">
            <SearchIcon size={18} />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              type="text"
              placeholder="Search for movies, shows, or books..."
              className="border-none shadow-none flex-1 font-semibold md:text-lg bg-neutral-100 focus-visible:ring-0"
            />
          </div>
          <Kbd className="border border-neutral-200 px-2 py-3">ESC</Kbd>
        </div>

        <div className="min-h-54">
          {(searchQuery === "" ||
            searchContentApiStatus === AsyncState.IDLE) && (
            <div className="w-full flex flex-col items-center justify-center py-8 gap-4">
              <Command size={54} className="text-neutral-300" />
              <p className="text-sm text-neutral-400">
                start typing to add your queue
              </p>
            </div>
          )}

          {searchContentApiStatus === AsyncState.PENDING && (
            <div className="w-full flex flex-col gap-3 uppercase items-center justify-center h-full">
              <Loader2 className="animate-spin" strokeWidth={1.2} />
              <p className="text-sm text-neutral-400 font-mono">
                Searching the universe...
              </p>
            </div>
          )}

          {searchedContent?.count > 0 && (
            <section className="space-y-4 px-4 overflow-y-scroll h-96">
              <p className="uppercase font-semibold text-sm text-neutral-500">
                {searchedContent?.count} Content
              </p>
              {searchedContent?.results?.map((content: SearchResult) => (
                <div
                  key={content.id}
                  onClick={() => handleAddContentToQueue(content)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && handleAddContentToQueue(content)
                  }
                >
                  <SearchContentCard {...content} />
                </div>
              ))}
            </section>
          )}

          {searchContentApiStatus === AsyncState.FULFILLED &&
            searchedContent?.count === 0 &&
            searchQuery !== "" &&
            searchContentApiStatus !== AsyncState.PENDING && (
              <div className="w-full flex flex-col gap-4 uppercase items-center justify-center h-full">
                <Command size={54} className="text-neutral-300" />
                <p className="text-sm text-neutral-400 font-mono">
                  No results found
                </p>
              </div>
            )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
