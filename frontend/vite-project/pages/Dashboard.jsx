import { useEffect, useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState("");
const [inviteLink, setInviteLink] = useState("");
const [showModal, setShowModal] = useState(false);  const nav = useNavigate();

  useEffect(() => {
    API.get("/projects").then(res => setProjects(res.data));
  }, []);

  const createProject = async () => {
    const res = await API.post("/projects", { name });
    setProjects([...projects, res.data]);
  };
const generateInvite = async (projectId) => {
  const res = await API.post(`/projects/invite/${projectId}`);
  setInviteLink(res.data.inviteLink);
  setShowModal(true);
};

const copyToClipboard = () => {
  navigator.clipboard.writeText(inviteLink);
  alert("Copied to clipboard!");
};

  return (
    <div style={{ width: "80%", margin: "auto" }}>
  <h2>Projects</h2>

  <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
    <input
      placeholder="Enter project name"
      onChange={e => setName(e.target.value)}
    />
    <button onClick={createProject}>Create Project</button>
  </div>

 {showModal && (
  <div
    onClick={() => setShowModal(false)} // click outside closes
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0,0,0,0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000
    }}
  >
    <div
      onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
      style={{
        background: "white",
        padding: "20px",
        borderRadius: "10px",
        width: "400px",
        position: "relative"
      }}
    >
      {/* ❌ Close Button */}
      <button
        onClick={() => setShowModal(false)}
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          border: "none",
          background: "transparent",
          fontSize: "18px",
          cursor: "pointer",
          color: "red"
        }}
      >
        x
      </button>

      <h3 style={{color:'black'}} >Invite Link</h3>

      <div style={{ display: "flex", gap: "10px" }}>
        <input
          value={inviteLink}
          readOnly
          style={{ width: "70%" }}
        />
        <button onClick={copyToClipboard}>Copy</button>
      </div>
    </div>
  </div>
)}

  {projects.map(p => (
    <div className="card" key={p._id} style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }}>
      <span
        style={{ cursor: "pointer" }}
        onClick={() => nav(`/project/${p._id}`)}
      >
        {p.name}
      </span>

      <button onClick={() => generateInvite(p._id)}>Invite</button>
    </div>
  ))}
</div>
  );
}