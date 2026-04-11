import { useEffect, useState } from "react";
import API from "../api/api";

export default function ExecutionPanel({ projectId, type }) {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        let res;

        if (type === "execution") {
          res = await API.post(`/execution/${projectId}/compute-execution`);
        } else {
          res = await API.post(`/execution/${projectId}/simulate`, {
            availableHours: 8
          });
        }

        setResult(res.data);
      } catch (err) {
        console.error(err);
      }

      setLoading(false);
    };

    fetchData();
  }, [projectId, type]); // 🔥 runs when tab changes

  return (
    <div className="execution-container">

      {loading && <p>Loading...</p>}

      {result && (
        <>
          {/* Execution Order */}
          {result.executionOrder && (
            <div>
              <h3>Execution Order</h3>
              {result.executionOrder.map(t => (
                <div className="task-card" key={t._id}>
                  <h4>{t.title}</h4>
                  <p>Status: {t.status}</p>
                </div>
              ))}
            </div>
          )}

          {/* Selected Tasks */}
          {result.selectedTasks && (
            <div>
              <h3>Selected Tasks</h3>
              {result.selectedTasks.map(t => (
                <div className="task-card" key={t._id}>
                  <h4>{t.title}</h4>
                </div>
              ))}
            </div>
          )}

          {/* Blocked Tasks */}
          {result.blockedTasks && (
            <div>
              <h3>Blocked Tasks</h3>
              {result.blockedTasks.map(t => (
                <div className="task-card" key={t._id}>
                  <h4>{t.title}</h4>
                </div>
              ))}
            </div>
          )}

          {/* Skipped Tasks */}
          {result.skippedTasks && (
            <div>
              <h3>Skipped Tasks</h3>
              {result.skippedTasks.map(t => (
                <div className="task-card" key={t._id}>
                  <h4>{t.title}</h4>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}