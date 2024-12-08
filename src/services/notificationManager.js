import pusher from "@/lib/pusher";
import Post from "@/models/Post";
import User from "@/models/User";
import Notification from "@/models/Notification"; 

const sendNotification = async (channel, event, data) => {
  try {
    await pusher.trigger(channel, event, data);
    
  } catch (error) {
   
  }
};

export const notifyNewPost = async (postId) => {
  try {
    const post = await Post.findById(postId).populate({
      path: "user",
      select: "-password -isVerified", // You are excluding sensitive fields here
    });

    if (!post) {

      return;
    }

    const followers = post.user.followers;

    if (!followers.length) {
     
      return;
    }

    const event = "new-post";
    const message = `${post.user.name} has posted a new post`;

    // Prepare triggered users for the notification
    const triggeredUsers = followers.map((follower) => ({
      user: follower,
      seen: false,
    }));

    // Create a single notification in the database
    const notification = new Notification({
      sender: post.user._id,
      triggeredUsers,
      type: "new-post",
      message,
      entityId: postId,
      entityType:"Post",
    });

    await notification.save();
   

    const data = {
      notification,
      post,
    };

    // Send notification to all followers via Pusher
    for (const follower of followers) {
      
      await sendNotification(`user-${follower._id}`, event, data); // Use user-specific channel
    }
  } catch (error) {
    
  }
};

export const notifyLike = async (postId, userId) => {
  try {
    const user = await User.findById(userId);

    const post = await Post.findById(postId).populate({
      path: "user",
      select: "-password -isVerified", // Excluding sensitive fields
    });

    if (!post) {
     
      return;
    }

    const event = "new-like";
    const message = `${user.name} liked your post`;

    // Check if a similar notification already exists
    const existingNotification = await Notification.findOne({
      sender: userId,
      type: "new-like",
      postId: postId,
      "triggeredUsers.user": post.user._id, // Ensure it's for the same post owner
    });

    if (existingNotification) {
      
      return; // Skip creating a new notification
    }

    // Prepare triggered users for the notification
    const triggeredUsers = [
      {
        user: post.user._id,
        seen: false,
      },
    ];

    // Create a single notification in the database
    const notification = new Notification({
      sender: userId,
      triggeredUsers,
      type: "like",
      message,
      entityId: postId,
      entityType:"Post",
    });

    await notification.save();
    

    const data = {
      notification,
      post,
    };

    // Send notification to the post owner via Pusher
    await sendNotification(`user-${post.user._id}`, event, data); // Use user-specific channel
  } catch (error) {
    
  }
};

export const notifyComment = async (postId, userId) => {
  try {
    const user = await User.findById(userId);
    const post = await Post.findById(postId).populate({
      path: "user",
      select: "-password -isVerified", // You are excluding sensitive fields here
    });

    if (!post) {
     
      return;
    }

    const event = "new-comment";
    const message = `${user.name} commented on your post`;

    // Prepare triggered users for the notification
    const triggeredUsers = [
      {
        user: post.user._id,
        seen: false,
      },
    ];

    // Create a single notification in the database
    const notification = new Notification({
      sender: userId,
      triggeredUsers,
      type: "new-comment",
      message,
      entityId: postId,
      entityType:"Post",
    });

    await notification.save();
    

    const data = {
      notification,
      post,
    };

    // Send notification to the post owner via Pusher
    await sendNotification(`user-${post.user._id}`, event, data); // Use user-specific channel
  } catch (error) {
    console.error("Error in notifyComment:", error);
  }
};
