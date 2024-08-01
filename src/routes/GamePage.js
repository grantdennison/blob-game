import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box } from "@chakra-ui/react";
import useBlobs from "../hooks/useBlobs";

const GamePage = ({ user, roomId }) => {
  const navigate = useNavigate();
  const { playerPosition, mapPosition, blobs } = useBlobs(
    user,
    { width: 400, height: 200 },
    roomId
  );

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }
  }, [user, navigate]);

  return (
    <Box position="relative" width="100vw" height="100vh" overflow="hidden">
      <Box
        position="absolute"
        left={`${mapPosition.x}px`}
        top={`${mapPosition.y}px`}
        w="400px" // Map width
        h="200px" // Map height
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
            backgroundColor="blue"
            borderRadius="50%"
          />
        ))}
      </Box>
      <Box
        position="absolute"
        left="50%"
        top="50%"
        width={`${playerPosition.size}px`}
        height={`${playerPosition.size}px`}
        backgroundColor="red"
        borderRadius="50%"
        transform="translate(-50%, -50%)"
      />
    </Box>
  );
};

export default GamePage;
