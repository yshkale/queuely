import { NextRequest, NextResponse } from "next/server";

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

    return NextResponse.json({
      success: true,
      data: [],
    });
  } catch (err) {
    console.error("search error:", err);
    return NextResponse.json({
      error: "Internal server error",
      status: 500,
    });
  }
}
