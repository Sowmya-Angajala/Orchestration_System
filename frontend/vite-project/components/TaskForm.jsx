import { useState } from "react";
import API from "../api/api";

export default function TaskForm({ projectId, setTasks, tasks,members }) {
  const [task, setTask] = useState({
    title: "",
    priority: 1,
    estimatedHours: 1,
    resourceTag: "",
    dependencies: [],
  });

  const handleChange = (key, value) => {
    setTask({ ...task, [key]: value });
  };

  const createTask = async () => {
    try {
      const res = await API.post("/tasks", {
        ...task,
        projectId,
      });
      setTasks((prev) => [...prev, res.data]);
    } catch (err) {
      alert(err.response?.data?.msg || "Error");
    }
  };

  return (
    <div className="form-card">
      <h3>Create Task</h3>

      {/* Title */}
      <div className="form-row">
        <label>Title</label>
        <input
          value={task.title}
          onChange={(e) => handleChange("title", e.target.value)}
        />
      </div>

      {/* Priority */}
      <div className="form-row">
        <label>Priority (1-5)</label>
        <input
          type="number"
          value={task.priority}
          onChange={(e) =>
            handleChange("priority", Number(e.target.value))
          }
        />
      </div>

      {/* Hours */}
      <div className="form-row">
        <label>Estimated Hours</label>
        <input
          type="number"
          value={task.estimatedHours}
          onChange={(e) =>
            handleChange("estimatedHours", Number(e.target.value))
          }
        />
      </div>

      {/* Resource */}
{/* Assigned User */}
<div className="form-row">
  <label>Assign To</label>
  <select
    value={task.assignedTo || ""}
    onChange={(e) =>
      setTask({ ...task, assignedTo: e.target.value })
    }
  >
    <option value="">Select User</option>
    {members?.map((m) => (
      <option key={m._id} value={m._id}>
        {m.name} ({m.email})
      </option>
    ))}
  </select>
</div>

      {/* Dependencies */}
      <div className="form-row">
        <label>Dependencies</label>
        <select
          multiple
          onChange={(e) =>
            handleChange(
              "dependencies",
              Array.from(e.target.selectedOptions, (opt) => opt.value)
            )
          }
        >
          {tasks.map((t) => (
            <option key={t._id} value={t._id}>
              {t.title}
            </option>
          ))}
        </select>
      </div>

      <button className="primary-btn" onClick={createTask}>
        Create Task
      </button>
    </div>
  );
}