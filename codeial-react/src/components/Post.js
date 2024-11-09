import React from 'react';
import axios from 'axios';

function Post({ post, key, onDelete}) {
  // Check if user exists, and use optional chaining to safely access properties
  const content = post?.content ?? 'No content available';
  const userName = post?.user?.name ?? 'Unknown';
  const avatar = post?.user?.avatar ?? '/default-avatar.png'; // Provide a default or placeholder avatar if none is available

  // Assuming the server is running locally, adjust as necessary for production
  const imgSrc = `http://localhost:8000${avatar}`;

  const token = localStorage.getItem("token");

  const handleDeleteBtnClick = () => {
    axios.delete(`http://localhost:3001/api/v1/posts/${post._id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      console.log("Delete response: ", response.data);
      onDelete();
    })
    .catch((error) => {
      console.error("Error while deleting post: ", error);
    });
  }

  return (
    <div className="PostContainer">
      <div className="AvatarSection">
        <img src={imgSrc} alt={`${userName}'s avatar`} className="Avatar" />
      </div>
      <div className="ContentSection">
        <div className="UserInfo">
          <strong>{userName}</strong> {/* Display the username or "Unknown" if not available */}
          <span>@{userName.toLowerCase().replace(/\s+/g, '')}</span> {/* Generate a placeholder username if necessary */}
          {/* Add timestamp here if available */}
        </div>
        <p className="PostContent">{content}</p>
        {/* Optional: Add action buttons (like, retweet, reply) here */}
      </div>

      {/* delete button */}

      <button onClick={handleDeleteBtnClick}>Delete</button>
    </div>
  );
}

export default Post;
