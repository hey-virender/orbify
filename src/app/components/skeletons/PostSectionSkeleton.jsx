import { Skeleton } from "@mui/material";
import React from "react";

const PostSectionSkeleton = () => {
  return (
    <div className="mx-5">
      <Skeleton variant="circular" width={40} height={40} />
      <Skeleton variant="rectangular" width={"100%"} height={"50vh"} />
    </div>
  );
};

export default PostSectionSkeleton;
