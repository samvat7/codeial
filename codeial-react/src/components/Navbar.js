import React from "react";

export default function Navbar({ user }) {
  // if user is an empty object, set it to null
  if (user) {
    if (Object.keys(user).length === 0) {
      user = null;
    }
  }

  const handleLogoutBtnClick = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <div>
      <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <div class="container-fluid">
          <a class="navbar-brand" href="/">
            Codeial
          </a>
          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
              <li class="nav-item">
                <a class="nav-link active" aria-current="page" href="/">
                  Home
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#">
                  Users
                </a>
              </li>
            </ul>
            <div className="d-flex">
              {user ? (
                <div className="d-flex">
                  <p className="m-0 me-2 mt-2">{user.name}</p>
                  <img
                    className="me-2"
                    src={`http://localhost:3001${user.avatar}`}
                    alt={user.name}
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                    }}
                  />
                  <button
                    className="btn btn-outline-danger"
                    onClick={handleLogoutBtnClick}
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div>
                  <a href="/login" className="btn btn-outline-primary me-2">
                    Login
                  </a>
                  <a href="/register" className="btn btn-outline-primary">
                    Register
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
