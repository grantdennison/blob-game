// src/components/Login.js
import React, { useState } from "react";
import { Box, Input, Button, VStack, Text } from "@chakra-ui/react";
import { supabase } from "../supabase";
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
      const { data, error, status } = await supabase
        .from("users")
        .select("*")
        .eq("name", name)
        .eq("pin", pin)
        .maybeSingle();

      if (status === 406 || !data || error) {
        setError("Invalid name or pin.");
      } else {
        const loggedInUser = { userName: data.name, userId: data.id };
        setCookie("blob", loggedInUser, {
          path: "/",
          expires: new Date(Date.now() + 604800000),
        });
        setUser(loggedInUser);
      }
    } catch (error) {
      setError("Invalid name or pin.");
      console.error("Error:", error.message);
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
          placeholder="Enter 4-6 digit PIN"
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
