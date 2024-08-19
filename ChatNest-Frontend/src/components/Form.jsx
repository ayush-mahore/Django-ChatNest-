import { useState } from "react";
import { useNavigate } from "react-router-dom";
import chatnestApi from "../chatnest_api";
import { ACCESS_TOKEN, REFRESH_TOKEN, UserName } from "../constants";
import "../styles/Form.css";
import LoadingIndicator from "./LoadingIndicator";

function Form({ route, method }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const name = method === "login" ? "Login" : "Register";

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);

    try {
      const res = await chatnestApi.post(route, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (method === "login") {
        localStorage.setItem(ACCESS_TOKEN, res?.data?.access);
        localStorage.setItem(REFRESH_TOKEN, res?.data?.refresh);
        localStorage.setItem(UserName, username);
        navigate("/enter-room");
      } else {
        navigate("/login");
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert("User does not exist or incorrect credentials.");
      } else {
        alert("An unexpected error occurred. Please try again.");
        console.error("Form submit error:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="form-container">
        <h1>{name}</h1>
        <input
          type="text"
          className="form-input"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
        />
        <input
          type="password"
          className="form-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        {loading && <LoadingIndicator />}
        <button className="form-button" type="submit" disabled={loading}>
          {name}
        </button>
      </form>
      {name === "Login" && (
        <div className="register-container">
          <h4>New User?</h4>
          <button
            className="register-button"
            onClick={() => navigate("/register")}
          >
            Register Now
          </button>
        </div>
      )}
    </div>
  );
}

export default Form;
