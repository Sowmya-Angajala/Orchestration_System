import { useState } from "react";
import API from "../api/api";

export default function ExecutionPanel({ projectId }) {
  const [result, setResult] = useState(null);

  const runExecution = async () => {
    const res = await API.post(`/execution/${projectId}/compute-execution`);
    setResult(res.data);
  };

  const simulate = async () => {
    const res = await API.post(`/execution/${projectId}/simulate`, {
      availableHours: 8,
    });
    setResult(res.data);
  };

  // 🔥 reusable card
  const renderTasks = (tasks = []) => {
    if (!tasks.length) return <p>No tasks</p>;

    return tasks.map((t) => (
      <div className="task-card" key={t._id}>
        <h4>{t.title}</h4>
        <p>Status: {t.status}</p>
        <p>Priority: {t.priority}</p>
        <p>Hours: {t.estimatedHours}</p>
      </div>
    ));
  };

  return (
    <div>
      <div className="btn-row">
        <button onClick={runExecution}>Run Execution</button>
        <button onClick={simulate}>Simulate</button>
      </div>

      {result && (
        <div className="execution-container">

          {/* 🔥 EXECUTION ORDER */}
          {result.executionOrder && (
            <div className="card">
              <h3>Execution Order</h3>
              {renderTasks(result.executionOrder)}
            </div>
          )}

          {/* 🔥 SELECTED TASKS (Simulation) */}
          {result.selectedTasks && (
            <div className="card">
              <h3>Selected Tasks</h3>
              {renderTasks(result.selectedTasks)}
            </div>
          )}

          {/* 🔥 BLOCKED TASKS */}
          {result.blockedTasks && (
            <div className="card">
              <h3>Blocked Tasks</h3>
              {renderTasks(result.blockedTasks)}
            </div>
          )}

          {/* 🔥 SKIPPED TASKS */}
          {result.skippedTasks && (
            <div className="card">
              <h3>Skipped Tasks</h3>
              {renderTasks(result.skippedTasks)}
            </div>
          )}

          {/* 🔥 SCORE */}
          {result.totalPriorityScore !== undefined && (
            <div className="card">
              <h3>Total Priority Score</h3>
              <p>{result.totalPriorityScore}</p>
            </div>
          )}

        </div>
      )}
    </div>
  );
}