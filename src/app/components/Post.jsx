import React, { useEffect, useState } from "react";
import {
  Avatar,
  Card,
  CardContent,
  CardMedia,
  Typography,
  CardActions,
} from "@mui/material";
import PostActions from "./PostActions";
import CommentSection from "./CommentSection";
import { useSelector } from "react-redux";
import axios from "axios";
import { useDispatch } from "react-redux";
import { showAlert } from "@/redux/alertSlice";
import timeAgo from "../helper/timeAgo";
import Link from "next/link";
import { FaSquareArrowUpRight } from "react-icons/fa6";
import { MdOutlineCancel } from "react-icons/md";
const Post = ({ data, singlePost,singleUser }) => {
  const dispatch = useDispatch();
  const { _id, user, content, media, createdAt, likes, comments } = data;
  const [isLiked, setIsLiked] = useState();
  const [likeCount, setLikeCount] = useState(likes.length);
  const [showComments, setShowComments] = useState(false);
  const [commentList, setCommentList] = useState(comments);

  const loggedInUser = useSelector((state) => state.user.user);

  useEffect(() => {
    setIsLiked(likes.includes(loggedInUser.id));
  }, [likes, loggedInUser]);

  const handleLike = async () => {
    try {
      const response = await axios.post("/api/post/like", { postId: _id });
      if (response.status === 200) {
        if (response.data.status === "added") {
          setIsLiked(true);
          setLikeCount(response.data.likes.length);
        } else {
          setIsLiked(false);
          setLikeCount(response.data.likes.length);
        }
      }
    } catch (err) {
      showAlert({ type: "error", message: "Something went wrong" });
     
    }
  };

  const handleComment = () => {
    setShowComments((prev) => !prev);
  };

  const handleAddComment = async (newComment) => {
    try {
      const response = await axios.post(`/api/post/comment?postId=${_id}`, {
        content: newComment,
      });
      if (response.status == 201) {
        setCommentList(response.data.comments);
        dispatch(
          showAlert({ type: "success", message: "Comment added successfully" })
        );
      }
    } catch (error) {
    
      dispatch(
        showAlert({
          type: "error",
          message: "Problem occurred while adding comment",
        })
      );
    }
  };

  return (
    <Card
      sx={{
        position: "relative",
        width: "100%",
        maxWidth: 1000,
        margin: "0 auto",
        mb: 3,
      }}
    >
      <div className="absolute top-2 right-3">
        {singlePost ? (
          <Link href="/dashboard">
            <MdOutlineCancel className="text-3xl" />
          </Link>
        ) : <Link href={`/dashboard/posts/${data._id}`}>
        <FaSquareArrowUpRight />
      </Link>}
        
      </div>
      <CardContent sx={{ display: "flex", alignItems: "center" }}>
        <Avatar src={ user.profilePicture || singleUser.profilePicture} sx={{ mr: 1 }} />
        <div style={{ marginLeft: 16 }}>
          <Typography variant="subtitle1" fontWeight="bold">
            { user.name || singleUser.name }
          </Typography>
          <Typography variant="caption" color="textSecondary">
            {timeAgo(createdAt)}
          </Typography>
        </div>
      </CardContent>

      <CardContent>
        <Typography variant="body2" color="textPrimary">
          {content}
        </Typography>
      </CardContent>

      {media.length > 0 && (
        <CardMedia
          component="img"
          image={media[0]}
          alt="Post content"
          sx={{
            borderRadius: "8px",
            mx: "auto",
            height: "100%",
            maxHeight: 500,
            objectFit: "cover",
          }}
        />
      )}

      <CardActions disableSpacing>
        <PostActions
          onLike={handleLike}
          onComment={handleComment}
          onShare={() => {}}
          likesCount={likeCount}
          commentsCount={commentList.length}
          isLiked={isLiked}
        />
      </CardActions>

      {showComments && (
        <div className="p-4">
          <CommentSection
            comments={commentList}
            onAddComment={handleAddComment}
          />
        </div>
      )}
    </Card>
  );
};

export default Post;
