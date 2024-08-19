import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import chatnestApi from "../chatnest_api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import "../styles/EnterRoom.css";

const EnterRoom = () => {
  const navigate = useNavigate();

  useEffect(() => {
    let token = localStorage.getItem("access");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    let token = localStorage.getItem("access");
    if (!token) {
      alert("You must be logged in to enter a room.");
      return;
    }

    let form = event.target;
    let formData = new FormData(form);

    try {
      const response = await chatnestApi.post(form.action, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "X-CSRFToken": formData.get("csrfmiddlewaretoken"),
        },
      });

      if (response.status === 200) {
        navigate(`/chat/${formData.get("room")}/${formData.get("username")}`);
      } else {
        throw new Error("Something went wrong.");
      }
    } catch (error) {
      console.error("Error:", error);
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
          action="/auth/group/"
          method="POST"
          onSubmit={handleSubmit}
        >
          <input
            type="hidden"
            name="csrfmiddlewaretoken"
            value="{{ csrf_token }}"
          />
          <label htmlFor="username">Username</label>
          <br />
          <input type="text" placeholder="Username" name="username" required />
          <br />
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