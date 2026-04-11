import { useState, useEffect } from "react";
import API from "../api/api";
import { io } from "socket.io-client";

const socket = io("https://orchestration-system.onrender.com");

export default function TaskList({ tasks, setTasks }) {
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [historyData, setHistoryData] = useState([]);
const [showHistory, setShowHistory] = useState(false);
const [conflict, setConflict] = useState(null);

  // 🔥 Real-time updates
  useEffect(() => {
    socket.on("taskUpdated", (updated) => {
      setTasks((prev) =>
        prev.map((t) => (t._id === updated._id ? updated : t))
      );
    });

    socket.on("taskCreated", (task) => {
      setTasks((prev) => [...prev, task]);
    });

     socket.on("taskStatusChanged", (task) => {
    setTasks((prev) =>
      prev.map((t) => (t._id === task._id ? task : t))
    );
  });

  socket.on("taskRetry", (task) => {
    console.log("Retry happened", task);
  });

  return () => {
    socket.off("taskCreated");
    socket.off("taskUpdated");
    socket.off("taskStatusChanged");
    socket.off("taskRetry");
  };
  }, []);

  // 🔥 Get dependency names
  const getDepNames = (deps) => {
    return deps
      .map((id) => tasks.find((t) => t._id === id)?.title)
      .filter(Boolean)
      .join(", ");
  };

  // 🔥 Start editing
  const startEdit = (task) => {
    setEditingId(task._id);
    setEditData({ ...task }); // includes versionNumber
  };

  // 🔥 Update task (with versioning)
const updateTask = async () => {
  try {
    const res = await API.put(`/tasks/${editingId}`, editData);

    setTasks((prev) =>
      prev.map((t) => (t._id === editingId ? res.data : t))
    );

    setEditingId(null);

  } catch (err) {
    if (err.response?.status === 409) {
      setConflict({
        latest: err.response.data.latest,
        attempted: editData,
      });
    } else {
      alert("Update failed");
    }
  }
};

  const changeStatus = async (task) => {
    try {
      await API.put(`/tasks/${task._id}`, {
        ...task,
        status:
          task.status === "Pending"
            ? "Running"
            : task.status === "Running"
            ? "Completed"
            : "Pending",
        versionNumber: task.versionNumber, // 🔥 important
      });
    } catch (err) {
      alert("Status update failed");
    }
  };

  const fetchHistory = async (taskId) => {
  try {
    const res = await API.get(`/tasks/${taskId}/history`);
    setHistoryData(res.data);
    setShowHistory(true);
  } catch (err) {
    alert("Failed to fetch history");
  }
};

  return (
    <div>

      {tasks.map((t) => (
        <div className="task-card" key={t._id}>
          {editingId === t._id ? (
            <>
              <input
                value={editData.title}
                onChange={(e) =>
                  setEditData({ ...editData, title: e.target.value })
                }
              />

              <input
                type="number"
                value={editData.priority}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    priority: Number(e.target.value),
                  })
                }
              />

              <button onClick={updateTask}>Save</button>
            </>
          ) : (
            <>
              <h4>{t.title}</h4>

              <p>Status: {t.status}</p>
              <p>Priority: {t.priority}</p>
              <p>Hours: {t.estimatedHours}</p>

              {/* 🔥 VERSION DISPLAY */}
              <p><strong>Version:</strong> {t.versionNumber}</p>

              <p>
                Assigned:{" "}
                {t.assignedTo ? t.assignedTo.name : "Unassigned"}
              </p>

              <p>
                Dependencies:{" "}
                {t.dependencies?.length
                  ? getDepNames(t.dependencies)
                  : "None"}
              </p>

              {showHistory && (
  <div className="history-modal">
    <h3>Task History</h3>

    {historyData.length === 0 && <p>No history available</p>}

    {historyData.map((h) => (
      <div key={h._id} className="history-card">
        <p><strong>Version:</strong> {h.versionNumber}</p>
        <p><strong>Title:</strong> {h.data.title}</p>
        <p><strong>Status:</strong> {h.data.status}</p>
        <p><strong>Priority:</strong> {h.data.priority}</p>
        <p><strong>Updated At:</strong> {new Date(h.updatedAt).toLocaleString()}</p>
      </div>
    ))}

    {conflict && (
  <div className="conflict-box">
    <h3> Conflict Detected</h3>

    <p>Someone else updated this task.</p>

    <p><strong>Latest Version:</strong> {conflict.latest.versionNumber}</p>

    <div className="btn-row">
      {/* 🔥 REFRESH */}
      <button
        onClick={() => {
          setTasks((prev) =>
            prev.map((t) =>
              t._id === conflict.latest._id ? conflict.latest : t
            )
          );
          setConflict(null);
        }}
      >
        Refresh
      </button>

      {/* 🔥 RETRY */}
      <button
        onClick={async () => {
          try {
            const res = await API.put(
              `/tasks/${conflict.latest._id}`,
              {
                ...conflict.attempted,
                versionNumber: conflict.latest.versionNumber,
              }
            );

            setTasks((prev) =>
              prev.map((t) =>
                t._id === res.data._id ? res.data : t
              )
            );

            setConflict(null);
          } catch {
            alert("Retry failed");
          }
        }}
      >
        Retry
      </button>
    </div>
  </div>
)}

    <button onClick={() => setShowHistory(false)}>Close</button>
  </div>
)}

              <div className="btn-row">
                <button onClick={() => startEdit(t)}>Edit</button>

                <button onClick={() => changeStatus(t)}>
                  Change Status
                </button>
  <button onClick={() => fetchHistory(t._id)}>History</button>

              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}