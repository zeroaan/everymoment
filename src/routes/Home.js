import React, { useEffect, useState } from "react";
import { dbService } from "fbase";
import Aweet from "components/Aweet";
import AweetForm from "components/AweetForm";
import "./Home.css";

const Home = ({ userObj }) => {
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
    const snapshot = dbService
      .collection("aweets")
      .orderBy("createdAt", "desc")
      .onSnapshot((snapshot) => {
        const aweetArray = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAweets(aweetArray);
      });
    return () => {
      snapshot();
    };
  }, []);

  return (
    <>
      <AweetForm userObj={userObj} />
      <div>
        {aweets.map((aweet) => (
          <Aweet
            key={aweet.id}
            aweetObj={aweet}
            isOwner={aweet.creatorId === userObj.uid}
            userObj={userObj}
          />
        ))}
      </div>
      <footer className="footer"></footer>
    </>
  );
};

export default Home;
