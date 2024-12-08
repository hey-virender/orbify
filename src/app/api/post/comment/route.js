import dbConnect from "@/lib/db";
import Post from "@/models/Post";
import User from "@/models/User";
import { notifyComment } from "@/services/notificationManager";
import { cookies } from "next/headers";

export async function POST(req) {
  const userId = (await cookies()).get("authUserId").value;
  const postId = new URL(req.url).searchParams.get("postId");
  const { content } = await req.json();
  await dbConnect();
  try {
    const post = await Post.findById(postId);
    if (!post) {
      return new Response(JSON.stringify({ error: "Post not found" }), {
        status: 404,
      });
    }
    
    if (!content) {
      return new Response(JSON.stringify({ error: "Content is required" }), {
        status: 400,
      });
    }
    const newComment = {
      user: userId,
      content: content,
    };
    post.comments.push(newComment);
    await post.save();

    const populatedPost = await Post.findById(postId).populate({
      path: "comments.user", // Populate the `user` field in each comment
      select: "_id name profilePicture", // Optional: select specific user fields
    });
    await notifyComment(postId,userId)
    return new Response(
      JSON.stringify({ success: true, comments: populatedPost.comments }),
      {
        status: 201,
      }
    );
  } catch (error) {
    
    return new Response(JSON.stringify({ success: false }), { status: 500 });
  }
}
