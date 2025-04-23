import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ViewerDashboard from './pages/dashboards/ViewerDashboard';
import StudentDashboard from './pages/dashboards/StudentDashboard';
import FacultyDashboard from './pages/dashboards/FacultyDashboard';
import AdminDashboard from './pages/dashboards/AdminDashboard';
import ManagementDashboard from './pages/dashboards/ManagementDashboard';
import ProjectDetails from './pages/projects/ProjectDetails';
import AuthLayout from './components/layouts/AuthLayout';
import DashboardLayout from './components/layouts/DashboardLayout';
import NotFound from './pages/NotFound';
import { UserRole } from './types';

const ProtectedRoute = ({ 
  children, 
  allowedRoles 
}: { 
  children: React.ReactNode; 
  allowedRoles: UserRole[] 
}) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>;
  }
  
  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  const { user } = useAuth();
  
  const getDashboardRouteForRole = (role: UserRole) => {
    switch (role) {
      case 'viewer': return '/dashboard/viewer';
      case 'student': return '/dashboard/student';
      case 'faculty': return '/dashboard/faculty';
      case 'admin': return '/dashboard/admin';
      case 'management': return '/dashboard/management';
      default: return '/login';
    }
  };

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={
            user ? <Navigate to={getDashboardRouteForRole(user.role)} replace /> : <LoginPage />
          } />
          <Route path="/register" element={
            user ? <Navigate to={getDashboardRouteForRole(user.role)} replace /> : <RegisterPage />
          } />
        </Route>
        
        {/* Dashboard Routes */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard/viewer" element={
            <ProtectedRoute allowedRoles={['viewer', 'student', 'faculty', 'admin', 'management']}>
              <ViewerDashboard />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/student" element={
            <ProtectedRoute allowedRoles={['student', 'faculty', 'admin', 'management']}>
              <StudentDashboard />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/faculty" element={
            <ProtectedRoute allowedRoles={['faculty', 'admin', 'management']}>
              <FacultyDashboard />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/admin" element={
            <ProtectedRoute allowedRoles={['admin', 'management']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/management" element={
            <ProtectedRoute allowedRoles={['management']}>
              <ManagementDashboard />
            </ProtectedRoute>
          } />
          <Route path="/projects/:id" element={
            <ProtectedRoute allowedRoles={['viewer', 'student', 'faculty', 'admin', 'management']}>
              <ProjectDetails />
            </ProtectedRoute>
          } />
        </Route>
        
        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;