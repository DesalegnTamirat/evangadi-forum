import { lazy, Suspense } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import SharedLayout from "../components/Layout/SharedLayout";
import ProtectedRoute from "../components/ProtectedRoute/ProtectedRoute";

// Lazy-loaded pages
const Home = lazy(() => import("../Pages/Home/Home"));
const Askquestion = lazy(() => import("../Pages/Askquestion/Askquestion"));
const Answer = lazy(() => import("../Pages/Answer/Answer"));
const EditAnswer = lazy(() => import("../Pages/Answer/EditAnswer"));
const EditQuestion = lazy(() => import("../Pages/EditQuestion/EditQuestion"));
const Profile = lazy(() => import("../Pages/Profile/Profile"));
const Landing = lazy(() => import("../Pages/Landing/Landing"));
const HowItWorks = lazy(() => import("../Pages/HowItWorks/HowItWorks"));
const ForgotPassword = lazy(() => import("../Pages/ForgotPassword/ForgotPassword"));
const ResetPassword = lazy(() => import("../Pages/ResetPassword/ResetPassword"));
const NotFound = lazy(() => import("../Pages/NotFound/NotFound"));

// Fallback loader
const PageLoader = () => (
  <div style={{ padding: "40px", textAlign: "center", color: "var(--text-secondary)" }}>
    Loading section...
  </div>
);

function AppRouter() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<SharedLayout />}>
          {/* ... (rest of routes) ... */}
          <Route index element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="askquestion" element={<ProtectedRoute><Askquestion /></ProtectedRoute>} />
          <Route path="answer/:question_id" element={<ProtectedRoute><Answer /></ProtectedRoute>} />
          <Route path="edit-answer/:answerid" element={<ProtectedRoute><EditAnswer /></ProtectedRoute>} />
          <Route path="edit-question/:questionid" element={<ProtectedRoute><EditQuestion /></ProtectedRoute>} />
          <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

          <Route path=":mode" element={<Landing />} />
          <Route path="howitworks" element={<HowItWorks />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password/:token" element={<ResetPassword />} />
          <Route path="404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default AppRouter;
