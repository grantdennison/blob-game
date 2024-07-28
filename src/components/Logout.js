// src/components/Logout.js
import React from "react";
import { Button } from "@chakra-ui/react";
import { removeCookie } from "./CookieService";

const Logout = ({ setUser }) => {
  const handleLogout = () => {
    removeCookie("blob", { path: "/" });
    setUser(null);
  };

  return (
    <Button colorScheme="red" onClick={handleLogout}>
      Logout
    </Button>
  );
};

export default Logout;
