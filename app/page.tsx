"use client";

import { EmptyQueue } from "@/components/EmptyQueue";
import { Header } from "@/components/Header";
import { Navigation } from "@/components/Navigation";
import { QueueCard } from "@/components/QueueCard";
import { StatusTabs } from "@/components/StatusTabs";
import { Skeleton } from "@/components/ui/skeleton";
import { AsyncState } from "@/helper/constants";
import { getAllQueues } from "@/store/App/app.slice";
import { QueueItem } from "@/types";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function Home() {
  const dispatch = useDispatch();

  const allQueues = useSelector((state: any) => state.app.queues);
  const activeTab = useSelector((state: any) => state.app.activeTab);
  const activeCategory = useSelector((state: any) => state.app.activeCategory);
  const activeType =
    activeCategory === "movies"
      ? "movie"
      : activeCategory === "tv-shows"
        ? "tv"
        : activeCategory === "books"
          ? "book"
          : "all";

  const displayQueues = allQueues
    ?.filter((queue: QueueItem) => queue.status === activeTab)
    ?.filter(
      (queue: QueueItem) => activeType === "all" || queue.type === activeType,
    );

  const getQueuesApiStatus = useSelector(
    (state: any) => state.app.getQueuesApiStatus,
  );

  useEffect(() => {
    dispatch(getAllQueues());
  }, [dispatch]);

  return (
    <>
      <Header />
      <main className="px-4 md:px-20 py-6 md:py-10 space-y-4 relative">
        <Navigation />

        {displayQueues.length === 0 &&
        getQueuesApiStatus === AsyncState.FULFILLED ? (
          <EmptyQueue />
        ) : null}

        {getQueuesApiStatus === AsyncState.PENDING ? (
          <Skeleton className="h-96 w-full my-8 md:my-14" />
        ) : null}

        {getQueuesApiStatus === AsyncState.FULFILLED &&
        displayQueues.length > 0 ? (
          <div className="flex flex-row gap-1 md:gap-3 my-8 md:my-14 flex-wrap">
            {displayQueues.map((queue: QueueItem) => (
              <QueueCard key={queue.contentId} {...queue} />
            ))}
          </div>
        ) : null}
      </main>

      <div className="w-full flex justify-center">
        <StatusTabs className="w-7/8 fixed bottom-1 z-50 md:hidden" />
      </div>
    </>
  );
}
