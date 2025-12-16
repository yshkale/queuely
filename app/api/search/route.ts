import { searchBooks } from "@/lib/api-clients/books";
import {
  getImageUrl,
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
    results.push(
      ...movies.slice(0, 10).map((movie) => ({
        id: `movie-${movie.id}`,
        type: "movie" as const,
        title: movie.title,
        description: movie.overview,
        imageUrl: getImageUrl(movie.poster_path, "w200"),
        releaseDate: movie.release_date,
        rating: movie.vote_average,
      })),
    );

    const tvShows = await searchTVShows(query);
    results.push(
      ...tvShows.slice(0, 10).map((show) => ({
        id: `tv-${show.id}`,
        type: "tv" as const,
        title: show.name,
        description: show.overview,
        imageUrl: getImageUrl(show.poster_path, "w200"),
        releaseDate: show.first_air_date,
        rating: show.vote_average,
      })),
    );

    const books = await searchBooks(query);
    results.push(
      ...books.map((book) => ({
        id: `book-${book.id}`,
        type: "book" as const,
        title: book.volumeInfo.title,
        description: book.volumeInfo.description || "",
        imageUrl: book.volumeInfo.imageLinks?.thumbnail || null,
        releaseDate: book.volumeInfo.publishedDate || null,
        authors: book.volumeInfo.authors,
      })),
    );

    return NextResponse.json({
      query,
      count: results.length,
      results,
    });
  } catch (err) {
    console.error("search API error:", err);
    return NextResponse.json({
      error: "Failed to search content",
      status: 500,
    });
  }
}
