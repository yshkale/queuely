import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
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
      queues: data,
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
