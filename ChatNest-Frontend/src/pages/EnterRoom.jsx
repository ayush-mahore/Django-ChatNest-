import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/EnterRoom.css";

const EnterRoom = () => {
  const navigate = useNavigate();

  useEffect(() => {
    let token = localStorage.getItem("access");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const handleSubmit = (event) => {
    event.preventDefault();
    let token = localStorage.getItem("access");
    if (!token) {
      alert("You must be logged in to enter a room.");
      return;
    }

    let form = event.target;
    let formData = new FormData(form);
    let headers = new Headers({
      Authorization: `Bearer ${token}`,
      "X-CSRFToken": formData.get("csrfmiddlewaretoken"),
    });

    fetch(form.action, {
      method: "POST",
      headers: headers,
      body: formData,
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Something went wrong.");
        }
      })
      .then((data) => {
        // Handle success (e.g., redirect to chat room)
        navigate(`/chat/${formData.get("room")}/${formData.get("username")}`);
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Failed to enter the room. Please try again.");
      });
  };

  return (
    <div className="parent">
      <div className="child">
        <h1>Enter Room</h1>
        <form
          id="enterRoomForm"
          action=""
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
      </div>
    </div>
  );
};

export default EnterRoom;
