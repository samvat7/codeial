import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Post from './Post';

export default function PostsList() {
    const [posts, setPosts] = useState([]);
    const [postContent, setPostContent] = useState(''); // State to hold the textarea content

    var getPosts = () => {};

    useEffect(() => {
        getPosts = () => {
            axios.get('http://127.0.0.1:8000/api/v1/posts').then((response) => {
                const postsData = response.data.posts.flat();
                setPosts(postsData);
            }).catch(error => {
                console.error("Error fetching posts:", error);
            });
        }

        getPosts();
    }, []);

    const handlePostContentChange = (event) => {
        setPostContent(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault(); // Prevents the default form submit action
        // Here you would call the API to submit the new post
        axios.post('http://localhost:8000/posts/create', { content: postContent })
            .then(response => {
                // Optionally, fetch posts again or manually add the new post to the state
                console.log('Post created successfully:', response.data);
                setPostContent(''); // Clear textarea after successful submission
                getPosts(); // Refresh the list of posts
            })
            .catch(error => {
                console.error('Error creating post:', error);
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
                    id='post-input'
                ></textarea>
                <input type="submit" value="Post" id='post-submit-btn'/>
            </form>
            <ul style={listStyle}>
                {posts.map((post) => <Post post={post} key={post._id}></Post>)}
            </ul>
        </div>
    );
}
