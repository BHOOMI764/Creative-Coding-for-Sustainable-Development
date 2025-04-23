import React from 'react';

const FacultyDashboard = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Faculty Dashboard</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">My Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Project cards will go here */}
          <div className="bg-gray-50 p-4 rounded border border-gray-200 flex flex-col">
            <p className="text-gray-400 italic">No projects available</p>
          </div>
        </div>
      </div>
      
      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Project Reviews</h2>
        <div className="space-y-4">
          {/* Reviews will go here */}
          <div className="bg-gray-50 p-4 rounded border border-gray-200">
            <p className="text-gray-400 italic">No reviews assigned</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyDashboard;