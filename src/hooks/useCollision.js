import { useEffect } from "react";
import { supabase } from "../supabase";

const useCollision = (blobs, user, updateUserPosition) => {
  useEffect(() => {
    const checkCollisions = async () => {
      for (const blob of blobs) {
        if (blob.id !== user.userId) {
          const dx = blob.x - user.x;
          const dy = blob.y - user.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < blob.size / 2 + user.size / 2) {
            if (user.size > blob.size) {
              // User eats the blob
              updateUserPosition(user.x, user.y, user.size + blob.size);
              await supabase.from("users").delete().eq("id", blob.id);
            } else {
              // Blob eats the user
              updateUserPosition(user.x, user.y, 0);
              await supabase.from("users").delete().eq("id", user.userId);
              // Optionally navigate to GameOver page or perform other actions
              break;
            }
          }
        }
      }
    };

    const interval = setInterval(checkCollisions, 100);
    return () => clearInterval(interval);
  }, [blobs, user, updateUserPosition]);
};

export default useCollision;
