import React, { useEffect, useState } from "react";
import { authService, dbService } from "fbase";
import { useHistory } from "react-router-dom";
import Aweet from "components/Aweet";

const Profile = ({ userObj }) => {
  const [myAweets, setMyAweets] = useState([]);
  const history = useHistory();
  const onLogOutClick = () => {
    authService.signOut();
    history.push("/");
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
