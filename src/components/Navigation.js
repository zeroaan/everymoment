import React from "react";
import { Link } from "react-router-dom";

const Navigation = ({ userObj }) => {
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
              {userObj.displayName ? (
                <>{userObj.displayName}의 Profile</>
              ) : (
                <>{String(userObj.uid).substring(0, 6)}의 Profile</>
              )}
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default Navigation;
