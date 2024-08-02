let prevBlobs = {};

function findBlobById(blobs, id) {
  return blobs.find((blob) => blob.id === id);
}

export const blobMovement = (data, user, setBlobs, setMap) => {
  if (!Array.isArray(prevBlobs) || !prevBlobs.length) {
    prevBlobs = data.map((blob) => ({ ...blob }));
  }

  let steps = 20; // Number of steps to reach the new position
  const interval = 5; // interval in milliseconds
  let step = 0;

  const intervalId = setInterval(() => {
    if (step >= steps) {
      clearInterval(intervalId);
      return;
    }

    data.forEach((blob) => {
      const prevBlob = findBlobById(prevBlobs, blob.id);

      if (prevBlob) {
        const deltaX = Math.round((blob.x - prevBlob.x) / steps);
        const deltaY = Math.round((blob.y - prevBlob.y) / steps);

        prevBlob.x += deltaX;
        prevBlob.y += deltaY;
      }

      if (blob.id === user.userId) {
        const mapPosition = {
          x: Math.round(-(prevBlob.x - window.innerWidth / 2)),
          y: Math.round(-(prevBlob.y - window.innerHeight / 2)),
        };
        setMap(mapPosition);
      }
    });
    setBlobs(prevBlobs); // Create a new array to trigger re-render

    step++;
  }, interval);
};
