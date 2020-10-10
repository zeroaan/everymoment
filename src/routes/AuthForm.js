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
            value={newAccount ? "Create" : "Login"}
          />
        </div>
        <div>{error && <p className="form__error">{error}</p>}</div>
        <span onClick={toggleAccount}>
          {newAccount ? (
            <>
              <p className="auth__sign">
                이미 아이디가 있으신가요? <b>Sign In</b>
              </p>
            </>
          ) : (
            <>
              <p className="auth__sign">
                Awitter에 처음이신가요? <b>Create Account</b>
              </p>
            </>
          )}
        </span>
      </form>
    </>
  );
};

export default AuthForm;
