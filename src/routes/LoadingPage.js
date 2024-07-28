import React, { useEffect, useState } from "react";
import { Box, Heading, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import Background from "../components/Background";
import { supabase } from "../supabase";

const LoadingPage = ({ roomId }) => {
  const [countdown, setCountdown] = useState(20); // Default to 20 seconds
  const [playerCount, setPlayerCount] = useState(1); // Assume the current user has already joined
  const navigate = useNavigate();

  useEffect(() => {
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
            .single();

          if (roomError) {
            console.error("Error fetching room start time:", roomError);
          } else {
            const startTime = new Date(roomData.start_time).getTime();
            const currentTime = new Date().getTime();
            const timeElapsed = Math.floor((currentTime - startTime) / 1000);
            setCountdown(Math.max(20 - timeElapsed, 0)); // 20 seconds countdown
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

  useEffect(() => {
    if (countdown === 0 && playerCount >= 2) {
      supabase
        .from("rooms")
        .update({ status: "started" })
        .eq("id", roomId)
        .then(() => {
          navigate("/game");
        });
    }
  }, [countdown, playerCount, navigate, roomId]);

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
    </Box>
  );
};

export default LoadingPage;
