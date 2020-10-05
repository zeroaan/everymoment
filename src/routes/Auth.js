import React from "react";

const Auth = ({ setIsLoggedIn }) => {
  const btClick = () => {
    setIsLoggedIn(true);
  };
  return (
    <>
      <span>Auth</span>
      <button onClick={btClick}>click</button>
    </>
  );
};
export default Auth;
