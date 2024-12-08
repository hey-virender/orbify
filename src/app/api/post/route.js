import { uploadToCloudinary } from "@/lib/cloudinary";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Post from "@/models/Post";
import { cookies } from "next/headers";
import { notifyNewPost } from "@/services/notificationManager";

export async function GET(req) {
  await dbConnect();
  


  const userId = (await cookies()).get("authUserId")?.value;

  if (!userId) {
    return new Response(
      JSON.stringify({ error: "authUserId cookie not found" }),
      { status: 404 }
    );
  }

  try {
    const user = await User.findById(userId).populate("followers");

    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }

    
    const followingIds = user.following.map((follower) => follower._id);

    
    let posts;
    if (followingIds.length > 0) {
      // Fetch posts from followers
      const followingPost = await Post.find({ user: { $in: followingIds } })
        .populate({ path: "user", select: "name profilePicture _id email" })
        .populate({ path: "comments.user", select: "_id name profilePicture" })
        .sort({ createdAt: -1 });

      if (followingPost.length > 0) {
        posts = followingPost;
      } else {
        // Fetch all posts if no posts from followers
        posts = await Post.find()
          .populate({ path: "user", select: "name profilePicture _id email" })
          .populate({
            path: "comments.user",
            select: "_id name profilePicture",
          })
          .sort({ createdAt: -1 });
      }
    } else {
      // Fetch all posts if no followers
      posts = await Post.find()
        .populate({ path: "user", select: "name profilePicture _id email" })
        .populate({ path: "comments.user", select: "_id name profilePicture" })
        .sort({ createdAt: -1 });
    }

    
    return new Response(JSON.stringify({ success: true, posts: posts }), {
      status: 200,
    });
  } catch (error) {
   
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}

export async function POST(req) {
  const userId = (await cookies()).get("authUserId")?.value;
  const formData = await req.formData();

  await dbConnect();

  try {
    const content = formData.get("content");
    const media = formData.get("media");

    const result = await uploadToCloudinary(media, "posts");

    const newPost = new Post({
      content,
      media: result.secure_url,
      user: userId,
      likes: [],
      comments: [],
    });
    const user = await User.findById(userId);
    user.posts.push(newPost._id);
    await user.save();
    await newPost.save();
    await notifyNewPost(newPost._id)

    return new Response(JSON.stringify({ success: true, data: newPost }), {
      status: 201,
    });
  } catch (error) {
   
    return new Response(JSON.stringify({ success: false }), { status: 500 });
  }
}
