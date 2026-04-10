import { useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [data, setData] = useState({});
  const nav = useNavigate();

  const handleSignup = async () => {
    try {
      await API.post("/auth/signup", data);
      alert("Signup successful!");
      nav("/login");
    } catch {
      alert("Signup failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create Account</h2>

        <input
          placeholder="Name"
          onChange={(e) =>
            setData({ ...data, name: e.target.value })
          }
        />

        <input
          placeholder="Email"
          onChange={(e) =>
            setData({ ...data, email: e.target.value })
          }
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) =>
            setData({ ...data, password: e.target.value })
          }
        />

        <button onClick={handleSignup}>Signup</button>

        <p onClick={() => nav("/login")} className="link">
          Already have an account? Login
        </p>
      </div>
    </div>
  );
}