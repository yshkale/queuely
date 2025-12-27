import { supabase } from "@/lib/supabase";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";

const rateLimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(15, "1 m"),
});

export async function POST(request: any) {
  const ip = request.ip ?? "127.0.0.1";
  const { success } = await rateLimit.limit(ip);

  if (!success) {
    return NextResponse.json({
      error: "Rate limit exceeded",
      status: 429,
    });
  }

  try {
    const body = await request.json();

    //validate
    if (!body.contentId || !body.type || !body.title) {
      throw new Error("Invalid request");
    }

    //save to db
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
      })
      .select()
      .single();

    if (error) {
      // Duplicate entry
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "Already in queue" },
          { status: 409 },
        );
      }
      throw error;
    }

    return NextResponse.json({
      data,
      status: 201,
    });
  } catch (err) {
    console.error("API Error:", err);
    return NextResponse.json({
      status: 500,
      body: JSON.stringify({ error: "Failed to add to queue" }),
    });
  }
}

export async function GET() {
  try {
    const { data, error } = await supabase.from("queue").select();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      queues: data.sort((a, b) => b.id - a.id),
      status: 200,
    });
  } catch (err) {
    console.error("API Error:", err);
    return NextResponse.json({
      status: 500,
      body: JSON.stringify({ error: "Failed to fetch queue" }),
    });
  }
}
