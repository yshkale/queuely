"use client";

import { EmptyQueue } from "@/components/EmptyQueue";
import { Header } from "@/components/Header";
import { Navigation } from "@/components/Navigation";
import { QueueCard } from "@/components/QueueCard";
import { Skeleton } from "@/components/ui/skeleton";
import { AsyncState } from "@/helper/constants";
import { getAllQueues } from "@/store/App/app.slice";
import { QueueItem } from "@/types";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function Home() {
  const dispatch = useDispatch();

  const allQueues = useSelector((state: any) => state.app.queues);
  const getQueuesApiStatus = useSelector(
    (state: any) => state.app.getQueuesApiStatus,
  );

  useEffect(() => {
    dispatch(getAllQueues());
  }, [dispatch]);

  return (
    <>
      <Header />
      <main className="px-4 md:px-20 py-8 md:py-10 space-y-4">
        <Navigation />

        {allQueues.length === 0 &&
        getQueuesApiStatus === AsyncState.FULFILLED ? (
          <EmptyQueue />
        ) : null}

        {getQueuesApiStatus === AsyncState.PENDING ? (
          <Skeleton className="h-96 w-full my-14" />
        ) : null}

        {getQueuesApiStatus === AsyncState.FULFILLED && allQueues.length > 0 ? (
          <div className="flex gap-1 md:gap-6 my-10 md:my-20">
            {allQueues.map((queue: QueueItem) => (
              <QueueCard key={queue.contentId} {...queue} />
            ))}
          </div>
        ) : null}
      </main>
    </>
  );
}
