import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ACCESS_TOKEN, UserName } from "../constants";
import axios from "axios";
import "../styles/Messages.css";

const Messages = () => {
  const { roomName } = useParams();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [socket, setSocket] = useState(null);
  const username = localStorage.getItem(UserName);
  const API_Location = import.meta.env.VITE_APP_URL;

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          `${API_Location}/group/${roomName}/${username}/`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`,
            },
          }
        );
        console.log(response);
        setMessages(response.data.messages);
      } catch (error) {
        console.error("Error fetching messages: ", error);
      }
    };

    fetchMessages();

    const websocketProtocol =
      window.location.protocol === "https:" ? "wss" : "ws";
    const wsEndpoint = `${websocketProtocol}://${
      API_Location.split("://")[1]
    }/ws/notification/${roomName}/`;

    const newSocket = new WebSocket(wsEndpoint);

    newSocket.onopen = () => console.log("WebSocket connection opened!");
    newSocket.onclose = () => console.log("WebSocket connection closed!");

    newSocket.addEventListener("message", (event) => {
      const messageData = JSON.parse(event.data).message;
      if (messageData) {
        setMessages((prevMessages) => [...prevMessages, messageData]);
        if (messageData.sender === username) {
          setMessage("");
        }
        scrollToBottom();
      }
    });

    newSocket.onerror = (error) => console.error("WebSocket Error: ", error);

    setSocket(newSocket);

    return () => {
      if (newSocket) {
        newSocket.close();
      }
    };
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (socket && message) {
      const messageData = JSON.stringify({
        room_name: roomName,
        message: message,
        sender: username,
      });

      socket.send(messageData);
      setMessage("");
    } else {
      console.error("Socket is not connected or message is empty.");
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
                  className={`msg-${
                    msg.sender === username ? "send" : "receive"
                  }`}
                  key={index}
                >
                  <p style={{ color: "#000" }}>
                    <strong>{msg.message}</strong>
                  </p>
                  <h5 className="msg-sender-msg">{msg.sender}</h5>
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