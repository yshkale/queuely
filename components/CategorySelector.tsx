"use client";

import { Book, Clapperboard, LayoutGrid, Popcorn } from "lucide-react";
import { Button } from "./ui/button";
import { AppState, changeActiveCategory } from "@/store/App/app.slice";
import { useDispatch, useSelector } from "react-redux";

export const CategorySelector = () => {
  const dispatch = useDispatch();

  const activeCategory = useSelector(
    (state: AppState) => state.app.activeCategory,
  );

  const handleCategoryChange = (category: string) => {
    dispatch(changeActiveCategory(category));
  };

  return (
    <div className="flex flex-col md:flex-row gap-2 md:gap-6 items-start md:items-center mt-4 md:mt-0">
      <Button
        className="rounded-full w-18"
        onClick={() => handleCategoryChange("all")}
        variant={activeCategory === "all" ? "default" : "outline"}
      >
        <LayoutGrid />
        <span className="text-sm">All</span>
      </Button>

      <div className="w-px h-6 bg-neutral-400 hidden md:block" />

      <div className="space-x-2 md:space-x-4">
        <Button
          className="rounded-full w-24"
          onClick={() => handleCategoryChange("movies")}
          variant={activeCategory === "movies" ? "default" : "outline"}
        >
          <Popcorn />
          <span className="text-sm">Movies</span>
        </Button>

        <Button
          className="rounded-full w-28"
          onClick={() => handleCategoryChange("tv-shows")}
          variant={activeCategory === "tv-shows" ? "default" : "outline"}
        >
          <Clapperboard />
          <span className="text-sm">TV Shows</span>
        </Button>

        <Button
          className="rounded-full w-24"
          onClick={() => handleCategoryChange("books")}
          variant={activeCategory === "books" ? "default" : "outline"}
        >
          <Book />
          <span className="text-sm">Books</span>
        </Button>
      </div>
    </div>
  );
};
