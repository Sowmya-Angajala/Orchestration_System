import { useEffect, useState } from "react";
import API from "../api";

export default function Dashboard() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    API.get("/projects").then((res) => setProjects(res.data));
  }, []);

  return (
    <div>
      <h2>Projects</h2>
      {projects.map((p) => (
        <div className="card" key={p._id}>
          {p.name}
        </div>
      ))}
    </div>
  );
}