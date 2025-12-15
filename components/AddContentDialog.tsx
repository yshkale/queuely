import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Command, PlusIcon, SearchIcon } from "lucide-react";
import { Kbd } from "./ui/kbd";
import { Input } from "./ui/input";

export const AddContentDialog = () => {
  return (
    <Dialog>
      <DialogTrigger className="flex items-center gap-2 border border-neutral-200 px-3 py-2 rounded-md hover:bg-neutral-100">
        <PlusIcon size={14} />
        <p className="text-sm">Add Content</p>
      </DialogTrigger>
      <DialogContent className="[&>button]:hidden p-0 top-[40%] min-w-[480px]">
        <div className="flex items-center justify-between gap-4 p-4 bg-neutral-100 rounded-t-lg border-b border-neutral-300">
          <div className="flex items-center w-full">
            <SearchIcon size={18} />
            <Input
              type="text"
              placeholder="Search for movies, shows, or books..."
              className="border-none shadow-none flex-1 font-semibold md:text-lg bg-neutral-100 focus-visible:ring-0"
            />
          </div>
          <Kbd className="border border-neutral-200">ESC</Kbd>
        </div>

        <div className="min-h-46">
          <div className="w-full flex flex-col items-center justify-center py-8 gap-4">
            <Command size={54} className="text-neutral-300" />
            <p className="text-sm text-neutral-400">
              start typing to add your queue
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
