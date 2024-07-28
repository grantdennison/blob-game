import { useState, useEffect } from "react";

const usePlayerMovement = (initialPosition = { x: 0, y: 0 }) => {
  const [position, setPosition] = useState(initialPosition);

  useEffect(() => {
    const handleMouseMove = (event) => {
      setPosition({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return position;
};

export default usePlayerMovement;
