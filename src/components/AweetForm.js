import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { dbService, storageService } from "fbase";
import "./AweetForm.css";

const AweetFactory = ({ userObj }) => {
  const [aweet, setAweet] = useState("");
  const [attachment, setAttachment] = useState("");
  const [attachmentName, setAttachmentName] = useState("파일 선택");

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
    if (aweet !== "") {
      const aweetObj = {
        text: aweet,
        createdAt: Date.now(),
        creatorId: userObj.uid,
        attachmentUrl,
        userName:
          userObj.displayName || "익명" + String(userObj.uid).substring(3, 9),
      };
      await dbService.collection("aweets").add(aweetObj);
      setAweet("");
      setAttachment("");
    }
  };
  const onKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };
  const onChange = (e) => {
    const { value } = e.target;
    setAweet(value);
  };
  const onFileChange = (e) => {
    const { files } = e.target;
    const theFile = files[0];
    setAttachmentName(theFile.name);
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
      <form className="aweet__form" onSubmit={onSubmit}>
        <div className="aweet__form__input">
          <input
            className="aweet__form__input__text"
            type="text"
            value={aweet}
            onChange={onChange}
            placeholder="새 글을 작성해주세요!"
            maxLength={60}
            onKeyPress={onKeyPress}
            autoFocus={true}
          />
          <div className="aweet__form__input__file">
            <div>
              <input
                className="upload__name"
                value={attachmentName}
                disabled="disabled"
              />
              <label htmlFor="file__name">업로드</label>
              <input
                id="file__name"
                type="file"
                accept="image/*"
                onChange={onFileChange}
              />
            </div>
            {attachment && (
              <div className="attachment__img">
                <img src={attachment} alt="img" />
                <button onClick={onClearAttachment}>Clear</button>
              </div>
            )}
          </div>
        </div>
        <input
          className="aweet__form__input__submit"
          type="submit"
          value="글쓰기"
        />
      </form>
    </>
  );
};

export default AweetFactory;
