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
                <>{"익명" + String(userObj.uid).substring(3, 9)}의 Profile</>
              )}
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default Navigation;
