import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Grid,
  Box,
  Image,
  Button,
} from "@chakra-ui/react";

const BlobSelect = ({ isOpen, onClose, onSelect }) => {
  const blobs = Array.from({ length: 10 }, (_, index) => {
    const blobNumber = index + 1;
    return Array.from(
      { length: 6 },
      (_, subIndex) => `blobs/blob${blobNumber}/${subIndex + 1}.svg`
    );
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Choose Your Blob</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Grid templateColumns="repeat(3, 1fr)" gap={6}>
            {blobs.map((blobArray, index) => (
              <Box key={index} onClick={() => onSelect(blobArray)}>
                <Image
                  src={blobArray[0]}
                  alt={`Blob ${index + 1}`}
                  boxSize="80px"
                  cursor="pointer"
                />
              </Box>
            ))}
          </Grid>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default BlobSelect;
