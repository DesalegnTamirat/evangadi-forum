import { Outlet } from "react-router-dom";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import ChatWidget from "../ChatWidget/ChatWidget";

function SharedLayout() {
  
  return (
    <>
      <Header />
      <ChatWidget />
      <main style={{ paddingTop: "100px", minHeight: "80vh" }}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default SharedLayout;
