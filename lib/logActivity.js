import { dbConnect } from "@/lib/dbConnect";
import Log from "@/models/Log";

export async function logActivity({ type, message = "", userId = null, ip = null }) {
  try {
    await dbConnect();

    const log = new Log({
      type,
      message,
      userId,
      ip,
    });

    await log.save();
  } catch (err) {
    console.error("Error saving log:", err.message);
  }
}
