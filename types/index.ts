export interface QueueItem {
  id: string;
  contentId: string;
  title: string;
  description?: string;
  type: "movie" | "tv" | "book";
  year?: string;
  author?: string;
  imageUrl: string;
  status: string;
  director?: string;
}
