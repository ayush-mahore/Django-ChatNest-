import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../styles/Messages.css";

const Messages = () => {
  const { roomName } = useParams();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [socket, setSocket] = useState(null);
  const [username, setUsername] = useState("");
  const API_Location = import.meta.env.VITE_APP_URL;

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const decodedToken = JSON.parse(atob(token.split(".")[1]));
        const userId = decodedToken.user_id;

        const response = await axios.get(
          `auth/user/${API_Location}/username/${userId}/`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUsername(response.data.username);
        console.log(username);
      } catch (error) {
        console.error("Error fetching username: ", error);
      }
    };

    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          `${API_Location}/group/${roomName}/messages/`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );
        setMessages(response.data.messages);
      } catch (error) {
        console.error("Error fetching messages: ", error);
      }
    };

    fetchUsername();
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
  }, [roomName, username]);

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
                    {msg.message}
                    {msg.sender !== username && <strong>-{msg.sender}</strong>}
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