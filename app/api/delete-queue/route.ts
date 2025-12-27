import { supabase } from "@/lib/supabase";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { NextRequest, NextResponse } from "next/server";

const rateLimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(15, "1 m"),
});

export async function DELETE(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "127.0.0.1";

  const { success } = await rateLimit.limit(ip);

  if (!success) {
    return NextResponse.json({
      error: "Rate limit exceeded",
      status: 429,
    });
  }

  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({
        error: "ID is required",
        status: 400,
      });
    }

    const { error } = await supabase.from("queue").delete().eq("id", id);

    if (error) {
      return NextResponse.json({
        success: false,
        error: error.message,
        status: 400,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Queue deleted successfully",
      status: 200,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({
      error: "Internal Server Error",
      status: 500,
    });
  }
}
