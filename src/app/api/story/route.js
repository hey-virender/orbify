import User from "@/models/User";
import Story from "@/models/Story";
import dbConnect from "@/lib/db";
import { cookies } from "next/headers";
import { uploadToCloudinary } from "@/lib/cloudinary";
import mongoose from "mongoose";

export async function GET(req) {
  const excludeUserId = (await cookies()).get("authUserId").value;

  const userObjectId = new mongoose.Types.ObjectId(excludeUserId);
  await dbConnect(); // Ensure the DB connection is established

  
  try {
    const groupedStories = await Story.aggregate([
      {
        $match: {
          user: { $ne: userObjectId }, // Exclude stories from the specified user
        },
      },
      {
        $lookup: {
          from: "users", // Collection name for User
          localField: "user", // Field in Story collection referencing User
          foreignField: "_id", // Primary key in User collection
          as: "userDetails", // Resulting field for matched User data
        },
      },

      {
        $unwind: {
          path: "$userDetails", // Unwind the userDetails array
          preserveNullAndEmptyArrays: false, // Allow stories without a user match
        },
      },
      {
        $project: {
          "userDetails._id": 1, // Include only required fields
          "userDetails.name": 1,
          "userDetails.profilePicture": 1,
          media: 1,
          createdAt: 1,
          expiresAt: 1,
          viewers: 1,
        },
      },
      {
        $group: {
          _id: "$userDetails._id", // Group by user ID
          user: { $first: "$userDetails" }, // Populate user data
          stories: {
            $push: {
              _id: "$_id",
              media: "$media",
              createdAt: "$createdAt",
              expiresAt: "$expiresAt",
              viewers: "$viewers",
            },
          },
        },
      },

      {
        $sort: { "stories.createdAt": -1 }, // Sort stories by creation date
      },

      {
        $limit: 10, // Limit the number of groups
      },
    ]);

    return new Response(JSON.stringify({ stories: groupedStories }), {
      status: 200,
    });
  } catch (error) {
 
    return new Response(JSON.stringify({ message: "Error fetching stories" }), {
      status: 500,
    });
  }
}

export async function POST(req) {
  try {
    const userId = (await cookies()).get("authUserId").value;
    const formData = await req.formData();
    await dbConnect();
    const story = formData.get("story");

    if (!story) {
      return new Response(JSON.stringify({ error: "Story is required" }), {
        status: 400,
      });
    }
    const result = await uploadToCloudinary(story, "stories");
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    const newStory = new Story({
      user: userId,
      media: result.secure_url,
      expiresAt,
    });

    await newStory.save();
    const stories = await Story.find({ user: userId });

    return new Response(JSON.stringify({ success: true, stories: stories }), {
      status: 201,
    });
  } catch (error) {

    return new Response(JSON.stringify({ success: false }), { status: 500 });
  }
}
