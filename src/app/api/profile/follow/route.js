import User from "@/models/User";
import { cookies } from "next/headers";

export async function PUT(req) {
 
  try {
    const userId = (await cookies()).get("authUserId").value;
    const { id } = await req.json();
    
   const user = await User.findById(id);
    if (!user) {
      return new Response(JSON.stringify({ success: false, error: "User not found" }), {
        status: 404,
      });
    }
    if (user.followers.includes(userId)) {
      user.followers = user.followers.filter((followerId) => followerId.toString() !== userId);
      await user.save();
      return new Response(
        JSON.stringify({ success: true, status: "removed", followers: user.followers }),
        { status: 200 }
      );
    } else {
      user.followers.push(userId);
      await user.save();
      return new Response(
        JSON.stringify({ success: true, status: "added", followers: user.followers }),
        { status: 200 }
      );
    }


  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: "Internal server error" }),
      {
        status: 500,
      }
    );
  }
}
