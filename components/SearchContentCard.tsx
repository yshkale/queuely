import { SearchResult } from "@/app/api/search/route";

import Image from "next/image";
import { Badge } from "./ui/badge";

export const SearchContentCard = ({
  imageUrl,
  title,
  releaseDate,
  description,
  type,
}: SearchResult) => {
  const typeLabel =
    type === "movie"
      ? "Movie"
      : type === "tv"
        ? "TV Show"
        : type === "book"
          ? "Book"
          : "Unknown";
  return (
    <section className="flex items-start gap-3 border-b border-zinc-200 pb-4 cursor-pointer p-1">
      <Image
        src={imageUrl || `https://avatar.vercel.sh/${title}`}
        alt={title}
        width={60}
        height={80}
        className="rounded-sm border border-neutral-300 mt-0.5"
      />

      <div className="space-y-0.5">
        <div className="flex items-center justify-between gap-2">
          <div className="mr-2">
            <p className="font-semibold leading-5">
              {title}{" "}
              <span className="text-neutral-500 text-sm mt-0.5 mr-auto">
                &middot; {releaseDate?.slice(0, 4)}
              </span>
            </p>
          </div>

          <Badge className="rounded-sm bg-neutral-100 border border-neutral-300 text-neutral-600 mb-1">
            {typeLabel}
          </Badge>
        </div>

        {description && (
          <p className="text-neutral-800 text-sm">{description}</p>
        )}
      </div>
    </section>
  );
};
