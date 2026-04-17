import React, { useEffect } from "react";
import { io } from "socket.io-client";

// connect to backend
const socket = io("http://localhost:5000");

function App() {
  const userId = 1; // change later (dynamic login)

  useEffect(() => {
    // register user
    socket.emit("register", userId);

    // listen for messages
    socket.on("receive_message", (data) => {
      console.log("New message:", data);
    });

    // cleanup (important)
    return () => {
      socket.off("receive_message");
    };
  }, []);

  return (
    <div>
      <h1>Chat App Running 🚀</h1>
    </div>
  );
}

export default App;