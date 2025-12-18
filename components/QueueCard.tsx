import { QueueItem } from "@/types";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { PlayIcon } from "lucide-react";

import localFont from "next/font/local";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";

const logoFont = localFont({
  src: "../app/fonts/Queuely-serif.ttf",
});

export const QueueCard = ({
  title,
  description,
  imageUrl,
  status,
  type,
  year,
  author,
}: QueueItem) => {
  console.log(status);
  return (
    <Card
      style={{ backgroundImage: `url(${imageUrl})` }}
      className="relative bg-no-repeat bg-cover bg-center w-3xs min-h-96
                 before:absolute before:inset-0
                 before:bg-linear-to-t before:from-black before:to-transparent overflow-hidden"
    >
      <CardHeader className="relative z-10">
        <Badge className="rounded-sm uppercase font-mono tracking-wide bg-neutral-200 text-neutral-800">
          {status}
        </Badge>
      </CardHeader>

      <CardFooter className="relative z-10 mt-auto flex flex-col items-start gap-1">
        <div className="flex items-center text-neutral-300 font-semibold gap-1.5">
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
              <span className="text-neutral-400 font-bold">&middot;</span>
            )}
            {year && <span>{year.slice(0, 4)}</span>}
          </p>
        </div>

        <div>
          <h3 className={`${logoFont.className} text-2xl text-neutral-100`}>
            {title}
          </h3>
          <p className="text-neutral-300 text-sm">{author}</p>
        </div>

        <Separator className="bg-neutral-300 my-2" />

        {description && (
          <p className="text-sm text-neutral-300">
            {description.slice(0, 80)}...
          </p>
        )}

        <Button className="cursor-pointer w-full text-xs uppercase font-mono tracking-wide bg-neutral-200 text-neutral-800 mt-2 hover:bg-neutral-200">
          <PlayIcon />
          Start
        </Button>
      </CardFooter>
    </Card>
  );
};
