import React, { useEffect, useState } from "react";
import "../styles/Messages.css";

const Messages = ({ roomName, user }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const websocketProtocol =
      window.location.protocol === "https:" ? "wss" : "ws";
    const wsEndpoint = `${websocketProtocol}://${window.location.host}/ws/notification/${roomName}/`;
    const socket = new WebSocket(wsEndpoint);

    socket.onopen = () => console.log("WebSocket connection opened!");
    socket.onclose = () => console.log("WebSocket connection closed!");

    socket.addEventListener("message", (event) => {
      const messageData = JSON.parse(event.data).message;
      setMessages((prevMessages) => [...prevMessages, messageData]);
      if (messageData.sender === user) {
        setMessage("");
      }
      scrollToBottom();
    });

    return () => socket.close();
  }, [roomName, user]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    let token = localStorage.getItem("access");
    if (!token) {
      alert("You must be logged in to enter a room.");
      return;
    }

    let form = event.target;
    let roomName = form.room.value;
    let username = form.username.value;

    try {
      const response = await chatnestApi.get(
        `/auth/group/${roomName}/${username}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        navigate(`/enter-room/${roomName}`, {
          state: { messages: response.data.messages },
        });
        console.log("Coorect");
      } else {
        throw new Error("Something went wrong.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to enter the room. Please try again.");
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
              {/* Received messages */}
              {messages.map((msg, index) =>
                msg.sender !== user ? (
                  <div className="msg-receive" key={index}>
                    <p style={{ color: "#000" }}>
                      {msg.message} <strong>-{msg.sender}</strong>
                    </p>
                  </div>
                ) : (
                  <div className="msg-send" key={index}>
                    <p style={{ color: "#000" }}>{msg.message}</p>
                  </div>
                )
              )}
              {/* End of received messages */}
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
