import { useState, useEffect, useRef } from "react";
import { supabase } from "../config";

const useBlobs = (initialUser, mapDimensions, roomId, blobMovementCallback) => {
  const [playerPosition, setPlayerPosition] = useState({
    x: 500,
    y: 250,
    size: 20, // Default size before fetching
  });
  const [blobs, setBlobs] = useState([]);
  const [map, setMap] = useState({ x: 0, y: 0 });
  const lastMousePosition = useRef({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  });
  const [initialized, setInitialized] = useState(false);

  // Fetch initial player data
  useEffect(() => {
    const fetchInitialPlayerData = async () => {
      if (!initialUser?.userId || initialized) return;

      try {
        const { data, error } = await supabase
          .from("users")
          .select("x, y, size")
          .eq("id", initialUser.userId)
          .maybeSingle();

        if (error) {
          console.error("Error fetching initial player data:", error.message);
        } else {
          setPlayerPosition({ ...initialUser, ...data });
          setInitialized(true);
        }
      } catch (error) {
        console.error("Unexpected error fetching initial player data:", error);
      }
    };

    fetchInitialPlayerData();
  }, [initialUser, initialized]);

  // Update player position and fetch blobs
  useEffect(() => {
    if (!initialUser?.userId || !initialized) return;

    const handleMouseMove = (event) => {
      lastMousePosition.current = { x: event.clientX, y: event.clientY };
    };

    window.addEventListener("mousemove", handleMouseMove);

    const updateAndFetchBlobs = async () => {
      // Update player position
      setPlayerPosition((prevPlayerPosition) => {
        const deltaX = lastMousePosition.current.x - window.innerWidth / 2;
        const deltaY = lastMousePosition.current.y - window.innerHeight / 2;
        const maxSpeed = 10; // maximum speed per interval

        let newX =
          prevPlayerPosition.x +
          deltaX * (maxSpeed / Math.max(Math.abs(deltaX), maxSpeed));
        let newY =
          prevPlayerPosition.y +
          deltaY * (maxSpeed / Math.max(Math.abs(deltaY), maxSpeed));

        // Prevent moving past the map boundaries
        newX = Math.min(Math.max(Math.round(newX), 0), mapDimensions.width);
        newY = Math.min(Math.max(Math.round(newY), 0), mapDimensions.height);

        return { ...prevPlayerPosition, x: newX, y: newY };
      });

      // Fetch blobs
      try {
        const { data, error } = await supabase.rpc("update_and_get_positions", {
          user_id: initialUser.userId,
          new_x: playerPosition.x,
          new_y: playerPosition.y,
          new_size: playerPosition.size,
          user_room_id: roomId,
        });

        if (error) {
          console.error("Error fetching blobs:", error.message);
        } else {
          blobMovementCallback(
            data,
            initialUser,
            setBlobs,
            setMap,
            setPlayerPosition
          );
        }
      } catch (error) {
        console.error("Unexpected error fetching blobs:", error);
      }
    };

    const interval = setInterval(updateAndFetchBlobs, 100); // Update and fetch every 100ms

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearInterval(interval);
    };
  }, [
    mapDimensions,
    roomId,
    playerPosition,
    initialUser,
    initialized,
    blobMovementCallback,
  ]);

  return { playerPosition, map, blobs, setPlayerPosition };
};

export default useBlobs;
