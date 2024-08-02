// src/components/Login.js
import React, { useState } from "react";
import { Box, Input, Button, VStack, Text } from "@chakra-ui/react";
import { supabase } from "../config";
import { setCookie } from "./CookieService";

const Login = ({ setUser }) => {
  const [name, setName] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (name.length < 4 || name.length > 20) {
      setError("Name must be between 4 and 20 characters.");
      return;
    }
    if (pin.length < 4 || pin.length > 6) {
      setError("PIN must be between 4 and 6 characters.");
      return;
    }

    try {
      // Call the verify_user_pin function
      const { data: isValidPin, error: pinError } = await supabase.rpc(
        "verify_user_pin",
        {
          user_name: name,
          user_pin: pin,
        }
      );

      if (pinError || !isValidPin) {
        setError("Invalid name or pin.");
        return;
      }

      // If pin is valid, fetch user details (excluding pin)
      const { data: user, error: userError } = await supabase
        .from("users")
        .select("id, name")
        .eq("name", name)
        .single();

      if (userError || !user) {
        setError("Login failed.");
        return;
      }

      // Set user cookie and update state
      const loggedInUser = { userName: user.name, userId: user.id };
      setCookie("blob", loggedInUser, {
        path: "/",
        expires: new Date(Date.now() + 604800000), // 1 week
      });
      setUser(loggedInUser);
    } catch (err) {
      setError("Unexpected error during login.");
      console.error("Unexpected error:", err.message);
    }
  };

  return (
    <Box as="form" onSubmit={handleLogin}>
      <VStack spacing={4} maxW={400}>
        <Input
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={20}
          autoComplete="username"
        />
        <Input
          placeholder="Enter 4-digit PIN"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          maxLength={6}
          type="password"
          autoComplete="current-password"
        />
        <Button type="submit" colorScheme="teal">
          Login
        </Button>
        {error && <Text color="red.500">{error}</Text>}
      </VStack>
    </Box>
  );
};

export default Login;
