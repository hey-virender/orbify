import dbConnect from "@/lib/db";
import Conversation from "@/models/Conversation";
import { cookies } from "next/headers";
import pusher from "@/lib/pusher";

export async function POST(req) {
  try {
    const userId = (await cookies()).get("authUserId").value; // Authenticated user ID
    await dbConnect();

    const { conversationId, message } = await req.json(); // Extract request body
   

    // Find the conversation by ID
    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return new Response(JSON.stringify({ error: "Conversation not found" }), {
        status: 404,
      });
    }

    // Use the addMessage method from the model
    await conversation.addMessage(userId, message);

    // Notify participants of the new message using Pusher
    await pusher.trigger(
      `conversation-${conversationId}`, // Channel specific to the conversation
      "new-message", // Event name
      {
        conversationId,
        message: {
          sender: userId,
          text: message,
        },
        participants: conversation.participants,
        lastMessage: message,
        lastMessageSender: userId,
      }
    );

    // Return success response with the updated messages
    return new Response(
      JSON.stringify({ success: true, messages: conversation.messages }),
      { status: 201 }
    );
  } catch (error) {
    
    return new Response(JSON.stringify({ success: false }), { status: 500 });
  }
}
