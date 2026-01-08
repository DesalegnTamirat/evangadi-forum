<<<<<<< HEAD
import React from "react";
import { Outlet } from "react-router-dom";

function SharedLayout() {
  return (
    <div>
      <header>
        <div className="container">
          <h1>Evangadi Forum</h1>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default SharedLayout;
=======
import { Outlet } from "react-router-dom";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import ChatWidget from "../ChatWidget/ChatWidget";

function SharedLayout() {
  
  return (
    <>
      <Header />
      <ChatWidget />
      <Outlet />
      <Footer />
    </>
  );
}

export default SharedLayout;
>>>>>>> 56ff55ab4453c3ba2de8a4ad51ad40bdba011632
