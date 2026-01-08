import React from "react";
import { useParams } from "react-router-dom";

function Landing() {
  const { mode } = useParams();
  
  return (
    <div>
      <h2>{mode === "signin" ? "Sign In" : "Sign Up"}</h2>
      <p>Welcome to Evangadi Forum</p>
      <p>Mode: {mode}</p>
    </div>
  );
}

export default Landing;