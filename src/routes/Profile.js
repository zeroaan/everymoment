import React, { useEffect, useState } from "react";
import { authService, dbService } from "fbase";
import { useHistory } from "react-router-dom";

const Profile = ({ userObj }) => {
  const [myAweets, setMyAweets] = useState([]);
  const history = useHistory();
  const onLogOutClick = () => {
    authService.signOut();
    history.push("/");
  };
  const getMyNweets = async () => {
    const aweets = await dbService
      .collection("aweets")
      .where("creatorId", "==", userObj.uid)
      .orderBy("createdAt", "desc")
      .get();

    await aweets.docs.map((doc) =>
      setMyAweets((prev) => [...prev, doc.data()])
    );
    return () => {
      aweets();
    };
  };

  useEffect(() => {
    getMyNweets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <button onClick={onLogOutClick}>Log out</button>

      {myAweets.map((aweet) => (
        <div key={aweet.createdAt} className="aweet">
          <h4>{aweet.text}</h4>
          <h5>{String(new Date(aweet.createdAt)).substring(0, 24)}</h5>
          {aweet.attachmentUrl && (
            <img
              src={aweet.attachmentUrl}
              width="50px"
              height="50px"
              alt="attachment"
            />
          )}
        </div>
      ))}
    </>
  );
};

export default Profile;
