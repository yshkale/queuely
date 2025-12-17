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
