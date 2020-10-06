import React, { useEffect, useState } from "react";
import { dbService } from "fbase";
import Aweet from "components/Aweet";

const Home = ({ userObj }) => {
  const [aweet, setAweet] = useState("");
  const [aweets, setAweets] = useState([]);

  /* 실시간 X 
  const getAweets = async () => {
    const dbAweets = await dbService.collection("aweets").get();
    dbAweets.forEach((document) => {
      const aweetObject = {
        ...document.data(),
        id: document.id,
      };
      setAweets((prev) => [aweetObject, ...prev]);
    });
  };
  */
  useEffect(() => {
    // getAweets();
    // 실시간 O
    dbService.collection("aweets").onSnapshot((snapshot) => {
      const aweetArray = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAweets(aweetArray);
    });
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    await dbService.collection("aweets").add({
      text: aweet,
      createdAt: Date.now(),
      creatorId: userObj.uid,
    });
    setAweet("");
  };
  const onChange = (e) => {
    const { value } = e.target;
    setAweet(value);
  };
  return (
    <>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          value={aweet}
          onChange={onChange}
          placeholder="What's on your mind?"
          maxLength={120}
        />
        <input type="submit" value="Aweet" />
      </form>
      <div>
        {aweets.map((aweet) => (
          <Aweet
            key={aweet.id}
            aweetObj={aweet}
            isOwner={aweet.creatorId === userObj.uid}
          />
        ))}
      </div>
    </>
  );
};

export default Home;
