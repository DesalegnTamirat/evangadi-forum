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