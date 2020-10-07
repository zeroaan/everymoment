import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { dbService, storageService } from "fbase";
import Aweet from "components/Aweet";

const Home = ({ userObj }) => {
  const [aweet, setAweet] = useState("");
  const [aweets, setAweets] = useState([]);
  const [attachment, setAttachment] = useState();

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
    // 글추가
    // await dbService.collection("aweets").add({
    //   text: aweet,
    //   createdAt: Date.now(),
    //   creatorId: userObj.uid,
    // });
    // setAweet("");

    // 사진 추가
    let attachmentUrl = "";
    if (attachment !== "") {
      const attachmentRef = storageService
        .ref()
        .child(`${userObj.uid}/${uuidv4()}`);
      const response = await attachmentRef.putString(attachment, "data_url");
      attachmentUrl = await response.ref.getDownloadURL();
    }
    const aweetObj = {
      text: aweet,
      createdAt: Date.now(),
      creatorId: userObj.uid,
      attachmentUrl,
    };
    await dbService.collection("aweets").add(aweetObj);
    setAweet("");
    setAttachment("");
  };
  const onChange = (e) => {
    const { value } = e.target;
    setAweet(value);
  };
  const onFileChange = (e) => {
    const { files } = e.target;
    const theFile = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      const { result } = finishedEvent.currentTarget;
      setAttachment(result);
    };
    reader.readAsDataURL(theFile);
  };
  const onClearAttachment = () => {
    setAttachment(null);
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
        <input type="file" accept="image/*" onChange={onFileChange} />

        <input type="submit" value="Aweet" />
        {attachment && (
          <div>
            <img src={attachment} alt="img" width="50px" height="50px" />
            <button onClick={onClearAttachment}>Clear</button>
          </div>
        )}
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
