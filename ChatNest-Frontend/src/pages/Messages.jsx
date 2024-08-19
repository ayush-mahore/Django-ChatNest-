import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import chatnestApi from "../chatnest_api";
import "../styles/Messages.css";

const Messages = () => {
  const { roomName } = useParams(); // Corrected here
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const API_Location = import.meta.env.VITE_APP_URL;
  const user = localStorage.getItem("username");

  useEffect(() => {
    let socket;

    try {
      const websocketProtocol =
        window.location.protocol === "https:" ? "wss" : "ws";
      const wsEndpoint = `${websocketProtocol}://${API_Location.replace(
        /^http/,
        "ws"
      )}/ws/notification/${roomName}/`;
      socket = new WebSocket(wsEndpoint);

      socket.onopen = () => console.log("WebSocket connection opened!");
      socket.onclose = () => console.log("WebSocket connection closed!");

      socket.addEventListener("message", (event) => {
        const messageData = JSON.parse(event.data).message;
        if (messageData) {
          setMessages((prevMessages) => [...prevMessages, messageData]);
          if (messageData.sender === user) {
            setMessage("");
          }
          scrollToBottom();
        }
      });

      socket.onerror = (error) => {
        console.error("WebSocket Error: ", error);
      };
    } catch (error) {
      console.error("WebSocket setup error: ", error);
    }

    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [roomName, user]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem("access");

    if (!token) {
      alert("You must be logged in to send messages.");
      return;
    }

    try {
      await chatnestApi.post(
        `/messages/`,
        { roomName, message },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setMessage("");
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to send the message. Please try again.");
    }
  };

  const scrollToBottom = () => {
    const chatContainer = document.getElementById("chatContainer");
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  };

  return (
    <div className="msg-parent">
      <div className="msg-child-2">
        <center>
          <h2>Chats</h2>
        </center>
        <hr />
        <div className="msg-chat-body-parent">
          <div className="msg-chat-body">
            <div className="msg-message" id="chatContainer">
              {messages.map((msg, index) => (
                <div
                  className={`msg-${msg.sender === user ? "send" : "receive"}`}
                  key={index}
                >
                  <p style={{ color: "#000" }}>
                    {msg.message}
                    {msg.sender !== user && <strong>-{msg.sender}</strong>}
                  </p>
                </div>
              ))}
            </div>

            <div className="msg-form">
              <form id="message-form" onSubmit={handleSubmit}>
                <textarea
                  id="msg"
                  cols="30"
                  name="message"
                  rows="10"
                  placeholder="Enter your message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                ></textarea>
                <button className="msg-submit" type="submit">
                  Send
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;