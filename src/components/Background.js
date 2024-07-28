import React from "react";
import { Box } from "@chakra-ui/react";

const generateRandomBlobs = (count) => {
  const blobs = [];
  for (let i = 0; i < count; i++) {
    const size = Math.random() * 50 + 50; // Random size between 50px and 150px
    const color = `hsl(${Math.random() * 360}, 100%, 75%)`; // Random pastel color
    const top = Math.random() * 100; // Random top position between 0% and 100%
    const left = Math.random() * 100; // Random left position between 0% and 100%
    const duration = Math.random() * 20 + 10; // Random animation duration between 10s and 30s
    const direction = Math.random() > 0.5 ? "normal" : "reverse"; // Random direction
    blobs.push({ size, color, top, left, duration, direction });
  }
  return blobs;
};

const Background = React.memo(({ blobCount = 10 }) => {
  const blobs = generateRandomBlobs(blobCount);

  return (
    <Box
      position="fixed"
      top="0"
      left="0"
      width="100%"
      height="100%"
      zIndex="-1"
      overflow="hidden"
    >
      {blobs.map((blob, index) => (
        <Box
          key={index}
          position="absolute"
          width={`${blob.size}px`}
          height={`${blob.size}px`}
          backgroundColor={blob.color}
          borderRadius="50%"
          top={`${blob.top}%`}
          left={`${blob.left}%`}
          animation={`move ${blob.duration}s ease-in-out infinite ${blob.direction}`}
        />
      ))}
      <style>
        {`
          @keyframes move {
            0% {
              transform: translate(0, 0);
            }
            25% {
              transform: translate(200px, -150px) rotate(45deg);
            }
            50% {
              transform: translate(250px, 0px) rotate(90deg);
            }
            75% {
              transform: translate(200px, 150px) rotate(135deg);
            }
            100% {
              transform: translate(0, 0) rotate(180deg);
            }
          }
        `}
      </style>
    </Box>
  );
});

export default Background;
