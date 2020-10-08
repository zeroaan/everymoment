import React, { useState } from "react";
import "./Aweet.css";
import { dbService, storageService } from "fbase";

const Aweet = ({ aweetObj, isOwner }) => {
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
            <h4>{aweetObj.text}</h4>
            <h5>{String(new Date(aweetObj.createdAt)).substring(0, 24)}</h5>
            {aweetObj.attachmentUrl && (
              <img
                src={aweetObj.attachmentUrl}
                width="50px"
                height="50px"
                alt="attachment"
              />
            )}
            {isOwner && (
              <div className="aweet__button">
                <button onClick={onDeleteClick}>Delete Aweet</button>
                <button onClick={toggleEditing}>Edit Aweet</button>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default Aweet;
