import React from 'react';

function Post({ post }) {
  // Check if user exists, and use optional chaining to safely access properties
  const content = post?.content ?? 'No content available';
  const userName = post?.user?.name ?? 'Unknown';
  const avatar = post?.user?.avatar ?? '/default-avatar.png'; // Provide a default or placeholder avatar if none is available

  // Assuming the server is running locally, adjust as necessary for production
  const imgSrc = `http://localhost:8000${avatar}`;

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
    </div>
  );
}

export default Post;
