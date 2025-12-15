import localFont from "next/font/local";
import { CategorySelector } from "./CategorySelector";

const logoFont = localFont({
  src: "../app/fonts/Queuely-serif.ttf",
});

export const Navigation = () => {
  return (
    <section className="flex flex-col md:flex-row items-start md:items-center justify-between">
      <div className="space-y-1">
        <h2
          className={`${logoFont.className} text-3xl tracking-tight text-black`}
        >
          Your Queue
        </h2>
        <p className="text-neutral-500 mb-2 md:mb-0">
          Keep track of what matters. 0 items found.
        </p>
      </div>

      <CategorySelector />
    </section>
  );
};
