const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

export interface TMDBMovie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
  popularity: number;
}

export interface TMDBTVShow {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  first_air_date: string;
  vote_average: number;
  popularity: number;
}

export async function searchMovies(query: string): Promise<TMDBMovie[]> {
  const response = await fetch(
    `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`,
  );

  if (!response.ok) {
    throw new Error(`TMDB API error: ${response.status}`);
  }

  const data = await response.json();
  const results = data.results || [];

  return results.sort(
    (a: TMDBMovie, b: TMDBMovie) => b.popularity - a.popularity,
  );
}

export async function searchTVShows(query: string): Promise<TMDBTVShow[]> {
  const response = await fetch(
    `${TMDB_BASE_URL}/search/tv?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`,
  );

  if (!response.ok) {
    throw new Error(`TMDB API error: ${response.status}`);
  }

  const data = await response.json();
  const results = data.results || [];

  return results.sort(
    (a: TMDBTVShow, b: TMDBTVShow) => b.popularity - a.popularity,
  );
}

export function getImageUrl(
  path: string | null,
  size: "w200" | "w500" | "original" = "original",
): string | null {
  if (!path) return null;
  return `https://image.tmdb.org/t/p/${size}${path}`;
}

export async function getMovieCredits(movieId: number) {
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${TMDB_API_KEY}`,
  );
  const data = await response.json();
  return (
    data.crew.find((person: any) => person.job === "Director")?.name || null
  );
}

export async function getTVCredits(tvId: number) {
  const response = await fetch(
    `https://api.themoviedb.org/3/tv/${tvId}/credits?api_key=${TMDB_API_KEY}`,
  );
  const data = await response.json();
  return (
    data.crew.find((person: any) => person.job === "Director")?.name || null
  );
}
