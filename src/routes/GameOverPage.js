import React from "react";
import { Box, Button, Heading, Text } from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";

const GameOverPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const handleNewGame = () => {
    navigate("/");
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
    >
      <Heading mb={4}>Game Over</Heading>
      {state?.winner && <Text mb={4}>Winner: {state.winner.name}</Text>}
      <Button colorScheme="teal" onClick={handleNewGame}>
        Start New Game
      </Button>
    </Box>
  );
};

export default GameOverPage;
