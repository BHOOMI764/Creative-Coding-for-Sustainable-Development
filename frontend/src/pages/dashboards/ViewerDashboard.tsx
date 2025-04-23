import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

const ViewerDashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Viewer Dashboard</h1>
        <p className="text-gray-600 mb-6">Welcome back, {user?.name || 'User'}!</p>
        
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
          <h2 className="text-lg font-semibold text-blue-800 mb-2">Quick Access</h2>
          <p className="text-blue-600 mb-4">View and explore projects available to you.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded shadow border border-gray-100">
              <h3 className="font-medium text-gray-800">Featured Projects</h3>
              <p className="text-sm text-gray-500 mt-1">Explore highlighted sustainable development projects</p>
            </div>
            <div className="bg-white p-4 rounded shadow border border-gray-100">
              <h3 className="font-medium text-gray-800">Recent Updates</h3>
              <p className="text-sm text-gray-500 mt-1">See the latest project updates and news</p>
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Latest Projects</h2>
          <p className="text-gray-500 italic">No projects to display yet. Check back soon!</p>
        </div>
      </div>
    </div>
  );
};

export default ViewerDashboard;