import { useState, useEffect, useRef } from "react";
import { supabase } from "../supabase";

const useBlobs = (initialUser, mapDimensions, roomId) => {
  const [playerPosition, setPlayerPosition] = useState({
    x: 200,
    y: 100,
    size: 20, // Default size before fetching
  });
  const [blobs, setBlobs] = useState([]);
  const lastMousePosition = useRef({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  });
  const [initialized, setInitialized] = useState(false); // New state to track initialization

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
          console.log("Initial player data:", data);
          setPlayerPosition({ ...initialUser, ...data });
          setInitialized(true); // Set initialized to true after fetching data
        }
      } catch (error) {
        console.error("Unexpected error fetching initial player data:", error);
      }
    };

    fetchInitialPlayerData();
  }, [initialUser, initialized]);

  useEffect(() => {
    if (!initialUser?.userId || !initialized) return; // Only run when initialized is true

    const handleMouseMove = (event) => {
      lastMousePosition.current = { x: event.clientX, y: event.clientY };
    };

    window.addEventListener("mousemove", handleMouseMove);

    const updateAndFetchBlobs = async () => {
      // Update player position
      setPlayerPosition((prevPlayerPosition) => {
        const deltaX = lastMousePosition.current.x - window.innerWidth / 2;
        const deltaY = lastMousePosition.current.y - window.innerHeight / 2;
        const maxSpeed = 4; // maximum speed per interval

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

      // Update and fetch blobs from Supabase
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
          // Filter out the player's own blob
          const filteredBlobs = data.filter(
            (blob) => blob.id !== initialUser.userId
          );
          setBlobs(filteredBlobs);
        }
      } catch (error) {
        console.error("Unexpected error fetching blobs:", error);
      }
    };

    const interval = setInterval(updateAndFetchBlobs, 50); // Update and fetch every 500ms

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearInterval(interval);
    };
  }, [mapDimensions, roomId, playerPosition, initialUser, initialized]);

  const mapPosition = {
    x: Math.round(-(playerPosition.x - window.innerWidth / 2)),
    y: Math.round(-(playerPosition.y - window.innerHeight / 2)),
  };

  return { playerPosition, mapPosition, blobs };
};

export default useBlobs;
