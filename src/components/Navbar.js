import React, { useState, useEffect } from "react";
import { Flex, Box, Text, IconButton, Button, Image } from "@chakra-ui/react";
import { useColorMode } from "@chakra-ui/react";
import BlobSelect from "./BlobSelect"; // Import the BlobSelect component
const { FaMoon, FaSun } = require("react-icons/fa");

const Navbar = ({ user }) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedBlob, setSelectedBlob] = useState(["blobs/blob1/1.svg"]); // Default blob image
  const [currentBlobIndex, setCurrentBlobIndex] = useState(0);

  useEffect(() => {
    if (selectedBlob.length > 1) {
      const interval = setInterval(() => {
        setCurrentBlobIndex(
          (prevIndex) => (prevIndex + 1) % selectedBlob.length
        );
      }, 300); // Adjust the interval for smoother or slower animation
      return () => clearInterval(interval);
    }
  }, [selectedBlob]);

  const handleBlobSelect = (blobArray) => {
    setSelectedBlob(blobArray);
    setCurrentBlobIndex(0);
    setModalOpen(false);
  };

  return (
    <Flex
      as="nav"
      justifyContent="space-between"
      alignItems="center"
      pl={4}
      bg={colorMode === "light" ? "gray.200" : "gray.800"}
      color={colorMode === "light" ? "black" : "white"}
    >
      <Box className="left">
        <Text fontSize="xl" fontWeight="bold">
          Blob
        </Text>
      </Box>
      <Box className="right" display="flex" alignItems="center">
        <Button onClick={() => setModalOpen(true)} mr={4}>
          Choose Your Blob
        </Button>
        <Image
          src={selectedBlob[currentBlobIndex]}
          alt="Selected Blob"
          boxSize="40px"
          mr={4}
        />
        <Text mr={4}>{user ? user.userName : "Guest"}</Text>
        <IconButton
          aria-label="Toggle dark mode"
          icon={colorMode === "light" ? <FaMoon /> : <FaSun />}
          onClick={toggleColorMode}
          variant="ghost"
        />
      </Box>
      <BlobSelect
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSelect={handleBlobSelect}
      />
    </Flex>
  );
};

export default Navbar;
