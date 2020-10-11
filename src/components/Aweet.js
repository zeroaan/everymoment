import React, { useEffect, useState } from "react";
import "./Aweet.css";
import { dbService, storageService } from "fbase";

const Aweet = ({ aweetObj, isOwner, userObj }) => {
  const [editing, setEditing] = useState(false);
  const [newAweet, setNewAweet] = useState(aweetObj.text);
  const onDeleteClick = async () => {
    const ok = window.confirm("Are you sure you want to delete this aweet?");
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
            <form onSubmit={onSubmit}>
              <input
                type="text"
                placeholder="Edit your aweet"
                value={newAweet}
                onChange={onChange}
                required
              />
              <input type="submit" value="Update Aweet" />
            </form>
            <button onClick={toggleEditing}>cancel</button>
          </div>
        </>
      ) : (
        <>
          <div className="aweet">
            <div className="aweet__box">
              <p>{aweetObj.text}</p>
              <h5>
                {String(new Date(aweetObj.createdAt)).substring(0, 24)} /{" "}
                {aweetObj.userName}{" "}
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
