import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ViewerDashboard from './pages/dashboards/ViewerDashboard';
import StudentDashboard from './pages/dashboards/StudentDashboard';
import FacultyDashboard from './pages/dashboards/FacultyDashboard';
import ProjectDetails from './pages/projects/ProjectDetails';
import StudentProjects from './pages/projects/StudentProjects';
import NewProject from './components/projects/NewProject';
import AuthLayout from './components/layouts/AuthLayout';
import DashboardLayout from './components/layouts/DashboardLayout';
import NotFound from './pages/NotFound';
import { UserRole } from './types';
import StudentFeedback from './pages/dashboards/StudentFeedback';
import Header from './components/layouts/Header';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/" />;
  }
  return <>{children}</>;
};

const FacultyRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  if (!user || user.role !== 'faculty') {
    return <Navigate to="/" />;
  }
  return <>{children}</>;
};

const AppContent: React.FC = () => {
  const { user } = useAuth();
  
  const getDashboardRouteForRole = (role: UserRole) => {
    switch (role) {
      case 'viewer': return '/dashboard/viewer';
      case 'student': return '/dashboard/student';
      case 'faculty': return '/dashboard/faculty';
      default: return '/login';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          
          <Route element={<AuthLayout />}>
            <Route path="/login" element={
              user ? <Navigate to={getDashboardRouteForRole(user.role)} replace /> : <LoginPage />
            } />
            <Route path="/register" element={
              user ? <Navigate to={getDashboardRouteForRole(user.role)} replace /> : <RegisterPage />
            } />
          </Route>
          
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard/viewer" element={
              <ProtectedRoute>
                <ViewerDashboard />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/student" element={
              <ProtectedRoute>
                <StudentDashboard />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/student/projects" element={
              <ProtectedRoute>
                <StudentProjects />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/student/projects/new" element={
              <ProtectedRoute>
                <NewProject />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/student/feedback" element={
              <ProtectedRoute>
                <StudentFeedback />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/faculty" element={
              <FacultyRoute>
                <FacultyDashboard />
              </FacultyRoute>
            } />
           
            <Route path="/projects/:id" element={
              <ProtectedRoute>
                <ProjectDetails />
              </ProtectedRoute>
            } />
          </Route>
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
};

export default App;