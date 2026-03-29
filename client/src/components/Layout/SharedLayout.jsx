import { Outlet } from "react-router-dom";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import ChatWidget from "../ChatWidget/ChatWidget";
import Sidebar from "../Sidebar/Sidebar";

function SharedLayout() {
  
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content-wrapper">
        <Header />
        <ChatWidget />
        <main className="main-content">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default SharedLayout;