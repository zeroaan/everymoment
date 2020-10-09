import React from "react";
import { authService, firebaseInstance } from "fbase";
import AuthForm from "routes/AuthForm";

const Auth = () => {
  const onSocialClick = async (e) => {
    // 구글, 깃허브 로그인 하기
    const { name } = e.target;
    let provider;
    if (name === "google") {
      provider = new firebaseInstance.auth.GoogleAuthProvider();
    } else if (name === "github") {
      provider = new firebaseInstance.auth.GithubAuthProvider();
    }
    await authService.signInWithPopup(provider);
  };

  return (
    <>
      <AuthForm />
      <div>
        <button onClick={onSocialClick} name="google">
          Continue with Google
        </button>
        <button onClick={onSocialClick} name="github">
          Continue with Github
        </button>
      </div>
    </>
  );
};
export default Auth;
