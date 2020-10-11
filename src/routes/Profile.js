import React, { useEffect, useState } from "react";
import { authService, dbService } from "fbase";
import { useHistory } from "react-router-dom";
import Aweet from "components/Aweet";
import "./Profile.css";

const Profile = ({ refreshUser, userObj }) => {
  const [myAweets, setMyAweets] = useState([]);
  const [newDisplayName, setNewDisplayName] = useState(
    userObj.displayName || "익명" + String(userObj.uid).substring(3, 9)
  );
  const history = useHistory();
  const onLogOutClick = () => {
    authService.signOut();
    history.push("/");
  };
  const onChange = (e) => {
    const { value } = e.target;
    setNewDisplayName(value);
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    if (userObj.displayName !== newDisplayName) {
      await userObj.updateProfile({
        displayName: newDisplayName,
      });
      refreshUser();
    }
  };
  const onKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  useEffect(() => {
    const snapshot = dbService
      .collection("aweets")
      .where("creatorId", "==", userObj.uid)
      .orderBy("createdAt", "desc")
      .onSnapshot((snapshot) => {
        const aweetArray = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMyAweets(aweetArray);
      });

    return () => {
      snapshot();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <form className="profile__form" onSubmit={onSubmit}>
        <button className="profile__form__logout" onClick={onLogOutClick}>
          로그아웃
        </button>
        <div>
          <label htmlFor="id_change">아이디 변경</label>
          <input
            className="profile__form__text"
            id="id_change"
            onChange={onChange}
            type="text"
            placeholder="Display name"
            value={newDisplayName}
            maxLength={10}
            onKeyPress={onKeyPress}
          />
          <input
            className="profile__form__submit"
            type="submit"
            value="바꾸기"
          />
        </div>
        <h2 className="profile__myWrite">내가 쓴 글</h2>
      </form>
      {myAweets.map((aweet) => (
        <Aweet
          key={aweet.id}
          aweetObj={aweet}
          isOwner={aweet.creatorId === userObj.uid}
        />
      ))}
      <footer className="footer"></footer>
    </>
  );
};

export default Profile;
