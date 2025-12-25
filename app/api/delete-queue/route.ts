import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
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
