import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { loadAuthFromStorage } from './store/authSlice';
import CheckerResult from './pages/CheckerResult';
import CheckerSubmission from './pages/CheckerSubmission';
import ProtectedRoute from './components/ProtectedRoute';
import Loading from './components/ui/Loading';
import { useSelector, useDispatch } from 'react-redux';

const Home = lazy(() => import('./pages/Home'));
const ProgramDetail = lazy(() => import('./pages/ProgramDetail'));
const Signup = lazy(() => import('./pages/Signup'));
const Login = lazy(() => import('./pages/Login'));
const Dashboard = lazy(() => import('./components/layout/Dashboard'));
const CourseManagement = lazy(() => import("./pages/courseManagement/CourseManagement"));

const Loader = () => (
  <Loading />
);

const App = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(loadAuthFromStorage());
  }, [dispatch]);

  const isAuthenticated = user ?? null;

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
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Dashboard />
              </ProtectedRoute>
            </Suspense>
          }
        >
          <Route index element={<h1>Welcome to Dashboard</h1>} />
          <Route path="courses" element={<CourseManagement />} />
        </Route>
        <Route path="/result" element={<CheckerResult />} />
        <Route path="/checker-submission" element={<CheckerSubmission />} />

      </Routes>
    </Router>
  );
}

export default App;
