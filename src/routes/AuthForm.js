import React, { useState } from "react";
import { authService } from "fbase";

const AuthForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newAccount, setNewAccount] = useState(false);
  const [error, setError] = useState("");

  const onChange = (e) => {
    // 아래와 같음: const { name, value } = e.target;
    const {
      target: { name, value },
    } = e;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      let data;
      if (newAccount) {
        data = await authService.createUserWithEmailAndPassword(
          email,
          password
        );
      } else {
        data = await authService.signInWithEmailAndPassword(email, password);
      }
      console.log(data.operationType);
    } catch (error) {
      setError(error.message);
    }
  };
  const toggleAccount = () => {
    setNewAccount((prev) => !prev);
  };
  const errorMessage = (error) => {
    let message;
    if (
      error ===
      "There is no user record corresponding to this identifier. The user may have been deleted."
    ) {
      message = "가입되지 않은 이메일입니다.";
    } else if (error === "The email address is badly formatted.") {
      message = "이메일 주소의 형식이 잘못되었습니다.";
    } else if (error === "Password should be at least 6 characters") {
      message = "비밀번호는 최소 6자리 이상이어야 합니다.";
    } else if (
      error === "The password is invalid or the user does not have a password."
    ) {
      message = "잘못된 비밀번호입니다.";
    } else if (
      error ===
      "Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later."
    ) {
      message =
        "로그인 시도가 많이 실패하여 일시적으로 비활성화 되었습니다. 잠시 후에 다시 시도해주세요.";
    }
    return message || error;
  };

  return (
    <>
      <form className="auth__form" onSubmit={onSubmit}>
        <div className="auth__input">
          <div className="form__input">
            <input
              name="email"
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={onChange}
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={onChange}
            />
          </div>
          <input
            className="form__submit"
            type="submit"
            value={newAccount ? "회원가입" : "로그인"}
          />
        </div>
        <div>
          {error && <p className="form__error">{errorMessage(error)}</p>}
        </div>
        <span onClick={toggleAccount}>
          {newAccount ? (
            <>
              <p className="auth__sign">
                이미 아이디가 있으신가요? &nbsp; <b>Sign In</b>
              </p>
            </>
          ) : (
            <>
              <p className="auth__sign">
                Awitter에 처음이신가요? &nbsp; <b>Create Account</b>
              </p>
            </>
          )}
        </span>
      </form>
    </>
  );
};

export default AuthForm;
