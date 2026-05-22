import { searchBooks } from "@/lib/api-clients/books";
import {
  getImageUrl,
  searchMovies,
  searchTVShows,
} from "@/lib/api-clients/tmdb";
import { createClient } from "@/lib/supabase/server";
import { checkRateLimit } from "@/lib/ratelimit";
import { NextRequest, NextResponse } from "next/server";

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

const RESULTS_PER_TYPE = 5;

export async function GET(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] ?? "127.0.0.1";
  if (!await checkRateLimit(ip)) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const query = request.nextUrl.searchParams.get("query");

    if (!query || query.trim().length < 1) {
      return NextResponse.json(
        { error: "Query parameter is required" },
        { status: 400 },
      );
    }

    const [movies, tvShows, books] = await Promise.all([
      searchMovies(query).catch(() => []),
      searchTVShows(query).catch(() => []),
      searchBooks(query).catch(() => []),
    ]);

    const movieResults: SearchResult[] = movies
      .slice(0, RESULTS_PER_TYPE)
      .map((movie) => ({
        id: `movie-${movie.id}`,
        type: "movie" as const,
        title: movie.title,
        description: movie.overview,
        imageUrl: getImageUrl(movie.poster_path, "w500"),
        releaseDate: movie.release_date || null,
        rating: movie.vote_average,
        popularity: movie.popularity || 0,
      }));

    const tvResults: SearchResult[] = tvShows
      .slice(0, RESULTS_PER_TYPE)
      .map((show) => ({
        id: `tv-${show.id}`,
        type: "tv" as const,
        title: show.name,
        description: show.overview,
        imageUrl: getImageUrl(show.poster_path, "w500"),
        releaseDate: show.first_air_date || null,
        rating: show.vote_average,
        popularity: show.popularity || 0,
      }));

    const bookResults: SearchResult[] = books
      .slice(0, RESULTS_PER_TYPE)
      .map((book) => ({
        id: `book-${book.id}`,
        type: "book" as const,
        title: book.volumeInfo.title,
        description: book.volumeInfo.description || "",
        imageUrl:
          (
            book.volumeInfo.imageLinks?.large ??
            book.volumeInfo.imageLinks?.thumbnail ??
            null
          )?.replace("http://", "https://") ?? null,
        releaseDate: book.volumeInfo.publishedDate || null,
        authors: book.volumeInfo.authors,
        popularity: 0,
      }));

    const results = [...movieResults, ...tvResults, ...bookResults];

    return NextResponse.json({
      query,
      count: results.length,
      results,
    });
  } catch (err) {
    console.error("search API error:", err);
    return NextResponse.json(
      { error: "Failed to search content" },
      { status: 500 },
    );
  }
}
