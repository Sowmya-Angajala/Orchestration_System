import axios from "axios";

const API = axios.create({
  baseURL: "https://orchestration-system.onrender.com/api",
});

export default API;