import dbConnect from "@/lib/db";
import User from "@/models/User";
import Post from "@/models/Post";
import { comparePassword } from "@/utils/hashPassword";
import { generateToken } from "@/utils/tokenUtils";

export async function POST(req) {
  await dbConnect();
  const { email, password } = await req.json();

  try {
    const user = await User.findOne({ email }).populate(["following" ,"followers","posts"]);
    if (!user) {
      return new Response(JSON.stringify({ message: "User not found" }), {
        status: 404,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    if (!user.isVerified) {
      return new Response(
        JSON.stringify({ message: "Please verify your email" }),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return new Response(JSON.stringify({ message: "Invalid password" }), {
        status: 403,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    // Generate JWT Token
    const token = await generateToken(user._id, user.email);
    if (!token) {
      return new Response(
        JSON.stringify({ message: "Error while generating token" }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Set the token as an HttpOnly cookie
    const headers = new Headers();
    headers.append(
      "Set-Cookie",
      `authToken=${token}; HttpOnly; Path=/; Max-Age=604800; Secure; SameSite=Strict`
    );

    return new Response(
      JSON.stringify({
        message: "Login successful",
        name: user.name,
        id: user._id,
        profilePicture: user.profilePicture,
        email: user.email,
        followers: user.followers,
        following: user.following,
        posts: user.posts,
      }),
      {
        status: 200,
        headers: headers,
      }
    );
  } catch (error) {
    
    return new Response(JSON.stringify({ message: "Error while logging in" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
