// /app/api/notifications/route.js
import dbConnect from "@/lib/db";
import Notification from "@/models/Notification";
import { cookies } from "next/headers";

export async function POST(req) {
  const userId = (await cookies()).get("authUserId").value;
  const { message, type } = await req.json();
  await dbConnect();

  try {
    const notification = new Notification({
      user: userId,
      message: message,
      type: type,
    });
    await notification.save();
    return new Response(JSON.stringify({ success: true, notification }), {
      status: 201,
    });
  } catch (error) {
  
    return new Response(
      JSON.stringify({ error: "Failed to create notification" }),
      { status: 500 }
    );
  }
}
