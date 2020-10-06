import React from "react";

const Aweet = ({ aweetObj, isOwner }) => {
  return (
    <>
      <div>
        <h4>{aweetObj.text}</h4>
        <h5>{String(new Date(aweetObj.createdAt)).substring(0, 24)}</h5>
        {isOwner && (
          <>
            <button>Delete Aweet</button>
            <button>Edit Aweet</button>
          </>
        )}
      </div>
    </>
  );
};

export default Aweet;
