export interface QueueItem {
  contentId: string;
  title: string;
  description?: string;
  type: "movie" | "tv" | "book";
  year?: string;
  author?: string;
  imageUrl: string;
  status: string;
}
