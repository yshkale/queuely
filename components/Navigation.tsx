import localFont from "next/font/local";
import { CategorySelector } from "./CategorySelector";
import { useSelector } from "react-redux";
import { QueueItem } from "@/types";

const logoFont = localFont({
  src: "../app/fonts/Queuely-serif.ttf",
});

export const Navigation = () => {
  const activeTab = useSelector((state: any) => state.app.activeTab);
  const allQueues = useSelector((state: any) => state.app.queues);
  const backlogs = allQueues.filter(
    (queue: QueueItem) => queue.status === "backlog",
  )?.length;
  const history = allQueues.filter(
    (queue: QueueItem) => queue.status === "history",
  )?.length;
  const active = allQueues.filter(
    (queue: QueueItem) => queue.status === "active",
  )?.length;

  return (
    <section className="flex flex-col md:flex-row items-start md:items-center justify-between">
      <div className="space-y-1">
        <h2 className={`${logoFont.className} text-3xl text-neutral-950`}>
          {activeTab === "backlog"
            ? "Your Queue"
            : activeTab === "history"
              ? "Archive"
              : "Currently Watching"}
        </h2>
        <p className="text-neutral-500 mb-2 md:mb-0">
          Keep track of what matters.{" "}
          {activeTab === "backlog"
            ? backlogs
            : activeTab === "history"
              ? history
              : active}{" "}
          items found.
        </p>
      </div>

      <CategorySelector />
    </section>
  );
};
