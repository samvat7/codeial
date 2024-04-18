import React from "react";
import axios from "axios";
import { useState } from "react";


export default function Login() {

    const [username, setUsername] = useState('');

    const [password, setPassword] = useState('');


    const handleLoginBtnClick = () => {

        console.log("Username/Password: ", username, ", ", password);
        
        axios.post('http://localhost:8000/users/create', {
            username: username,
            password: password
        }).then((response) => {
            console.log(response);
        }).catch((error) => {
            console.log(error);
        });
    }




  return (
    <div>
      <div className="container my-3">
        <div className="input-group mb-3">
          <div className="input-group-prepend">
            <span className="input-group-text" id="login-username">
              @
            </span>
          </div>
          <input
            type="text"
            className="form-control"
            placeholder="Username"
            name="username"
            aria-label="Username"
            aria-describedby="basic-addon1"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
      </div>

      <div className="container my-3">
        <div className="input-group mb-3">
          <div className="input-group-prepend">
            <span className="input-group-text" id="login-password">
              ...
            </span>
          </div>
          <input
            type="password"
            className="form-control"
            placeholder="Password"
            name="password"
            aria-label="Password"
            aria-describedby="basic-addon1"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </div>

      {/* create container div class with flex and space between */}

      <div className="container d-flex justify-content-around">
        <button type="button" className="btn btn-primary" onClick={handleLoginBtnClick} >
          Login
        </button>
        <a href="/register" className="btn btn-primary">
          Register
        </a>
      </div>
    </div>
  );
}
