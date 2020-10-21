import React from "react";
import { Link } from "react-router-dom";
import "./Navigation.css";

const Navigation = ({ userObj }) => {
  return (
    <>
      <nav className="navi">
        <Link to="/" replace>
          <i className="fas fa-envelope-square navi__logo"></i>
        </Link>
        <ul className="navi__link">
          <li className="navi__link__list home">
            <Link to="/" replace>
              Home
            </Link>
          </li>
          <li className="navi__link__list">
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
