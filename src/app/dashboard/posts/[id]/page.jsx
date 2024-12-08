"use client";

import Header from "@/app/components/Header";
import Post from "@/app/components/Post";
import axios from "axios";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const page = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null); // Set initial state as null

  useEffect(() => {
    const fetchPost = async () => {
      const response = await axios.get(`/api/post/${id}`);
      if (response.status == 200) {
        
        setPost(response.data.post);
      }
    };
    fetchPost();
  }, [id]);

  if (!post) {
    return (
      <div>
        <Header single={true} />
        Loading...
      </div>
    ); // Handle loading state
  }

  return (
    <>
      <Header single={true} />
      <Post data={post} single={true} />;
    </>
  );
};

export default page;
