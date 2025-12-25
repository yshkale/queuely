import { QueueItem } from "@/types";

export interface UpdateQueueStatusRequest {
  id: any;
  status: string;
}

export interface DeleteQueueRequest {
  id: any;
}

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

export const updateQueueStatus = async ({
  id,
  status,
}: UpdateQueueStatusRequest) => {
  try {
    const response = await fetch("/api/update-queue-status", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
        status,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseJson = await response.json();

    return responseJson.data;
  } catch (err) {
    console.error(err);
  }
};

export const deleteQueue = async ({ id }: DeleteQueueRequest) => {
  try {
    const response = await fetch("/api/delete-queue", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
      }),
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
