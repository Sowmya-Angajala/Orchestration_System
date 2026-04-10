import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

export default function Tasks() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    socket.on("taskCreated", (task) => {
      setTasks((prev) => [...prev, task]);
    });

    socket.on("taskUpdated", (task) => {
      setTasks((prev) =>
        prev.map((t) => (t._id === task._id ? task : t))
      );
    });
  }, []);

  return (
    <div>
      {tasks.map((t) => (
        <div className="card" key={t._id}>
          {t.title} - {t.status}
        </div>
      ))}
    </div>
  );
}