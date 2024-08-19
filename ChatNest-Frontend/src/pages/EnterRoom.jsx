import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import chatnestApi from "../chatnest_api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import "../styles/EnterRoom.css";
import { jwtDecode } from "jwt-decode";

const EnterRoom = () => {
  const navigate = useNavigate();

  useEffect(() => {
    let token = localStorage.getItem("access");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const getCsrfToken = () => {
    return document.cookie
      .split("; ")
      .find((row) => row.startsWith("csrftoken="))
      ?.split("=")[1];
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const token = localStorage.getItem("access");
    if (!token) {
      alert("You must be logged in to enter a room.");
      return;
    }

    const form = event.target;
    const formData = new FormData(form);
    formData.append("csrfmiddlewaretoken", getCsrfToken());

    const roomName = formData.get("room");
    const username = localStorage.getItem("username");

    try {
      const response = await chatnestApi.get(
        `/group/${roomName}/${username}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        navigate(`/enter-room/${roomName}`);
      } else {
        throw new Error("Something went wrong.");
      }
    } catch (error) {
      alert("Failed to enter the room. Please try again.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);
    navigate("/login");
  };

  return (
    <div className="parent">
      <div className="child">
        <h1>Enter Room</h1>
        <form
          id="enterRoomForm"
          action="/group/"
          method="POST"
          onSubmit={handleSubmit}
        >
          <label htmlFor="room">Room name</label>
          <br />
          <input type="text" placeholder="Room name" name="room" required />
          <br />
          <center>
            <button type="submit">Submit</button>
          </center>
          <br />
        </form>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default EnterRoom;
