import React, { useContext } from "react";
import { Outlet } from "react-router-dom";
import Header from "../../components/Header/Header";
import ChatWidget from "../ChatWidget/ChatWidget";
import Sidebar from "../Sidebar/Sidebar";
import { AppState } from "../../App";

function SharedLayout() {
  const { user } = useContext(AppState);
  
  return (
    <div className={`app-layout ${!user ? 'guest-layout' : ''}`}>
      {user && <Sidebar />}
      <div className="main-content-wrapper">
        <Header />
        <ChatWidget />
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default SharedLayout;