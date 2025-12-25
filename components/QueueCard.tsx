import { QueueItem } from "@/types";
import { Card, CardFooter, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { CheckCircle2, PlayIcon } from "lucide-react";

import localFont from "next/font/local";

import { Button } from "./ui/button";
import { getBookGradient } from "@/helper/getBookGradient";
import { useDispatch, useSelector } from "react-redux";
import {
  updateQueueStatus,
  updateQueueStatusOptimistically,
} from "@/store/App/app.slice";
import { toast } from "sonner";

const logoFont = localFont({
  src: "../app/fonts/Queuely-serif.ttf",
});

export const QueueCard = ({
  id,
  title,
  imageUrl,
  status,
  type,
  year,
  author,
  director,
}: QueueItem) => {
  const dispatch = useDispatch();

  const activeTab = useSelector((state: any) => state.app.activeTab);

  const handleStatusChange = () => {
    const statusToChange =
      activeTab === "backlog"
        ? "active"
        : activeTab === "active"
          ? "history"
          : "backlog";

    dispatch(
      updateQueueStatus({
        id,
        status: statusToChange,
      }),
    );
    dispatch(
      updateQueueStatusOptimistically({
        id,
        status: statusToChange,
      }),
    );

    toast.success(`${title} moved to ${statusToChange}`);
  };

  return (
    <Card
      style={{
        backgroundImage:
          type === "book"
            ? `linear-gradient(to top, ${getBookGradient()}, ${getBookGradient(true)})`
            : `url(${imageUrl})`,
      }}
      className="relative bg-no-repeat bg-cover bg-center w-[49%] h-68 md:w-3xs md:min-h-96
                 before:absolute before:inset-0
                 before:bg-linear-to-t before:from-black before:to-transparent overflow-hidden shrink-0"
    >
      <CardHeader className="relative z-10 px-3 md:px-4">
        <Badge className="rounded-sm uppercase font-mono tracking-wide bg-neutral-700/40 text-white">
          {status}
        </Badge>
      </CardHeader>

      <CardFooter className="relative z-10 mt-auto flex flex-col items-start gap-1 px-3 md:px-4">
        <div className="flex items-center text-neutral-200 font-semibold gap-1.5">
          <PlayIcon size={12} />
          <p className="uppercase text-xs flex items-center gap-1.5">
            <span>
              {type === "movie"
                ? "Movie"
                : type === "tv"
                  ? "TV Show"
                  : type === "book"
                    ? "Book"
                    : "Unknown"}
            </span>
            {year && (
              <span className="text-neutral-300 font-bold">&middot;</span>
            )}
            {year && <span>{year.slice(0, 4)}</span>}
          </p>
        </div>

        <div className="space-y-1 md:space-y-2 mt-1">
          <h3
            className={`${logoFont.className} text-lg md:text-2xl text-neutral-50 leading-6`}
          >
            {title}
          </h3>
          <p className="text-neutral-200 text-xs md:text-sm">
            {type === "book" ? author : director}
          </p>
        </div>

        <Button
          className="cursor-pointer w-full text-xs uppercase font-mono tracking-wide bg-neutral-900/30 text-white border border-neutral-800 mt-2 hover:bg-black/30"
          onClick={handleStatusChange}
        >
          {activeTab === "active" ? <CheckCircle2 /> : <PlayIcon />}
          {activeTab === "backlog"
            ? "Start"
            : activeTab === "active"
              ? "Complete"
              : "Start again"}
        </Button>
      </CardFooter>
    </Card>
  );
};
