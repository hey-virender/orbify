import React from "react";
import { Box, Typography, Button, Stack } from "@mui/material";
import Post from "./Post";
import PostSectionSkeleton from "./skeletons/PostSectionSkeleton";

const PostSection = ({setIsCreatePostVisible,posts}) => {
  

  return (
    <Box sx={{ width: "100%",  paddingBottom: 20, paddingX: 2 }}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        mb={2}
      >
        <Typography variant="h5" fontWeight="bold">
          Posts
        </Typography>

        <Button
          variant="contained"
          color="primary"
          onClick={() => setIsCreatePostVisible(true)}
        >
          Create Post
        </Button>
      </Stack>

      {/* Render each Post */}
      <Stack spacing={3}>
        {posts && posts.length > 0 ? (
          posts.map((post, index) => <Post key={index} data={post} />)
        ) : (
          <PostSectionSkeleton/>
        )}
      </Stack>
    </Box>
  );
};

export default PostSection;
