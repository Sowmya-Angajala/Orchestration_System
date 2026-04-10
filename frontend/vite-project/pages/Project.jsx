import { useEffect, useState } from "react";
import API from "../api/api";
import { useParams } from "react-router-dom";
import TaskList from "../components/TaskList";
import TaskForm from "../components/TaskForm";
import ExecutionPanel from "../components/ExecutionPanel";

export default function Project() {
  const { id } = useParams();
  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);


  useEffect(() => {
    API.get(`/tasks/${id}`).then(res => setTasks(res.data));
  }, [id]);



useEffect(() => {
  API.get(`/projects/${id}/members`).then(res => setMembers(res.data));
}, [id]);

  console.log(tasks,"taskkkkkkk");
  

  return (
    <div>
      <h2>Project</h2>

      <TaskForm projectId={id} setTasks={setTasks} tasks = {tasks}   members={members}
 />
      <TaskList tasks={tasks} setTasks={setTasks} />

      <ExecutionPanel projectId={id} />
    </div>
  );
}