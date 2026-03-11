import { createClient } from "@/lib/supabase/server";
import { checkRateLimit } from "@/lib/ratelimit";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] ?? "127.0.0.1";
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();

    if (!body.contentId || !body.type || !body.title) {
      throw new Error("Invalid request");
    }

    const { data, error } = await supabase
      .from("queue")
      .insert({
        contentId: body.contentId,
        title: body.title,
        description: body.description,
        type: body.type,
        year: body.year,
        author: body.author,
        imageUrl: body.imageUrl,
        status: body.status,
        director: body.director,
        user_id: user.id,
      })
      .select()
      .single();

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "Already in queue" },
          { status: 409 },
        );
      }
      throw error;
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (err) {
    console.error("API Error:", err);
    return NextResponse.json(
      { error: "Failed to add to queue" },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] ?? "127.0.0.1";
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { data, error } = await supabase
      .from("queue")
      .select()
      .eq("user_id", user.id);

    if (error) {
      console.error("DB error:", JSON.stringify(error));
      throw error;
    }

    return NextResponse.json({
      queues: data.sort((a, b) => b.id - a.id),
    });
  } catch (err) {
    console.error("API Error:", err);
    return NextResponse.json(
      { error: "Failed to fetch queue" },
      { status: 500 },
    );
  }
}
