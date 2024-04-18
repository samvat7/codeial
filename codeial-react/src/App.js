import './App.css';
import PostsList from './components/PostsList';
import Navbar from './components/Navbar';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';


function App() {
  return (

    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<PostsList />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>

  );
}

export default App;
