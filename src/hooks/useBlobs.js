import { useState, useEffect } from "react";
import { supabase } from "../supabase";

const useBlobs = (user, roomId) => {
  const [blobs, setBlobs] = useState([]);

  useEffect(() => {
    const updateAndFetchBlobs = async () => {
      const { data, error } = await supabase.rpc("update_and_get_positions", {
        user_id: user.userId,
        new_x: user.x,
        new_y: user.y,
        new_size: user.size,
        user_room_id: roomId,
      });

      if (error) {
        console.error("Error fetching blobs:", error);
      } else {
        setBlobs(data);
      }
    };

    const interval = setInterval(updateAndFetchBlobs, 200); // Update and fetch every 200ms

    return () => clearInterval(interval);
  }, [user, roomId]);

  return blobs;
};

export default useBlobs;
