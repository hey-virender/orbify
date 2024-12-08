import User from "@/models/User";
import { cookies } from "next/headers";

export async function GET(req) {
  try {
    const userId = (await cookies()).get("authUserId").value;

    if (!userId) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "authUserId cookie not found",
        }),
        { status: 404 }
      );
    }
    const user = await User.findById(userId, "-password -isVerified")
      .populate({
        path: "followers",
        select: "name profilePicture _id email",
      })
      .populate({ path: "following", select: "name profilePicture _id email" });

    if (!user) {
      return new Response(
        JSON.stringify({ success: false, error: "User not found" }),
        { status: 404 }
      );
    }
    const users = [...user.followers, ...user.following];
    const uniqueUsers = users.filter(
      (user, index, self) =>
        index ===
        self.findIndex((u) => u._id.toString() === user._id.toString())
    );
    
    return new Response(JSON.stringify({ success: true, users: uniqueUsers }), {
      status: 200,
    });
  } catch (error) {
    
    return new Response(JSON.stringify({ success: false, error: error }), {
      status: 500,
    });
  }
}
