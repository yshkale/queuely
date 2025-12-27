import { supabase } from "@/lib/supabase";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";

const rateLimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(15, "1 m"),
});

export async function PATCH(request: any) {
  const ip = request.ip ?? "127.0.0.1";
  const { success } = await rateLimit.limit(ip);

  if (!success) {
    return NextResponse.json({
      error: "Rate limit exceeded",
      status: 429,
    });
  }

  const { id, status } = await request.json();

  if (!id || !status) {
    return NextResponse.json({
      error: "Invalid request, need id and status",
      status: 400,
    });
  }

  try {
    const { data, error } = await supabase
      .from("queue")
      .update({ status })
      .eq("id", id)
      .select();

    if (error) {
      console.error(error);
      return NextResponse.json({
        error: "Failed to update queue status",
        status: 500,
      });
    }

    return NextResponse.json({
      success: true,
      data,
      message: "Queue status updated successfully",
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      error: "Failed to update queue status",
      status: 500,
    });
  }
}
