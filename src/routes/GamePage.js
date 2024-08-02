import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box } from "@chakra-ui/react";
import useBlobs from "../hooks/useBlobs";
import { blobMovement } from "../hooks/movement";

const GamePage = ({ user, roomId }) => {
  const navigate = useNavigate();
  const [blobs, setBlobs] = useState([]);
  const [map, setMap] = useState({ x: 0, y: 0 });

  const { initialUser } = useBlobs(
    user,
    { width: 1000, height: 500 },
    roomId,
    (data) => blobMovement(data, initialUser, setBlobs, setMap)
  );

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }
  }, [user, navigate]);
  // console.log(map.x);
  return (
    <Box position="relative" width="100vw" height="100vh" overflow="hidden">
      <Box
        position="absolute"
        left={`${map.x}px`}
        top={`${map.y}px`}
        w="10000px" // Map width
        h="5000px" // Map height
        bg="gray.200" // Optional map background color
        border="2px solid black" // Border around the map
        boxSizing="border-box" // Ensure border is included in the box size
      >
        {blobs.map((blob) => (
          <Box
            key={blob.id}
            position="absolute"
            left={`${blob.x}px`}
            top={`${blob.y}px`}
            width={`${blob.size}px`}
            height={`${blob.size}px`}
            backgroundColor={
              blob.type === "player"
                ? blob.id === user.userId
                  ? "blue"
                  : "red"
                : "green"
            }
            borderRadius="50%"
          />
        ))}
      </Box>
      {/* <Box
        position="absolute"
        left="50%"
        top="50%"
        width={`${playerPosition.size}px`}
        height={`${playerPosition.size}px`}
        backgroundColor="red"
        borderRadius="50%"
        transform="translate(-50%, -50%)"
      /> */}
    </Box>
  );
};

export default GamePage;
