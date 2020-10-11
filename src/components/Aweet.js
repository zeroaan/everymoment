import React, { useEffect, useState } from "react";
import "./Aweet.css";
import { dbService, storageService } from "fbase";

const Aweet = ({ aweetObj, isOwner, userObj }) => {
  const [editing, setEditing] = useState(false);
  const [newAweet, setNewAweet] = useState(aweetObj.text);
  const onDeleteClick = async () => {
    const ok = window.confirm(
      "삭제 후에 되돌릴 수 없습니다. 삭제하시겠습니까?"
    );
    if (ok) {
      await dbService.doc(`aweets/${aweetObj.id}`).delete();
      if (aweetObj.attachmentUrl) {
        await storageService.refFromURL(aweetObj.attachmentUrl).delete();
      }
    }
  };
  const toggleEditing = () => {
    setEditing((prev) => !prev);
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    await dbService.doc(`aweets/${aweetObj.id}`).update({
      text: newAweet,
    });
    setEditing(false);
  };
  const onChange = (e) => {
    const { value } = e.target;
    setNewAweet(value);
  };

  useEffect(() => {
    if (userObj) {
      if (
        userObj.uid === aweetObj.creatorId &&
        userObj.displayName !== aweetObj.userName
      ) {
        dbService.doc(`aweets/${aweetObj.id}`).update({
          userName:
            userObj.displayName || "익명" + String(userObj.uid).substring(3, 9),
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userObj]);

  return (
    <>
      {editing ? (
        <>
          <div className="aweet">
            <form className="aweet__editing" onSubmit={onSubmit}>
              <input
                className="aweet__editing__text"
                type="text"
                placeholder="내용을 입력하세요."
                value={newAweet}
                onChange={onChange}
                required
              />
              <div className="aweet__editing__button">
                <input
                  className="aweet__editing__button__edit"
                  type="submit"
                  value="수정"
                />
                <button
                  className="aweet__editing__button__cancel"
                  onClick={toggleEditing}
                >
                  취소
                </button>
              </div>
            </form>
          </div>
        </>
      ) : (
        <>
          <div className="aweet">
            <div className="aweet__box">
              <p>{aweetObj.text}</p>
              <h5>
                {aweetObj.userName}
                <br />
                {String(new Date(aweetObj.createdAt)).substring(0, 24)}
              </h5>
            </div>
            {aweetObj.attachmentUrl && (
              <img
                className="aweet__img"
                src={aweetObj.attachmentUrl}
                alt="attachment"
              />
            )}
            {isOwner && (
              <div className="aweet__button">
                <i class="fas fa-edit" onClick={toggleEditing}></i>
                <i class="fas fa-trash-alt" onClick={onDeleteClick}></i>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default Aweet;
