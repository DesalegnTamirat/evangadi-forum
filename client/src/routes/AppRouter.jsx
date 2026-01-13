import { Route, Routes, Navigate } from "react-router-dom";
import SharedLayout from "../components/Layout/SharedLayout";
import ProtectedRoute from "../components/ProtectedRoute/ProtectedRoute";
import Home from "../Pages/Home/Home";
import Askquestion from "../Pages/Askquestion/Askquestion";
import Answer from "../Pages/Answer/Answer";
import EditAnswer from "../Pages/Answer/EditAnswer";
import EditQuestion from "../Pages/EditQuestion/EditQuestion";
import Profile from "../Pages/Profile/Profile";
import Landing from "../Pages/Landing/Landing";
import HowItWorks from "../Pages/HowItWorks/HowItWorks";
import ForgotPassword from "../Pages/ForgotPassword/ForgotPassword";
import ResetPassword from "../Pages/ResetPassword/ResetPassword";
import NotFound from "../Pages/NotFound/NotFound";

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<SharedLayout />}>
        {/* Root route: Home */}
        <Route
          index
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        {/* Protected routes */}
        <Route
          path="askquestion"
          element={
            <ProtectedRoute>
              <Askquestion />
            </ProtectedRoute>
          }
        />
        <Route
          path="answer/:question_id"
          element={
            <ProtectedRoute>
              <Answer />
            </ProtectedRoute>
          }
        />
        <Route
          path="edit-answer/:answerid"
          element={
            <ProtectedRoute>
              <EditAnswer />
            </ProtectedRoute>
          }
        />
        <Route
          path="edit-question/:questionid"
          element={
            <ProtectedRoute>
              <EditQuestion />
            </ProtectedRoute>
          }
        />
        <Route
          path="profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Public / Auth routes */}
        <Route path=":mode" element={<Landing />} />
        <Route path="howitworks" element={<HowItWorks />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="reset-password/:token" element={<ResetPassword />} />

        {/* 404 page */}
        <Route path="404" element={<NotFound />} />

        {/* catch-all redirect to 404 */}
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Route>
    </Routes>
  );
}

export default AppRouter;
