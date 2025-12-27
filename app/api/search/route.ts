import { searchBooks } from "@/lib/api-clients/books";
import {
  getImageUrl,
  getMovieCredits,
  getTVCredits,
  searchMovies,
  searchTVShows,
} from "@/lib/api-clients/tmdb";
import { NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export interface SearchResult {
  id: string;
  type: "movie" | "tv" | "book";
  title: string;
  description: string;
  imageUrl: string | null;
  releaseDate: string | null;
  rating?: number;
  authors?: string[];
  director?: string;
  popularity?: number;
}
const rateLimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(15, "1 m"),
});

export async function GET(request: any) {
  const ip = request.ip ?? "127.0.0.1";
  const { success } = await rateLimit.limit(ip);

  if (!success) {
    return NextResponse.json({
      error: "Rate limit exceeded",
      status: 429,
    });
  }

  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("query");

    if (!query) {
      return NextResponse.json({
        error: "Query parameter is required",
        status: 400,
      });
    }

    const results: SearchResult[] = [];

    try {
      const movies = await searchMovies(query);
      const moviesWithDirectors = await Promise.all(
        movies.slice(0, 10).map(async (movie) => ({
          id: `movie-${movie.id}`,
          type: "movie" as const,
          title: movie.title,
          description: movie.overview,
          imageUrl: getImageUrl(movie.poster_path),
          releaseDate: movie.release_date,
          rating: movie.vote_average,
          popularity: movie.popularity || 0,
          director: await getMovieCredits(movie.id).catch(() => undefined),
        })),
      );
      results.push(...moviesWithDirectors);
    } catch (e) {
      console.error("Movie search failed:", e);
    }

    try {
      const tvShows = await searchTVShows(query);
      const tvWithDirectors = await Promise.all(
        tvShows.slice(0, 10).map(async (show) => ({
          id: `tv-${show.id}`,
          type: "tv" as const,
          title: show.name,
          description: show.overview,
          imageUrl: getImageUrl(show.poster_path),
          releaseDate: show.first_air_date,
          rating: show.vote_average,
          popularity: show.popularity || 0,
          director: await getTVCredits(show.id).catch(() => undefined),
        })),
      );
      results.push(...tvWithDirectors);
    } catch (e) {
      console.error("TV search failed:", e);
    }

    try {
      const books = await searchBooks(query);
      results.push(
        ...books.map((book) => ({
          id: `book-${book.id}`,
          type: "book" as const,
          title: book.volumeInfo.title,
          description: book.volumeInfo.description || "",
          imageUrl: `https://books.google.com/books/publisher/content/images/frontcover/${book.id}?fife=w800-h1200&source=gbs_api`,
          releaseDate: book.volumeInfo.publishedDate || null,
          authors: book.volumeInfo.authors,
          popularity: 0,
        })),
      );
    } catch (e) {
      console.error("Book search failed:", e);
    }

    const sortedResults = results
      .sort((a, b) => (b.popularity ?? 0) - (a.popularity ?? 0))
      ?.slice(0, 10);

    return NextResponse.json({
      query,
      count: sortedResults.length,
      results: sortedResults,
    });
  } catch (err) {
    console.error("search API error:", err);
    return NextResponse.json({
      error: "Failed to search content",
      status: 500,
    });
  }
}
