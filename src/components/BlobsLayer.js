// src/components/BlobsLayer.js
import React from "react";

const BlobsLayer = ({ blobs }) => {
  return (
    <div>
      {blobs.map((blob) => (
        <div
          key={blob.id}
          style={{
            position: "absolute",
            left: blob.x,
            top: blob.y,
            width: blob.size,
            height: blob.size,
            backgroundColor: "blue",
            borderRadius: "50%",
          }}
        ></div>
      ))}
    </div>
  );
};

export default BlobsLayer;
