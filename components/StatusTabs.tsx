import { useDispatch, useSelector } from "react-redux";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { QueueItem } from "@/types";
import { changeActiveTab } from "@/store/App/app.slice";

interface StatusTabsProps {
  className?: string;
}

export const StatusTabs = ({ className }: StatusTabsProps) => {
  const dispatch = useDispatch();

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

  const handleTabChange = (tab: "backlog" | "history" | "active") => {
    dispatch(changeActiveTab(tab));
  };

  return (
    <Tabs
      value={activeTab}
      defaultValue="backlog"
      className={`w-[400px] mt-1.5 ${className}`}
      onValueChange={(value: string) =>
        handleTabChange(value as "backlog" | "history" | "active")
      }
    >
      <TabsList
        className={`${className} bg-white/40 md:bg-muted backdrop-blur-sm`}
      >
        <TabsTrigger value="backlog">
          Backlog{" "}
          <span className="text-xs mt-[1.5px] md:mt-1 text-neutral-500 font-medium">
            {backlogs}
          </span>
        </TabsTrigger>
        <TabsTrigger value="active">
          Active{" "}
          <span className="text-xs mt-[1.5px] md:mt-1 text-neutral-500 font-medium">
            {active}
          </span>
        </TabsTrigger>
        <TabsTrigger value="history">
          History{" "}
          <span className="text-xs mt-[1.5px] md:mt-1 text-neutral-500 font-medium">
            {history}
          </span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};
