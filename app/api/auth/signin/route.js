// app/api/auth/signin/route.js
import { NextResponse } from "next/server";
import AnonymousUser from "@/models/AnonymousUser";
import { dbConnect } from "@/lib/dbConnect";

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const { pseudonym, pin } = body;

    if (!pseudonym || !pin) {
      return NextResponse.json(
        { error: "Pseudonym and pin are required" },
        { status: 400 }
      );
    }

    const user = await AnonymousUser.findOne({ pseudonym, pin }).lean();

    if (!user) {
      return NextResponse.json(
        { error: "Invalid pseudonym or pin" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      id: user.id,
      pseudonym: user.pseudonym,
    });
  } catch (error) {
    console.error("Signin error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
