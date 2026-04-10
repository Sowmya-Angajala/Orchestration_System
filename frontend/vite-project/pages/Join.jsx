import { useParams, useNavigate } from "react-router-dom";
import API from "../api/api";

export default function Join() {
  const { token } = useParams();
  const nav = useNavigate();

  const joinProject = async () => {
    try {
      const res = await API.post(`/projects/join/${token}`);
      alert("Joined!");
      nav(`/project/${res.data.projectId}`);
    } catch (err) {
      alert(err.response?.data?.msg || "Error joining");
    }
  };

  return (
    <div>
      <h2>Join Project</h2>
      <button onClick={joinProject}>Join</button>
    </div>
  );
}