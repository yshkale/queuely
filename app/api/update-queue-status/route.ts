import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(request: NextRequest) {
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
