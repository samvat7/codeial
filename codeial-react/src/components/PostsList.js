import React, { useState, useEffect } from "react";
import axios from "axios";
import Post from "./Post";

export default function PostsList() {
  const [posts, setPosts] = useState([]);
  const [postContent, setPostContent] = useState(""); // State to hold the textarea content

  var getPosts = () => {};

  useEffect(() => {
    getPosts = () => {
      axios
        .get("http://localhost:3001/api/v1/posts")
        .then((response) => {
          const postsData = response.data.posts.flat();
          //reverse the posts array so that the latest post is displayed first
            postsData.reverse();

          setPosts(postsData);
        })
        .catch((error) => {
          console.error("Error fetching posts:", error);
        });
    };

    getPosts();
  }, []);

  const handlePostContentChange = (event) => {
    setPostContent(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevents the default form submit action
    //post req to api with postContent and token

    const token = localStorage.getItem("token");

    axios
    .post("http://localhost:3001/api/v1/posts", {
      content: postContent,
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {

      axios
        .get("http://localhost:3001/api/v1/posts")
        .then((response) => {
          const postsData = response.data.posts.flat();
          postsData.reverse();
          setPosts(postsData);
        })
        .catch((error) => {
          console.error("Error fetching posts:", error);
        });

    
      setPostContent("");
    })
    .catch((error) => {
      console.error("Error while posting: ", error);
    });
  };

  const listStyle = {
    listStyleType: "none",
  };

  return (
    <div>
      <h1>Posts</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          name="content"
          cols="30"
          rows="3"
          placeholder="What's on your mind?"
          required
          value={postContent}
          onChange={handlePostContentChange}
          id="post-input"
        ></textarea>
        <input type="submit" value="Post" id="post-submit-btn" />
      </form>
      <ul style={listStyle}>
        {posts.map((post) => (
          <Post post={post} key={post._id} onDelete={getPosts}></Post>
        ))}
      </ul>
    </div>
  );
}
