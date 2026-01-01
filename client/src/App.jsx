<<<<<<< HEAD
import { createContext, useState } from "react";
import Layout from "./components/Layout/Layout";

export const AppState = createContext();

function App() {
  const [user, setUser] = useState(null);

  return (
    <AppState.Provider value={{ user, setUser }}>
      <Layout />
    </AppState.Provider>
  );
}

export default App;
=======
import { useState } from 'react'
import Layout from './components/Layout/Layout'

function App() {

  return (
    <>
    <Layout/>
    </>
  )
}

export default App
>>>>>>> main
