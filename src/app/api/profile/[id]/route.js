import dbConnect from "@/lib/db";
import User from "@/models/User";

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    if (!id) {
      return new Response(JSON.stringify({ error: "User id not found" }), {
        status: 404,
      });
    }
    await dbConnect();
    const user = await User.findById(id, "-password -isVerified").populate([
      "followers",
      "following",
      "posts",
    ]);
    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }
    return new Response(JSON.stringify({ success: true, user }), {
      status: 200,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: "Error while fetching Profile" }),
      { status: 500 }
    );
  }
}
