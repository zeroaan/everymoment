import React, { useState } from "react";
import { dbService } from "fbase";

const Home = () => {
  const [aweet, setAweet] = useState("");
  const onSubmit = async (e) => {
    e.preventDefalut();
    await dbService.collection("aweets").add({
      aweet,
      createdAt: Date.now(),
    });
    setAweet("");
  };
  const onChange = (e) => {
    const { value } = e.target;
    setAweet(value);
  };
  return (
    <>
      <form>
        <input
          type="text"
          value={aweet}
          onChange={onChange}
          placeholder="What's on your mind?"
          maxLength={120}
        />
        <input type="submit" value="Aweet" />
      </form>
    </>
  );
};

export default Home;
