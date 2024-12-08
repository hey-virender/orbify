import Post from "@/models/Post";
import { notifyLike } from "@/services/notificationManager";
import { cookies } from "next/headers";

export async function POST(req) {
  const userId = (await cookies()).get("authUserId")?.value;
  const { postId } = await req.json();

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return new Response(JSON.stringify({ error: "Post not found" }), {
        status: 404,
      });
    }
    
    if (post.likes.includes(userId)) {
      post.likes = await post.likes.filter((id) => id != userId);
      await post.save();
   
      return new Response(
        JSON.stringify({ success: true, status: "removed", likes: post.likes }),
        { status: 200 }
      );
    } else {
      post.likes.push(userId);
      await post.save();
      await notifyLike(postId, userId);
      return new Response(
        JSON.stringify({ success: true, status: "added", likes: post.likes }),
        { status: 200 }
      );
    }

   
  } catch {
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}
