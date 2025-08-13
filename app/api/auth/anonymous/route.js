// app/api/auth/anonymous/route.js
import { NextResponse } from "next/server";
import AnonymousUser from "@/models/AnonymousUser";
import { dbConnect } from "@/lib/dbConnect";

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();

    const { id, pseudonym, pin } = body;
    if (!id || !pseudonym || !pin) {
      return NextResponse.json(
        { error: "id, pseudonym, and pin are required" },
        { status: 400 }
      );
    }

    const newUser = await AnonymousUser.create({ id, pseudonym, pin });
    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error("Error creating anonymous user:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
