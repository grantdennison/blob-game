// src/components/Register.js
import React, { useState } from "react";
import { Box, Input, Button, VStack, Text } from "@chakra-ui/react";
import { supabase } from "../config";
import { setCookie } from "./CookieService";

const Register = ({ setUser }) => {
  const [name, setName] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleCreateUser = async (e) => {
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
      const {
        data: existingUser,
        error: fetchError,
        status,
      } = await supabase
        .from("users")
        .select("*")
        .eq("name", name)
        .maybeSingle();

      console.log("existingUser", existingUser);
      console.log("fetchError", fetchError);
      console.log("status", status);

      if (existingUser) {
        setError("User already exists.");
        return;
      }

      const { data, error: insertError } = await supabase
        .from("users")
        .insert([{ name, pin }])
        .select("*");

      if (insertError) {
        setError("Failed to create user.");
      } else {
        const newUser = { userName: data[0].name, userId: data[0].id };
        setCookie("blob", newUser, {
          path: "/",
          expires: new Date(Date.now() + 604800000),
        });
        setUser(newUser);
        setSuccess("User registered successfully.");
      }
    } catch (error) {
      setError("Failed to create user.");
      console.error("Unexpected error during user creation:", error);
    }
  };

  return (
    <Box as="form" onSubmit={handleCreateUser}>
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
          autoComplete="new-password"
        />
        <Button type="submit" colorScheme="teal">
          Create User
        </Button>
        {error && <Text color="red.500">{error}</Text>}
        {success && <Text color="green.500">{success}</Text>}
      </VStack>
    </Box>
  );
};

export default Register;
