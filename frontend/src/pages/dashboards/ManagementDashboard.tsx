import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

const ManagementDashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Management Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back, {user?.name || 'Manager'}!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-blue-700">Projects Overview</h2>
          <p className="text-gray-600 mb-3">Monitor all ongoing projects across departments</p>
          <div className="mt-4">
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
              View All Projects
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-green-700">Resource Allocation</h2>
          <p className="text-gray-600 mb-3">Manage resource distribution and budgeting</p>
          <div className="mt-4">
            <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors">
              Allocate Resources
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-purple-700">Performance Metrics</h2>
          <p className="text-gray-600 mb-3">Review key performance indicators and analytics</p>
          <div className="mt-4">
            <button className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors">
              View Reports
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Administrative Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="bg-indigo-600 text-white px-4 py-3 rounded hover:bg-indigo-700 transition-colors flex items-center justify-center">
            User Management
          </button>
          <button className="bg-amber-600 text-white px-4 py-3 rounded hover:bg-amber-700 transition-colors flex items-center justify-center">
            Department Settings
          </button>
          <button className="bg-teal-600 text-white px-4 py-3 rounded hover:bg-teal-700 transition-colors flex items-center justify-center">
            Approval Requests
          </button>
          <button className="bg-rose-600 text-white px-4 py-3 rounded hover:bg-rose-700 transition-colors flex items-center justify-center">
            Strategic Planning
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManagementDashboard;