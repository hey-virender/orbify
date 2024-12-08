import dbConnect from "@/lib/db";
import { sendVerificationEmail } from "@/lib/resend";

export async function POST(req) {
  await dbConnect(); // Connect to the database

  // Parse request JSON
  const { email } = await req.json();


  // Generate a unique verification link
  const verificationLink = `${
    process.env.NEXT_PUBLIC_BASE_URL
  }/api/auth/verify-email?email=${encodeURIComponent(email)}`;

  try {
    // Send verification email
    await sendVerificationEmail(email, verificationLink);
    return new Response(
      JSON.stringify({ message: "Verification email sent" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    
    return new Response(
      JSON.stringify({ message: "Error while sending mail" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
