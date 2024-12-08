import React, { useEffect } from "react";
import Pusher from "pusher-js";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewMessage,
  updateConversation,
} from "@/redux/messageSlice";
import { setNewNotification } from "@/redux/notificationSlice"; // Assuming you have this slice

const PusherProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { id } = useSelector((state) => state.user.user);
  const { conversations, selectedChat } = useSelector((state) => state.message);
  

  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
    });

    // Subscribing to chat conversations
    const subscribedChannels = conversations.map((chat) => {
      const channel = pusher.subscribe(`conversation-${chat.conversationId}`);
      channel.bind("new-message", (data) => {
   
        dispatch(
          updateConversation({
            conversationId: data.conversationId,
            lastMessage: data.lastMessage,
            unread: true,
          })
        );
        if (
          selectedChat &&
          selectedChat.conversationId === data.conversationId
        ) {
          dispatch(addNewMessage(data.message));
        }
      });
      return channel;
    });

    // Subscribing to user-specific notification channel
    const notificationChannel = pusher.subscribe(`user-${id}`);

    // Bind different notification types
    const notificationHandlers = {
      "new-post": (data) => {
       
        dispatch(setNewNotification(data));
      },
      "new-like": (data) => {
  
        dispatch(setNewNotification(data));
      },
      "new-comment": (data) => {
        
        dispatch(setNewNotification(data));
      },
    };

    Object.keys(notificationHandlers).forEach((event) => {
      notificationChannel.bind(event, notificationHandlers[event]);
    });

    // Cleanup on component unmount
    return () => {
      subscribedChannels.forEach((channel) => {
        channel.unbind("new-message");
        pusher.unsubscribe(channel.name);
      });

      Object.keys(notificationHandlers).forEach((event) => {
        notificationChannel.unbind(event);
      });

      pusher.unsubscribe(notificationChannel.name);
    };
  }, [dispatch, conversations, id]);

  return <>{children}</>;
};

export default PusherProvider;
