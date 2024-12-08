import React, { useState } from "react";
import { Avatar, Typography, TextField, Button, Stack } from "@mui/material";

const CommentSection = ({ comments, onAddComment }) => {
  const [newComment, setNewComment] = useState("");
  const handleAddComment = () => {
    if (newComment.trim()) {
      onAddComment(newComment);
      setNewComment("");
    }
  };

  return (
    <Stack spacing={2} className="bg-gray-100 p-4 rounded-lg">
      <Typography variant="h6" className="text-gray-800 font-semibold">
        Comments
      </Typography>
      <Stack spacing={2} className="max-h-60 overflow-y-auto">
        {comments.map((comment, index) => (
          <Stack
            key={index}
            direction="row"
            spacing={2}
            alignItems="center"
            className="p-2 bg-white rounded-lg shadow-sm"
          >
            <Avatar src={comment.user.profilePicture}></Avatar>
            <Stack>
              <Typography variant="subtitle2" className="font-medium">
                {comment.user.name}
              </Typography>
              <Typography variant="body2" className="text-gray-600">
                {comment.content}
              </Typography>
            </Stack>
          </Stack>
        ))}
      </Stack>
      <Stack direction="row" spacing={2} alignItems="center">
        <TextField
          variant="outlined"
          size="small"
          fullWidth
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddComment}
          className="bg-blue-500"
        >
          Post
        </Button>
      </Stack>
    </Stack>
  );
};

export default CommentSection;
