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
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <a className="navbar-brand" href="/">
          Codeial
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item active">
              <a className="nav-link" href="/">
                Home <span className="sr-only">(current)</span>
              </a>
            </li>
            <li className="nav-item">
              {user ? (
                <div className="nav-link" onClick={handleLogoutBtnClick}>
                  Logout
                </div>
              ) : (
                <a className="nav-link" href="/login">
                  Login
                </a>
              )}
            </li>
          </ul>
          {/* <form className="form-inline my-2 my-lg-0">
      <input className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" />
      <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
    </form> */}
          <div className="user-details d-flex flex-row">
            {user ? (
              <img
                src={`http://localhost:3001${user.avatar}`}
                alt="user-avatar"
                className="navbar-avatar"
              />
            ) : (
              <div className="navbar-avatar"></div>
            )}
            <div className="navbar-username mx-1">
              {user ? user.name : "User"}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
