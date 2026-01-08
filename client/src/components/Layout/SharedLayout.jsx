import React from "react";
import { Outlet } from "react-router-dom";

function SharedLayout() {
  return (
    <div>
      <header>
        <h1>Evangadi Forum</h1>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default SharedLayout;