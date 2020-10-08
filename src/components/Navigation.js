import React from "react";
import { Link } from "react-router-dom";

const Navigation = () => {
  return (
    <>
      <nav>
        <ul>
          <li>
            <Link to="/" replace>
              Home
            </Link>
          </li>
          <li>
            <Link to="/profile" replace>
              My Profile
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default Navigation;
