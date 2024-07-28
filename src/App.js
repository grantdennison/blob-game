import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "./theme";
import StartPage from "./routes/StartPage";
import Navbar from "./components/Navbar";
import LoadingPage from "./routes/LoadingPage";
import GamePage from "./routes/GamePage";
import GameOverPage from "./routes/GameOverPage";
import { getCookie } from "./components/CookieService";

function App() {
  const [user, setUser] = useState(null);
  const [roomId, setRoomId] = useState(null);

  useEffect(() => {
    const userCookie = getCookie("blob");
    if (userCookie) {
      setUser(userCookie);
    }
  }, []);

  return (
    <ChakraProvider theme={theme}>
      <Router>
        <Navbar user={user} />
        <Routes>
          <Route
            path="/"
            element={
              <StartPage setUser={setUser} user={user} setRoomId={setRoomId} />
            }
          />
          <Route
            path="/loading"
            element={<LoadingPage user={user} roomId={roomId} />}
          />
          <Route
            path="/game"
            element={<GamePage user={user} roomId={roomId} />}
          />
          <Route path="/gameover" element={<GameOverPage />} />
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;
