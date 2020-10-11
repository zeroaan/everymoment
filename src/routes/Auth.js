import React from "react";
import { authService, firebaseInstance } from "fbase";
import AuthForm from "routes/AuthForm";
import "./Auth.css";

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
    <div className="auth">
      <i class="fas fa-envelope-square auth__logo"></i>
      <AuthForm />
      <div className="auth__social">
        <button onClick={onSocialClick} name="google">
          Google 로그인
        </button>
        <button onClick={onSocialClick} name="github">
          Github 로그인
        </button>
      </div>
    </div>
  );
};
export default Auth;
