// app/api/notifications/route.js
import { dbConnect } from "@/lib/dbConnect";
import Notification from "@/models/Notification";

export async function GET(req) {
  await dbConnect();

  const userId = req.headers.get("x-user-id"); // 👈 use anon_user.id from frontend

  if (!userId) {
    return new Response(JSON.stringify({ error: "Missing userId" }), { status: 400 });
  }

  try {
    const notifications = await Notification.find({ userId }).sort({ createdAt: -1 }).lean();
    return new Response(JSON.stringify(notifications), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
