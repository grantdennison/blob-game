// src/routes/StartPage.js
import React, { useState, useEffect } from "react";
import { Box, Heading, Button, VStack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { getCookie } from "../components/CookieService";
import { supabase } from "../supabase";
import Background from "../components/Background";
import Login from "../components/Login";
import Register from "../components/Register";
import Logout from "../components/Logout";

const StartPage = ({ setUser, user, setRoomId }) => {
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // ################## Check if user is already logged in ##################

    const userCookie = getCookie("blob");
    if (userCookie) {
      setUser(userCookie);

      // ################## Check if user participated in a game ##################

      const fetchData = async () => {
        const { data: userData, error } = await supabase
          .from("users")
          .select("room_id")
          .eq("id", userCookie.userId)
          .single();
        if (error || !userData?.room_id) {
          return;
        }

        setRoomId(userData.room_id);

        const { data: roomData, error: roomError } = await supabase
          .from("rooms")
          .select("status")
          .eq("id", userData.room_id)
          .maybeSingle();

        if (roomError || !roomData) {
          return;
        }

        if (roomData.status === "waiting") {
          navigate("/loading");
        }
      };

      fetchData();
    }
  }, [setUser, navigate, setRoomId]);

  //############### Handle Start Game ############################

  const handleStartGame = async () => {
    const loggedInUser = getCookie("blob");

    if (!loggedInUser || !loggedInUser.userId) {
      console.error("User is not logged in or user ID is missing.");
      return;
    }

    let roomId;
    const { data: existingRooms, error: roomFetchError } = await supabase
      .from("rooms")
      .select("*")
      .eq("status", "waiting");

    if (roomFetchError) {
      console.error("Error fetching rooms:", roomFetchError);
      return;
    }

    if (existingRooms && existingRooms.length > 0) {
      roomId = existingRooms[0].id;
    } else {
      const { data: newRoom, error: roomInsertError } = await supabase
        .from("rooms")
        .insert([{ start_time: null, status: "waiting" }])
        .select("*")
        .single();

      if (roomInsertError) {
        console.error("Error creating room:", roomInsertError);
        return;
      }

      if (!newRoom || !newRoom.id) {
        console.error("Failed to create a new room:", newRoom);
        return;
      }

      roomId = newRoom.id;
    }

    const { error: userUpdateError } = await supabase
      .from("users")
      .update({ room_id: roomId })
      .eq("id", loggedInUser.userId)
      .select();

    if (userUpdateError) {
      console.error("Error updating user with room_id:", userUpdateError);
      return;
    }

    const { data: usersInRoom, error: playerCountError } = await supabase
      .from("users")
      .select("*")
      .eq("room_id", roomId);

    if (playerCountError) {
      console.error("Error fetching player count:", playerCountError);
      return;
    }

    const playerCount = usersInRoom.length;

    if (playerCount >= 2) {
      const { error: startTimeError } = await supabase
        .from("rooms")
        .update({ start_time: new Date() })
        .eq("id", roomId)
        .is("start_time", null);

      if (startTimeError) {
        console.error("Error setting start time:", startTimeError);
        return;
      }
    }

    setRoomId(roomId);
    navigate("/loading");
  };

  // ################ End Handle Start Game #######################

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
      {user ? (
        <>
          <Heading mb={4}>Welcome back, {user.userName}!</Heading>
          <Button colorScheme="teal" onClick={handleStartGame} mb={4}>
            Start Game
          </Button>
          <Logout setUser={setUser} />
        </>
      ) : (
        <>
          <Heading mb={4}>{isCreatingUser ? "Create User" : "Login"}</Heading>
          <VStack spacing={4} maxW={400}>
            {isCreatingUser ? (
              <Register setUser={setUser} />
            ) : (
              <Login setUser={setUser} />
            )}
            <Button
              variant="link"
              onClick={() => setIsCreatingUser(!isCreatingUser)}
            >
              {isCreatingUser
                ? "Have an account? Login"
                : "No account? Create User"}
            </Button>
          </VStack>
        </>
      )}
    </Box>
  );
};

export default StartPage;
