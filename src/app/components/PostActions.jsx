import React from "react";
import { IconButton, Typography, Stack } from "@mui/material";
import {
  IoHeartOutline,
  IoChatbubbleOutline,
  IoShareOutline,
  IoHeart,
} from "react-icons/io5";

const PostActions = ({
  onLike,
  onComment,
  onShare,
  likesCount,
  commentsCount,
  isLiked,
}) => {
  return (
    <Stack
      direction="row"
      spacing={2}
      sx={{ width: "100%", justifyContent: "space-between" }}
    >
      <Stack direction="row" alignItems="center">
        <IconButton onClick={onLike}>
          {isLiked ? (
            <IoHeart className="text-red-500" size={24} />
          ) : (
            <IoHeartOutline size={24} />
          )}
        </IconButton>
        <Typography variant="body2">{likesCount || 0}</Typography>
      </Stack>

      <Stack direction="row" alignItems="center">
        <IconButton onClick={onComment}>
          <IoChatbubbleOutline size={24} />
        </IconButton>
        <Typography variant="body2">{commentsCount || 0}</Typography>
      </Stack>

      <IconButton onClick={onShare}>
        <IoShareOutline size={24} />
      </IconButton>
    </Stack>
  );
};

export default PostActions;
