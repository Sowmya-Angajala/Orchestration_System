import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function Home() {
  const { token } = useContext(AuthContext);
  const nav = useNavigate();

  if (token) {
    nav("/"); // already logged in → dashboard
  }

  return (
    <div className="home">
      <h1>Workflow Orchestration System</h1>
      <p>Manage tasks, dependencies, and execution intelligently</p>

      <div className="home-btns">
        <button onClick={() => nav("/login")}>Login</button>
        <button onClick={() => nav("/signup")}>Signup</button>
      </div>

      {/* Feature Cards */}
      <div className="card-grid">
        <div className="feature-card">
          <h3>Real-time Updates</h3>
          <p>Instant sync across multiple users</p>
        </div>

        <div className="feature-card">
          <h3>Dependency Execution</h3>
          <p>Smart task ordering and execution</p>
        </div>

        <div className="feature-card">
          <h3>Simulation Engine</h3>
          <p>Optimize tasks within time constraints</p>
        </div>
      </div>
    </div>
  );
}