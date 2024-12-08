import Story from "@/models/Story";
import dbConnect from "@/lib/db";

export async function GET(req, { params }) {
  try {
    await dbConnect();

    const { id } = await params;
 
    const stories = await Story.find({ user: id });
    return new Response(JSON.stringify({ success: true, stories: stories }), {
      status: 200,
    });
  } catch (error) {
   
    return new Response(JSON.stringify({ success: false }), { status: 500 });
  }
}
