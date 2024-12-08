import Story from "@/models/Story";
import { cookies } from "next/headers";

export async function POST(req) {
  try {
    const userId = (await cookies()).get("authUserId").value;
    const { storyId } = await req.json();

    // Validate inputs
    if (!storyId || !userId) {
      return new Response(JSON.stringify({ error: "Invalid inputs" }), {
        status: 400,
      });
    }

    // Add user to viewers using $addToSet
    const updatedStory = await Story.findByIdAndUpdate(
      storyId,
      { $addToSet: { viewers: userId } }, // Add to viewers only if it doesn't exist
      { new: true } // Return the updated document
    );

    if (!updatedStory) {
      return new Response(JSON.stringify({ error: "Story not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
   
    return new Response(JSON.stringify({ success: false }), { status: 500 });
  }
}
