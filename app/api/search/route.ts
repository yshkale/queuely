import { searchBooks } from "@/lib/api-clients/books";
import {
  getImageUrl,
  getMovieCredits,
  getTVCredits,
  searchMovies,
  searchTVShows,
} from "@/lib/api-clients/tmdb";
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

export async function GET(request: NextRequest) {
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
        director: await getMovieCredits(movie.id),
      })),
    );
    results.push(...moviesWithDirectors);

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
        director: await getTVCredits(show.id),
      })),
    );
    results.push(...tvWithDirectors);

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
