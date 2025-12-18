import { QueueItem } from "@/types";

export const searchContent = async (query: string) => {
  try {
    const response = await fetch(`/api/search?query=${query}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseJson = await response.json();

    return responseJson;
  } catch (err) {
    console.error(err);
  }
};

export const addContentToQueue = async (queueItem: QueueItem) => {
  try {
    const response = await fetch("/api/queue", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(queueItem),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseJson = await response.json();

    return responseJson;
  } catch (err) {
    console.error(err);
  }
};

export const getQueues = async () => {
  try {
    const response = await fetch("/api/queue", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseJson = await response.json();

    return responseJson.queues;
  } catch (err) {
    console.error(err);
  }
};
