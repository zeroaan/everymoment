import React, { useEffect, useState } from "react";
import { dbService } from "fbase";

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
    // 실시간
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
      created: String(new Date()).substring(0, 24),
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
          <div key={aweet.id}>
            <h4>{aweet.text}</h4>
            <h5>{aweet.created}</h5>
          </div>
        ))}
      </div>
    </>
  );
};

export default Home;
