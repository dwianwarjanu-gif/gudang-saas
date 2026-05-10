import axios from "axios";

const api = axios.create({
  baseURL: "http://202.10.44.9:3000/api",
});

export default api;
