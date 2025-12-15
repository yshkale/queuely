import { Clock } from "lucide-react";

import localFont from "next/font/local";
import { AddContentDialog } from "./AddContentDialog";

const logoFont = localFont({
  src: "../app/fonts/Queuely-serif.ttf",
});

export const EmptyQueue = () => {
  return (
    <div className="flex flex-col items-center justify-center my-12 py-8 border border-neutral-200 rounded-lg border-dashed w-full bg-neutral-50 h-96 md:h-[480px]">
      <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mb-4 border border-neutral-200">
        <Clock className="text-black" strokeWidth={1.5} />
      </div>
      <div className="text-center space-y-1">
        <h2 className={`${logoFont.className} text-xl md:text-2xl text-black`}>
          It&apos;s quite here
        </h2>
        <p className="text-gray-500 text-sm md:text-base">
          You don&apos;t have any media in your watchlist list yet.
        </p>
      </div>

      <AddContentDialog
        noIcon={true}
        className="px-6 mt-4 font-semibold h-12"
        buttonLabel="Start adding content"
        showLabelOnMobile={true}
      />
    </div>
  );
};
