import React from "react";
<<<<<<< HEAD
import { useParams } from "react-router-dom";

function Landing() {
  const { mode } = useParams();
  
  return (
    <div className="container">
      <div style={{ 
        maxWidth: '400px', 
        margin: '50px auto', 
        padding: '30px', 
        backgroundColor: 'white', 
        borderRadius: '8px', 
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)' 
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#2c3e50' }}>
          {mode === "signin" ? "Sign In" : "Sign Up"}
        </h2>
        <p style={{ textAlign: 'center', color: '#666', marginBottom: '30px' }}>
          Welcome to Evangadi Forum
        </p>
        
        <form style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {mode === "signup" && (
            <>
              <input type="text" placeholder="First Name" />
              <input type="text" placeholder="Last Name" />
              <input type="text" placeholder="Username" />
            </>
          )}
          <input type="email" placeholder="Email" />
          <input type="password" placeholder="Password" />
          <button type="submit" style={{ marginTop: '10px' }}>
            {mode === "signin" ? "Sign In" : "Sign Up"}
          </button>
        </form>
        
        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px' }}>
          {mode === "signin" ? (
            <>Don't have an account? <a href="/signup" style={{ color: '#007bff' }}>Sign up</a></>
          ) : (
            <>Already have an account? <a href="/signin" style={{ color: '#007bff' }}>Sign in</a></>
          )}
        </p>
      </div>
    </div>
  );
}

export default Landing;
=======
import { useParams, Navigate } from "react-router-dom";
import style from "./Landing.module.css";
import Register from "../Register/Register";
import Login from "../Login/Login";
import About from '../About/About'

function Landing() {
  const { mode } = useParams();

  if (mode !== "signin" && mode !== "signup") {
    return <Navigate to="/404" replace />;

  }

  const isSignup = mode === "signup";

  return (
    <section className={style.container}>
      <div className={style.containerContent}>
        <div className={style.sliderContainer}>
          <div
            className={style.sliderWrapper}
            style={{
              transform: isSignup ? "translateX(-50%)" : "translateX(0)",
            }}
          >
            <div className={style.formPane} aria-hidden={isSignup}>
              <Login />
              
            </div>
            <div className={style.formPane} aria-hidden={!isSignup}>
              <Register />
              
            </div>
          </div>
        </div>
        <div className={style.about}>
          <About/>
        </div>
      </div>
    </section>
  );
}

export default Landing;
>>>>>>> 56ff55ab4453c3ba2de8a4ad51ad40bdba011632
