import axios from 'axios';

const axiosBase = axios.create({
    baseURL: "http://localhost:5502/api"
});

export default axiosBase;