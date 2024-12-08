import User from "@/models/User";
import Conversation from "@/models/Conversation";
import { cookies } from "next/headers";

export async function GET(req) {
  const userId = (await cookies()).get("authUserId").value;

  try {
    const conversations = await Conversation.find({
      participants: userId,
    })
      .populate("participants", "name profilePicture") // Fetch only necessary fields
      .sort({ updatedAt: -1 });

    if (!conversations || conversations.length === 0) {
      return new Response(JSON.stringify({ error: "No conversations found" }), {
        status: 404,
      });
    }

    // Format the conversations with relevant data
    const formattedConversations = conversations.map((conversation) => {
      const receiver = conversation.participants.find(
        (participant) => participant._id.toString() !== userId
      );

      return {
        conversationId: conversation._id,
        receiver: receiver
          ? {
              id: receiver._id,
              name: receiver.name,
              profilePicture: receiver.profilePicture,
            }
          : null,
        lastMessage: conversation.lastMessage || null,
        unread: conversation?.unreadByParticipants?.includes(userId) || false, // Check if the logged-in user has unread messages
        updatedAt: conversation.updatedAt,
      };
    });

    return new Response(
      JSON.stringify({ success: true, conversations: formattedConversations }),
      { status: 200 }
    );
  } catch (error) {
   
    return new Response(
      JSON.stringify({ message: "Error fetching conversations" }),
      { status: 500 }
    );
  }
}


export async function POST(req) {
  const userId = (await cookies()).get("authUserId").value;
  const { receiverId } = await req.json();

  try {
    if (receiverId === userId) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "You cannot create a conversation with yourself",
        }),
        { status: 400 }
      );
    }

    // Check if a conversation already exists between the two users
    const existingConversation = await Conversation.findOne({
      participants: { $all: [userId, receiverId] },
    }).populate("participants", "name profilePicture");

    if (existingConversation) {
      const receiver = existingConversation.participants.find(
        (participant) => participant._id.toString() !== userId
      );

      return new Response(
        JSON.stringify({
          success: true,
          conversation: {
            conversationId: existingConversation._id,
            receiver: {
              id: receiver._id,
              name: receiver.name,
              profilePicture: receiver.profilePicture,
            },
            lastMessage: existingConversation.lastMessage || null,
          },
        }),
        { status: 200 }
      );
    }

    // Create a new conversation if none exists
    const newConversation = new Conversation({
      participants: [userId, receiverId],
      unreadByParticipants: [receiverId], // Mark as unread for the receiver initially
    });

    await newConversation.save();

    // Populate the new conversation to fetch receiver details
    await newConversation.populate({
      path: "participants",
      select: "name profilePicture",
    });

    const receiver = newConversation.participants.find(
      (participant) => participant._id.toString() !== userId
    );

    return new Response(
      JSON.stringify({
        success: true,
        conversation: {
          conversationId: newConversation._id,
          receiver: receiver
            ? {
                id: receiver._id,
                name: receiver.name,
                profilePicture: receiver.profilePicture,
              }
            : null,
        },
      }),
      { status: 201 }
    );
  } catch (error) {
    
    return new Response(
      JSON.stringify({ success: false, message: "Error creating conversation" }),
      { status: 500 }
    );
  }
}
