import { useEffect, useState } from "react";
import API from "../api/api";
import { useParams, useNavigate } from "react-router-dom";
import TaskList from "../components/TaskList";
import TaskForm from "../components/TaskForm";
import ExecutionPanel from "../components/ExecutionPanel";

export default function Project() {
  const { id } = useParams();
  const nav = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);
  const [project, setProject] = useState(null);

  const [activeTab, setActiveTab] = useState("tasks");
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  setLoading(true);

  Promise.all([
    API.get(`/tasks/${id}`),
    API.get(`/projects/${id}/members`),
    API.get(`/projects`)
  ])
    .then(([tasksRes, membersRes, projectsRes]) => {
      setTasks(tasksRes.data);
      setMembers(membersRes.data);

      const found = projectsRes.data.find(p => p._id === id);
      setProject(found);
    })
    .finally(() => setLoading(false));

}, [id]);

if (loading) {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h3>Loading tasks...</h3>
    </div>
  );
}

  return (
    <div style={{ width: "80%", margin: "auto" }}>

      {/* 🔥 BREADCRUMB */}
      <div className="breadcrumb">
        <span style={{ cursor: "pointer" }} onClick={() => nav("/dashboard")}>
          Projects
        </span>

        {" > "}

        <span style={{ fontWeight: "600" }}>
          {project?.name || "Project"}
        </span>

      </div>

      {/* 🔥 HEADER */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <h2>{project?.name}</h2>

        {activeTab === "tasks" && (
          <button onClick={() => setShowForm(!showForm)}>
            {showForm ? "Close" : "Create Task"}
          </button>
        )}
      </div>

      {/* 🔥 TABS */}
      <div style={{
        display: "flex",
        gap: "20px",
        margin: "20px 0",
        paddingBottom: "10px",
        alignItems:'center'
      }}>
        <span
          style={{ cursor: "pointer", color: activeTab === "tasks" ? "#a78bfa" : "",fontWeight: activeTab === "tasks" ? "bold" : "" }}
          onClick={() => setActiveTab("tasks")}
        >
          Tasks Created
        </span>

        <div className="dot"></div>

        <span
          style={{ cursor: "pointer", color:  activeTab === "execution" ? "#a78bfa" : ""  , fontWeight: activeTab === "execution" ? "bold" : "" }}
          onClick={() => setActiveTab("execution")}
        >
          Execution
        </span>

                <div className="dot"></div>


        <span
          style={{ cursor: "pointer",color: activeTab === "simulation" ? "#a78bfa" : "", fontWeight: activeTab === "simulation" ? "bold" : "" }}
          onClick={() => setActiveTab("simulation")}
        >
          Simulate
        </span>
      </div>

      {/* 🔥 CONTENT */}
      {activeTab === "tasks" && (
        <>
          {showForm && (
            <TaskForm
              projectId={id}
              setTasks={setTasks}
              tasks={tasks}
              members={members}
            />
          )}

          <TaskList tasks={tasks} setTasks={setTasks} />
        </>
      )}

      {activeTab === "execution" && (
        <ExecutionPanel projectId={id} type="execution" />
      )}

      {activeTab === "simulation" && (
        <ExecutionPanel projectId={id} type="simulation" />
      )}
      </div>
  );
}