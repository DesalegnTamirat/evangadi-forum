import { lazy, Suspense, useContext } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import SharedLayout from "../components/Layout/SharedLayout";
import ProtectedRoute from "../components/ProtectedRoute/ProtectedRoute";
import { AppState } from "../App";

// Lazy-loaded pages
const Home = lazy(() => import("../Pages/Home/Home"));
const Askquestion = lazy(() => import("../Pages/Askquestion/Askquestion"));
const Answer = lazy(() => import("../Pages/Answer/Answer"));
const EditAnswer = lazy(() => import("../Pages/Answer/EditAnswer"));
const EditQuestion = lazy(() => import("../Pages/EditQuestion/EditQuestion"));
const Profile = lazy(() => import("../Pages/Profile/Profile"));
const Landing = lazy(() => import("../Pages/Landing/Landing"));
const GuestLanding = lazy(() => import("../Pages/Landing/GuestLanding"));
const HowItWorks = lazy(() => import("../Pages/HowItWorks/HowItWorks"));
const ForgotPassword = lazy(() => import("../Pages/ForgotPassword/ForgotPassword"));
const Forums = lazy(() => import("../Pages/Forums/Forums"));
const ForumDashboard = lazy(() => import("../Pages/ForumDashboard/ForumDashboard"));
const Members = lazy(() => import("../Pages/Members/Members"));
const Badges = lazy(() => import("../Pages/Badges/Badges"));
const ResetPassword = lazy(() => import("../Pages/ResetPassword/ResetPassword"));
const NotFound = lazy(() => import("../Pages/NotFound/NotFound"));

// Fallback loader
const PageLoader = () => (
  <div style={{ padding: "40px", textAlign: "center", color: "var(--text-main)" }}>
    Loading section...
  </div>
);

function AppRouter() {
  const { user } = useContext(AppState);

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<SharedLayout />}>
          {/* Conditional Root Route */}
          <Route index element={user ? <Home /> : <GuestLanding />} />
          
          {/* Authenticated Routes */}
          <Route path="askquestion" element={<ProtectedRoute><Askquestion /></ProtectedRoute>} />
          <Route path="answer/:question_id" element={<ProtectedRoute><Answer /></ProtectedRoute>} />
          <Route path="edit-answer/:answerid" element={<ProtectedRoute><EditAnswer /></ProtectedRoute>} />
          <Route path="edit-question/:questionid" element={<ProtectedRoute><EditQuestion /></ProtectedRoute>} />
          <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

          {/* Functional App Sections */}
          <Route path="forums" element={<ProtectedRoute><Forums /></ProtectedRoute>} />
          <Route path="forum/:id" element={<ProtectedRoute><ForumDashboard /></ProtectedRoute>} />
          <Route path="questions" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="members" element={<ProtectedRoute><Members /></ProtectedRoute>} />
          <Route path="badges" element={<ProtectedRoute><Badges /></ProtectedRoute>} />
          <Route path="settings" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="support" element={<Navigate to="/howitworks" replace />} />

          {/* Guest Access Routes */}
          <Route path="auth/:mode" element={<Landing />} />
          <Route path="signin" element={<Navigate to="/auth/signin" replace />} />
          <Route path="signup" element={<Navigate to="/auth/signup" replace />} />
          
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
