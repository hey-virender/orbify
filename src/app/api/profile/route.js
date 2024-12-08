import { uploadToCloudinary } from "@/lib/cloudinary";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { cookies } from "next/headers";

//Returns profile  logged in user

export const GET = async (req) => {
  await dbConnect();
  const id = (await cookies()).get("authUserId")?.value;

  try {
    if (!id) {
      return new Response(JSON.stringify({ error: "User ID is missing" }), {
        status: 400,
      });
    }

    // Fetch the user while excluding fields
    const user = await User.findById(id, "-password -isVerified")
      .populate(["followers", "following", "posts"])
   

    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify({ success: true, data: user }), {
      status: 200,
    });
  } catch (error) {
    
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
};

export const PUT = async (req) => {
  await dbConnect();
  const userId = (await cookies()).get("authUserId").value;
  const formData = await req.formData();
  const name = formData.get("name");
  const profilePicture = formData.get("profilePicture");
 

  if (!userId) {
    return new Response(
      JSON.stringify({ error: "authUserId cookie not found" }),
      {
        status: 404,
      }
    );
  }

  try {
    let result = null;
    if (profilePicture) {
      result = await uploadToCloudinary(profilePicture, "profile");
    }
    const user = await User.findById(userId, "-password -isVerified");
    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }

    user.name = name || user.name;
    user.profilePicture = result?.secure_url || user.profilePicture;
    await user.save();

    return new Response(JSON.stringify({ success: true, data: user }), {
      status: 200,
    });
  } catch (error) {

    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
};
