import { createContext, useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "./components/Layout/Layout";
<<<<<<< HEAD
import axios from "./axiosConfig";
=======
import axios from "./Api/axiosConfig";
>>>>>>> 56ff55ab4453c3ba2de8a4ad51ad40bdba011632

export const AppState = createContext();

function App() {
  const [user, setUser] = useState(null);
  
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  
  async function checkUser() {
    if (!token) {
      navigate("/signin");
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
      navigate("/signin");
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
