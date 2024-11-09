import React, { useEffect } from "react";
import PostsList from "../components/PostsList";
import Navbar from "../components/Navbar";
import { useState } from "react";

export default function HomePage() {
  // retrive user details if token is present

  const [user, setUser] = useState({});

  useEffect(() => {
    const token = localStorage.getItem("token");
    
    if (token) {
      fetch("http://localhost:8000/api/v1/user", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          localStorage.setItem("user", JSON.stringify(data.user));
          setUser(data.data.user);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  }, []);

  return (
    <div>
      <Navbar user={user} />
      <PostsList />
    </div>
  );
}
