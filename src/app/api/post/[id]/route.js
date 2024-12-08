import dbConnect from "@/lib/db";
import Post from "@/models/Post";


export async function GET(req,{params}){
  await dbConnect();
  const { id } = await params;
  
try {
  const post = await Post.findById(id).populate({path: "user", select: "name profilePicture _id email"}).populate({path: "comments.user", select: "_id name profilePicture"})
  
  return new Response(JSON.stringify({success: true, post: post}), {status: 200})
} catch (error) {
  return new Response(JSON.stringify({success: false,error:"Error while fetching Post"}), {status: 500})
}
}