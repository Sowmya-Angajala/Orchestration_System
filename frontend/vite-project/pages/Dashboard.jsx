import { useEffect, useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState("");
  const nav = useNavigate();

  useEffect(() => {
    API.get("/projects").then(res => setProjects(res.data));
  }, []);

  const createProject = async () => {
    const res = await API.post("/projects", { name });
    setProjects([...projects, res.data]);
  };

  const generateInvite = async (projectId) => {
  const res = await API.post(`/projects/invite/${projectId}`);
  alert("Invite Link:\n" + res.data.inviteLink);
};

  return (
    <div>
      <h2>Projects</h2>

      <input placeholder="Project name" onChange={e => setName(e.target.value)} />
      <button onClick={createProject}>Create</button>
    
      {projects.map(p => (
      <>  <div className="card" key={p._id} onClick={() => nav(`/project/${p._id}`)}>
          {p.name}
        </div>
          <button onClick={() => generateInvite(p._id)}>
  Invite
</button>
</>

      ))}
    </div>
  );
}