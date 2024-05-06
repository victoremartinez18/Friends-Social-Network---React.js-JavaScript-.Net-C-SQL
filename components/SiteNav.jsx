import React from "react";
import usersService from "../services/usersService";
import { useNavigate } from "react-router-dom";
import toastr from "toastr";

import { Link } from "react-router-dom";

function SiteNav(props) {
  const user = props.user;

  const navigate = useNavigate();

  const onLogOutClicked = () => {
    const onLogOutSuccess = (response) => {
      console.log("This is onlogOutSuccess response: ", response);
      toastr.success("Logout Successful");

      setTimeout(() => {
        navigate("/");
        navigate(0);
      }, 2000);
    };

    const onLogOutError = (error) => {
      console.error(error);
      toastr.error("Logout Error");
    };

    usersService.logOout().then(onLogOutSuccess).catch(onLogOutError);
  };

  return (
    <React.Fragment>
      <nav
        className="navbar navbar-expand-md navbar-dark bg-dark"
        aria-label="Fourth navbar example"
      >
        <div className="container">
          <Link to="/" className="navbar-brand">
            <img
              src="https://pw.sabio.la/images/Sabio.png"
              width="30"
              height="30"
              className="d-inline-block align-top"
              alt="Sabio"
            />
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarsExample04"
            aria-controls="navbarsExample04"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarsExample04">
            {user.firstName && (
              <React.Fragment>
                <ul className="navbar-nav me-auto mb-2 mb-md-0">
                  <li className="nav-item">
                    <Link to="/" className="nav-link px-2 text-white link-button">
                      Home
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/friends" className="nav-link px-2 text-white link-button">
                      Friends
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/jobs" className="nav-link px-2 text-white link-button">
                      Jobs
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/companies" className="nav-link px-2 text-white link-button">
                      Tech Companies
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/events" className="nav-link px-2 text-white link-button">
                      Events
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/test" className="nav-link px-2 text-white link-button">
                      Test and Ajax Call
                    </Link>
                  </li>
                </ul>
              </React.Fragment>
            )}
            <div className="d-flex ms-auto">
              <div className="text-end ">
                <Link
                  to="/"
                  className="align-items-center mb-2 me-2 mb-lg-0 text-white text-decoration-none"
                >
                  {user.firstName} {user.lastName}
                </Link>

                {user.image && (
                  <img
                    src={user.image}
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "0.375rem",
                      marginRight: "0.5rem",
                      border: "solid",
                      borderColor: "white",
                    }}
                    alt=""
                  />
                )}

                {user.image ? (
                  <button onClick={onLogOutClicked} className="btn  btn-outline-danger  me-2">
                    Logout
                  </button>
                ) : props.spinner[0] ? (
                  props.spinner
                ) : (
                  <React.Fragment>
                    <Link to="/login" type="button" className="btn btn-outline-light  me-2">
                      Login
                    </Link>
                    <Link to="/register" type="button" className="btn btn-warning">
                      Register
                    </Link>
                  </React.Fragment>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </React.Fragment>
  );
}

export default SiteNav;
