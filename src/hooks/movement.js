import { supabase } from "../config";

function findBlobById(blobs, id) {
  return blobs.find((blob) => blob.id === id);
}

function detectCollisions(blobs) {
  const collisions = [];

  for (let i = 0; i < blobs.length; i++) {
    for (let j = i + 1; j < blobs.length; j++) {
      const blobA = blobs[i];
      const blobB = blobs[j];
      const distance = Math.sqrt(
        (blobA.x - blobB.x) ** 2 + (blobA.y - blobB.y) ** 2
      );

      if (distance < (blobA.size + blobB.size) / 2) {
        collisions.push([blobA, blobB]);
      }
    }
  }

  return collisions;
}

async function handleCollisions(collisions, user, data, setPlayerPosition) {
  let updatedBlobs = [...collisions];

  for (const [blobA, blobB] of collisions) {
    if (blobA.id === user.userId || blobB.id === user.userId) {
      const playerBlob = blobA.id === user.userId ? blobA : blobB;
      const otherBlob = blobA.id === user.userId ? blobB : blobA;

      if (playerBlob.size > otherBlob.size) {
        if (otherBlob.type === "player") {
          playerBlob.size += 5;
        } else {
          playerBlob.size += 2;
          otherBlob.x = Math.round(Math.random() * 1000);
          otherBlob.y = Math.round(Math.random() * 500);

          try {
            await supabase
              .from("computer_blobs")
              .update({ x: otherBlob.x, y: otherBlob.y })
              .eq("id", otherBlob.id);
          } catch (error) {
            console.error(
              "Error updating computer blob position:",
              error.message
            );
          }
        }

        setPlayerPosition((prevPlayerMovement) => {
          return { ...prevPlayerMovement, size: playerBlob.size };
        });
      } else {
        // Player loses
        // alert("Game Over");
      }
    }

    updatedBlobs = updatedBlobs.map((blob) =>
      blob.id === blobA.id ? blobA : blob.id === blobB.id ? blobB : blob
    );
  }
}

export const blobMovement = (
  data,
  user,
  setBlobs,
  setMap,
  setPlayerPosition
) => {
  data.forEach((blob) => {
    if (blob.id === user.userId) {
      const mapPosition = {
        x: Math.round(-(blob.x - window.innerWidth / 2)),
        y: Math.round(-(blob.y - window.innerHeight / 2)),
      };
      setMap(mapPosition);
    }
  });

  const collisions = detectCollisions(data);
  handleCollisions(collisions, user, data, setPlayerPosition);

  setBlobs(data); // Directly set the blobs
};
