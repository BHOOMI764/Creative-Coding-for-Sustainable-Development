import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface Project {
  id: string;
  title: string;
  description: string;
  status: string;
  sdgs: string[];
  createdAt: string;
}

const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        setLoading(true);
        // In a real application, you would fetch the actual project data from your API
        // This is just a placeholder implementation
        const mockProject: Project = {
          id: id || '1',
          title: 'Sustainable Water Management System',
          description: 'A comprehensive system for monitoring and optimizing water usage in agricultural settings to reduce waste and improve sustainability.',
          status: 'In Progress',
          sdgs: ['Clean Water and Sanitation', 'Climate Action'],
          createdAt: new Date().toISOString(),
        };
        
        // Simulate API call
        setTimeout(() => {
          setProject(mockProject);
          setLoading(false);
        }, 500);
      } catch (err) {
        setError('Failed to load project details');
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-md p-6 max-w-2xl w-full">
          <h2 className="text-red-600 text-lg font-semibold mb-2">Error</h2>
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-6 max-w-2xl w-full">
          <h2 className="text-yellow-600 text-lg font-semibold mb-2">Project Not Found</h2>
          <p className="text-yellow-500">The project you're looking for doesn't exist or you don't have permission to view it.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6">
          <h1 className="text-2xl font-bold text-white">{project.title}</h1>
          <div className="flex gap-2 mt-2">
            {project.sdgs.map((sdg, index) => (
              <span key={index} className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {sdg}
              </span>
            ))}
          </div>
        </div>
        <div className="p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <p className="text-gray-700">{project.description}</p>
          </div>
          
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Status</h2>
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              {project.status}
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-4 mt-4">
            <h2 className="text-xl font-semibold mb-4">Project Timeline</h2>
            <div className="relative ml-6">
              <div className="absolute h-full w-0.5 bg-gray-200 left-0"></div>
              <div className="mb-8 relative">
                <div className="absolute -left-3 mt-1.5 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                  <span className="text-white text-xs">1</span>
                </div>
                <div className="ml-6">
                  <h3 className="text-lg font-medium">Project Started</h3>
                  <p className="text-sm text-gray-500">
                    {new Date(project.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                  <p className="mt-1 text-gray-700">Initial project setup and planning phase completed.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;