import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY); // Ensure you have your API key in .env

export async function sendVerificationEmail(email, verificationLink) {
  try {
    await resend.emails.send({
      from: "Social Platform <onboarding@resend.dev>",
      to: email,
      subject: "Verify your email",
      html: `<p>Please verify your email by clicking on the following link:</p>
             <a href="${verificationLink}">Verify Email</a>`,
    });
   
  } catch (error) {
   
    throw new Error("Could not send verification email");
  }
}
