import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Checker from './pages/Checker';
import CheckerResult from './pages/CheckerResult';
import CheckerSubmission from './pages/CheckerSubmission';
import Loading from './components/ui/Loading';
const Home = lazy(() => import('./pages/Home'));
const ProgramDetail = lazy(() => import('./pages/ProgramDetail'));
const Signup = lazy(() => import('./pages/Signup'));
const Login = lazy(() => import('./pages/Login'));
const Dashboard = lazy(() => import('./components/layout/Dashboard'));
const AdminCourses = lazy(() => import("./components/admin/AdminCourses"));

const Loader = () => (
  <Loading />
);

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Suspense fallback={<Loader />}>
              <Home />
            </Suspense>
          }
        />
        <Route
          path="/program-detail/:programId"
          element={
            <Suspense fallback={<Loader />}>
              <ProgramDetail />
            </Suspense>
          }
        />
        <Route
          path="/register"
          element={
            <Suspense fallback={<Loader />}>
              <Signup />
            </Suspense>
          }
        />
        <Route
          path="/login"
          element={
            <Suspense fallback={<Loader />}>
              <Login />
            </Suspense>
          }
        />
        <Route
          path="/dashboard/*"
          element={
            <Suspense fallback={<Loader />}>
              <Dashboard />
            </Suspense>
          }
        >
          {/* Nested routes inside Dashboard */}
          <Route index element={<h1>Welcome to Dashboard</h1>} />
          <Route path="courses" element={<AdminCourses />} />
        </Route>
        <Route path="/result" element={<CheckerResult />} />
        <Route path="/checker-submission" element={<CheckerSubmission />} />

      </Routes>
    </Router>
  );
}

export default App;
