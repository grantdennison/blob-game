import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";
import usePlayerMovement from "../hooks/usePlayerMovement";

const GamePage = ({ user, roomId }) => {
  const navigate = useNavigate();
  console.log("user:", user);
  console.log("roomId:", roomId);
  //   const [blobs, setBlobs] = useState([]);
  //   const position = usePlayerMovement({ x: 100, y: 100, size: 10 });

  //   useEffect(() => {
  //     const fetchBlobs = async () => {
  //       const { data, error } = await supabase
  //         .from("users")
  //         .select("id, x, y, size")
  //         .eq("room_id", roomId);

  //       if (error) {
  //         console.error("Error fetching blobs:", error);
  //       } else {
  //         setBlobs(data);
  //       }
  //     };

  //     fetchBlobs();

  //     const blobSubscription = supabase
  //       .from(`users:room_id=eq.${roomId}`)
  //       .on("UPDATE", (payload) => {
  //         setBlobs((prevBlobs) =>
  //           prevBlobs.map((blob) =>
  //             blob.id === payload.new.id ? payload.new : blob
  //           )
  //         );
  //       })
  //       .subscribe();

  //     return () => {
  //       supabase.removeSubscription(blobSubscription);
  //     };
  //   }, [roomId]);

  //   useEffect(() => {
  //     if (blobs.length <= 1) {
  //       navigate("/gameover");
  //     }
  //   }, [blobs, navigate]);

  //   useEffect(() => {
  //     const updatePosition = async () => {
  //       const { error } = await supabase
  //         .from("users")
  //         .update(position)
  //         .eq("id", user.id);

  //       if (error) {
  //         console.error("Error updating position:", error);
  //       }
  //     };

  //     const intervalId = setInterval(updatePosition, 200); // Update every 200ms

  //     return () => clearInterval(intervalId);
  //   }, [position, user.id]);

  //   return (
  //     <div>
  //       <h1>Game Page</h1>
  //       {blobs.map((blob) => (
  //         <div
  //           key={blob.id}
  //           style={{
  //             position: "absolute",
  //             left: blob.x,
  //             top: blob.y,
  //             width: blob.size,
  //             height: blob.size,
  //             backgroundColor: "blue",
  //             borderRadius: "50%",
  //           }}
  //         ></div>
  //       ))}
  //     </div>
  //   );

  return (
    <div>
      <h1>Game Page</h1>
      <button onClick={() => navigate("/")}>Go Back</button>
    </div>
  );
};

export default GamePage;
