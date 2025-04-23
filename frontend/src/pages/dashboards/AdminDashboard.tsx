import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

const AdminDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Welcome, {user?.name || 'Admin'}</h2>
        <p className="text-gray-600 mb-4">Manage your institution's projects and users from this dashboard.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <h3 className="font-medium text-blue-800">Project Management</h3>
            <p className="text-sm text-blue-600 mt-2">Review and approve new project submissions</p>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg border border-green-100">
            <h3 className="font-medium text-green-800">User Management</h3>
            <p className="text-sm text-green-600 mt-2">Manage faculty, student, and viewer accounts</p>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
            <h3 className="font-medium text-purple-800">Reports</h3>
            <p className="text-sm text-purple-600 mt-2">Generate and export system reports</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {/* Activity items would typically be populated from an API */}
          <div className="p-3 border-l-4 border-blue-500 bg-gray-50">
            <p className="text-sm text-gray-700">New project submitted by Faculty Name</p>
            <p className="text-xs text-gray-500 mt-1">Today, 2:30 PM</p>
          </div>
          <div className="p-3 border-l-4 border-green-500 bg-gray-50">
            <p className="text-sm text-gray-700">New faculty account registration</p>
            <p className="text-xs text-gray-500 mt-1">Yesterday, 10:15 AM</p>
          </div>
          <div className="p-3 border-l-4 border-amber-500 bg-gray-50">
            <p className="text-sm text-gray-700">Project status updated: "Sustainable Agriculture"</p>
            <p className="text-xs text-gray-500 mt-1">Feb 15, 2025</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;