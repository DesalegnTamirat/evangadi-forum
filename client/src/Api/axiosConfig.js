import axios from "axios";

const axiosBase = axios.create({
  baseURL: "http://localhost:5501/api",
  // baseURL: "https://evangadiforum.be.birhann.com/api",
  // baseURL: "https://evangadi-forum-desalegn.onrender.com/api",
});

export default axiosBase;
