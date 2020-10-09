import React, { useEffect, useState } from "react";
import { authService, dbService } from "fbase";
import { useHistory } from "react-router-dom";
import Aweet from "components/Aweet";

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
      <form onSubmit={onSubmit}>
        <input
          onChange={onChange}
          type="text"
          placeholder="Display name"
          value={newDisplayName}
          onKeyPress={onKeyPress}
        />
        <input type="submit" value="Update name" />
      </form>
      <button onClick={onLogOutClick}>Log out</button>

      {myAweets.map((aweet) => (
        <Aweet
          key={aweet.id}
          aweetObj={aweet}
          isOwner={aweet.creatorId === userObj.uid}
        />
      ))}
    </>
  );
};

export default Profile;
