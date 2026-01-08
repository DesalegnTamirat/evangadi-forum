import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
<<<<<<< HEAD
import Landing from "../../Pages/Landing/Landing.jsx";
import SharedLayout from "./SharedLayout.jsx";
import Home from "../../Pages/Home/Home.jsx";
import HowItWorks from "../../Pages/HowItWorks/HowItWorks.jsx";
import NotFound from "../../Pages/NotFound/NotFound.jsx";
import ProtectedRoute from "../ProtectedRoute/ProtectedRoute.jsx";
import Askquestion from "../../Pages/Askquestion/Askquestion.jsx";
=======
import Landing from "../../Pages/Landing/Landing";
import SharedLayout from "./SharedLayout";
import Home from "../../Pages/Home/Home";
import HowItWorks from "../../Pages/HowItWorks/HowItWorks";
import NotFound from "../../Pages/NotFound/NotFound";
import ProtectedRoute from "../ProtectedRoute/ProtectedRoute";
import Askquestion from "../../Pages/Askquestion/Askquestion.jsx";
import Answer from "../../Pages/Answer/Answer.jsx";
>>>>>>> 56ff55ab4453c3ba2de8a4ad51ad40bdba011632

function Layout() {
  return (
    <Routes>
      <Route path="/" element={<SharedLayout />}>
        {/* Root route. redirect to home if logged in */}
        <Route
          index
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        {/* Protected route for Home */}
        <Route
          path="home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
<<<<<<< HEAD

=======
>>>>>>> 56ff55ab4453c3ba2de8a4ad51ad40bdba011632
        {/* protected route for ask question page */}
        <Route
          path="ask"
          element={
            <ProtectedRoute>
              <Askquestion />
            </ProtectedRoute>
          }
        />
<<<<<<< HEAD

=======
        {/* protected route for answer page */}
        <Route
          path="answer/:question_id"
          element={
            <ProtectedRoute>
              <Answer />
            </ProtectedRoute>
          }
        />
>>>>>>> 56ff55ab4453c3ba2de8a4ad51ad40bdba011632
        {/* Landing page for signin/signup */}
        <Route path=":mode" element={<Landing />} />

        {/* Public page */}
        <Route path="howitworks" element={<HowItWorks />} />
        {/* catch-all redirect for any unknown route */}
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Route>
      <Route path="/404" element={<NotFound />} />
    </Routes>
  );
}

<<<<<<< HEAD
export default Layout;
=======
export default Layout;
>>>>>>> 56ff55ab4453c3ba2de8a4ad51ad40bdba011632
