import { createContext, useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import axios from "./Api/axiosConfig";


export const AppState = createContext();

function App() {
  const [user, setUser] = useState(null);
  
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  
  async function checkUser() {
    if (!token) {
      // Don't redirect - allow public access to home page
      return;
    }

    try {
     const {data} = await axios.get("/user/check", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(data);
    } catch (error) {
      console.error(error.response);
      localStorage.removeItem("token");
      // Don't redirect on error - allow public access
    }
  }

  useEffect(() => {
    checkUser();
  }, []);

  return (
    <AppState.Provider value={{ user, setUser }}>
     <Layout/> 
    </AppState.Provider>
  );
}

export default App;
