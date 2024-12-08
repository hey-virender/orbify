import dbConnect from "@/lib/db";
import User from "@/models/User";
import { hashPassword } from "@/utils/hashPassword";

export async function POST(req) {
  await dbConnect();
  const { name, email, password, confirmPassword } = await req.json();

  const user = await User.findOne({ email });

  if (user) {
    return new Response(JSON.stringify({ message: "User already exists" }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  if (password !== confirmPassword) {
    return new Response(JSON.stringify({ message: "Passwords do not match" }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  const hashedPassword = await hashPassword(password);

  try {
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      confirmPassword,
    });

    await newUser.save();

    return new Response(JSON.stringify({ message: "User created" }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    
    return new Response(JSON.stringify({ message: "Error creating user" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
