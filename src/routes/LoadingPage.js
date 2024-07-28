import React, { useEffect, useState } from "react";
import { Box, Heading, Text, Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import Background from "../components/Background";
import { supabase } from "../supabase";

const LoadingPage = ({ user, roomId }) => {
  const [countdown, setCountdown] = useState(20); // Default to 20 seconds
  const [playerCount, setPlayerCount] = useState(1); // Assume the current user has already joined
  const navigate = useNavigate();

  // ################## Check if user is already logged in ##################
  useEffect(() => {
    const checkUserRoom = async () => {
      if (!user) {
        navigate("/");
        return;
      }
    };

    checkUserRoom();
  }, [user, navigate]);

  // ################## Check if user participated in a game ##################
  useEffect(() => {
    if (!roomId) {
      return;
    }

    // ################## Fetch player count and start time ##################
    const fetchPlayerCount = async () => {
      const { data: users, error } = await supabase
        .from("users")
        .select("*", { count: "exact" })
        .eq("room_id", roomId);
      if (error) {
        console.error("Error fetching player count:", error);
      } else {
        setPlayerCount(users.length);
        if (users.length >= 2) {
          const { data: roomData, error: roomError } = await supabase
            .from("rooms")
            .select("start_time")
            .eq("id", roomId)
            .maybeSingle();

          if (roomError) {
            console.error("Error fetching room start time:", roomError);
          } else {
            const startTime = new Date(roomData.start_time).getTime();
            const currentTime = new Date().getTime();
            const timeElapsed = Math.floor((currentTime - startTime) / 1000);
            setCountdown(Math.max(20 - timeElapsed, 0)); // 20 seconds countdown
          }
        } else {
          const { error: resetTimeError } = await supabase
            .from("rooms")
            .update({ start_time: null })
            .eq("id", roomId);

          if (resetTimeError) {
            console.error("Error resetting start time:", resetTimeError);
            return;
          }
        }
      }
    };

    fetchPlayerCount();

    const playerCountInterval = setInterval(fetchPlayerCount, 2000);
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => {
      clearInterval(playerCountInterval);
      clearInterval(countdownInterval);
    };
  }, [roomId]);

  // ################## Check if game is ready to start ##################

  useEffect(() => {
    if (countdown <= 0 && playerCount >= 2) {
      supabase
        .from("rooms")
        .update({ status: "started" })
        .eq("id", roomId)
        .then(() => {
          navigate("/game");
        });
    }
  }, [countdown, playerCount, navigate, roomId]);

  // ################## Leave the game ##################

  const handleLeaveGame = async () => {
    if (!user) {
      navigate("/");
      return;
    }
    await supabase
      .from("users")
      .update({ room_id: null })
      .eq("id", user.userId);
    navigate("/");
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      position="relative"
    >
      <Background blobCount={10} />
      <Heading mb={4}>
        {playerCount < 2
          ? "Waiting for at least 1 more player to join"
          : "Game starting in..."}
      </Heading>
      {playerCount >= 2 && <Text fontSize="4xl">{countdown}</Text>}
      <Text mt={4}>Players Joined: {playerCount}</Text>
      <Button colorScheme="red" mt={4} onClick={handleLeaveGame}>
        Leave Game
      </Button>
    </Box>
  );
};

export default LoadingPage;
