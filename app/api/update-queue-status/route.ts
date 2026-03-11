import { createClient } from "@/lib/supabase/server";
import { checkRateLimit } from "@/lib/ratelimit";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] ?? "127.0.0.1";
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, status } = await request.json();

  if (!id || !status) {
    return NextResponse.json(
      { error: "Invalid request, need id and status" },
      { status: 400 },
    );
  }

  try {
    const { data, error } = await supabase
      .from("queue")
      .update({ status })
      .eq("id", id)
      .eq("user_id", user.id)
      .select();

    if (error) {
      console.error(error);
      return NextResponse.json(
        { error: "Failed to update queue status" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      data,
      message: "Queue status updated successfully",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update queue status" },
      { status: 500 },
    );
  }
}
