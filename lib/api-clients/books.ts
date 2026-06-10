export interface GoogleBook {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    description?: string;
    imageLinks?: {
      thumbnail: string;
      extraLarge: string;
      large: string;
    };
    publishedDate?: string;
  };
}

export async function searchBooks(query: string): Promise<GoogleBook[]> {
  const apiKey = process.env.GOOGLE_BOOKS_API_KEY;
  const keyParam = apiKey ? `&key=${apiKey}` : "";
  const response = await fetch(
    `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=10${keyParam}`,
  );

  if (!response.ok) {
    throw new Error(`Google Books API error: ${response.status}`);
  }

  const data = await response.json();
  return data.items || [];
}
