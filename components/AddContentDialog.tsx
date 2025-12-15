import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Command, PlusIcon, SearchIcon } from "lucide-react";
import { Kbd } from "./ui/kbd";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";

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
  return (
    <Dialog>
      <DialogTrigger
        className={cn(
          "flex items-center gap-1.5 px-3 py-2 rounded-md md:rounded-lg bg-neutral-900 text-white cursor-pointer",
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
