import dbConnect from "@/lib/db";
import User from "@/models/User";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
  
    const query = searchParams.get("query");
   
    if (!query || !query.trim() === "") {
      return new Response(
        JSON.stringify({ success: false, error: "Query is required" }),
        { status: 400 }
      );
    }
    await dbConnect();
    const users = await User.find({
      name: { $regex: query.trim(), $options: "i" },
    }).select("_id name profilePicture");
    if (users.length === 0) {
      return new Response(
        JSON.stringify({ success: true, message: "No users found" }),
        { status: 200 }
      );
    }

    return new Response(JSON.stringify({ success: true, users: users }), {
      status: 200,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: "An error occurred" }),
      { status: 500 }
    );
  }
}
