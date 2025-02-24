import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React, { Suspense, lazy } from 'react';
import Loader from './utils/loader'; // Assuming Loader is a spinner or fallback UI
// Lazy loading components
const Home = lazy(() => import('./pages/homePage'));
const SignInPage = lazy(() => import('./pages/signin'));
const ChatbotComponent = lazy(() => import('./components/chatbot'));
const DashboardHome = lazy(() => import('./pages/dashboard'));
const CodeAuthenticator = lazy(() => import('./generateCode/codeAuthenticator'));
const OfflineSignUp = lazy(() => import('./pages/offlineSignUp'));
const VideoCall = lazy(() => import('./pages/VideoCalls'));
const ResetPassword  = lazy(() => import('./pages/resetPassword'));
const ForgotPasswordPage = lazy(() => import('./pages/forgotPassword'));
const StudentProfile = lazy(() => import("./pages/dashboard/components/studentProfile"));


function MyRoute() {
  return (
    <Router>
      {/* Suspense wraps the lazy-loaded components and displays a fallback (e.g., loader) while they are loading */}
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/chatbot" element={<ChatbotComponent />} />
          <Route path="/dashboard/*" element={<DashboardHome />} />
          <Route path="/code-authenticator" element={<CodeAuthenticator />} />
          <Route path="/offlineSignup" element={<OfflineSignUp />} />
          <Route path="/videoCall" element={<VideoCall />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPassword />} /> 
          <Route path="/student-profile" element={<StudentProfile />} />
          
                 </Routes>
      </Suspense>
    </Router>
  );
}

export default MyRoute;
