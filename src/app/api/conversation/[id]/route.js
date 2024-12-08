import Conversation from "@/models/Conversation";
import dbConnect from "@/lib/db";
import { cookies } from "next/headers";

export async function GET(req, { params }) {
  const userId = (await cookies()).get("authUserId").value; // Ensure you have the user ID for receiver filtering
  const { id } = await params; // Extract id from params directly

  if (!id) {
    return new Response(JSON.stringify({ error: "Chat ID is required" }), {
      status: 400,
    });
  }

  await dbConnect();

  try {
    const conversation = await Conversation.findById(id)
      .populate("participants", "name profilePicture") // Populate participants with specific fields
      .lean(); // Use lean for better performance when only reading data

    if (!conversation) {
      return new Response(JSON.stringify({ error: "Chat not found" }), {
        status: 404,
      });
    }

    // Sort messages by createdAt field
    const sortedMessages = conversation?.messages?.sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    );

    // Find the receiver (participant other than the logged-in user)
    const receiver = conversation.participants.find(
      (participant) => participant._id.toString() !== userId
    );

    // Find unread messages for the logged-in user
    const unreadMessages = conversation.messages?.filter(
      (message) => !message.readBy.includes(userId)
    );

    return new Response(
      JSON.stringify({
        success: true,
        conversation: {
          conversationId: conversation._id,
          receiver: {
            name: receiver.name,
            id: receiver._id,
            profilePicture: receiver.profilePicture,
          },
          messages: sortedMessages,
          unreadMessages: unreadMessages?.map((message) => ({
            messageId: message._id,
            text: message.text,
            sender: message.sender,
            createdAt: message.createdAt,
          })),
        },
      }),
      { status: 200 }
    );
  } catch (error) {
    
    return new Response(JSON.stringify({ success: false }), { status: 500 });
  }
}
