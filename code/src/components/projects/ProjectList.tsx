import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { API_URL } from '../../config';
import Button from '../ui/Button';

interface Project {
  id: number;
  title: string;
  description: string;
  thumbnailUrl: string;
  repositoryUrl?: string;
  demoUrl?: string;
  teamName: string;
  sdgs: Array<{
    id: number;
    name: string;
    color: string;
  }>;
  averageRating?: number;
}

const ProjectList: React.FC<{ endpoint?: string }> = ({ endpoint = '/api/projects' }) => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(`${API_URL}${endpoint}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch projects');
        }

        const data = await response.json();
        setProjects(data);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError('Failed to load projects');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [token, endpoint]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-md">
        {error}
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">No projects yet</h3>
        <p className="mt-2 text-gray-600">Check back later for new projects</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <div key={project.id} className="bg-white rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xl">
          <div 
            className="relative aspect-w-16 aspect-h-9 group cursor-pointer"
            onClick={() => navigate(`/projects/${project.id}`)}
          >
            <img 
              src={project.thumbnailUrl || 'https://via.placeholder.com/400x225?text=No+Image'} 
              alt={project.title}
              className="object-cover w-full h-48 transition-transform duration-300 group-hover:scale-110"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://via.placeholder.com/400x225?text=No+Image';
              }}
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
              <span className="text-white font-semibold text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                View Project
              </span>
            </div>
          </div>
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2 hover:text-blue-600 transition-colors duration-200">
              {project.title}
            </h3>
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{project.description}</p>
            <div className="flex flex-wrap gap-2 mb-3">
              {project.sdgs.map((sdg) => (
                <span
                  key={sdg.id}
                  className="px-2 py-1 text-xs rounded-full transition-all duration-200 hover:scale-105"
                  style={{ backgroundColor: `${sdg.color}20`, color: sdg.color }}
                >
                  {sdg.name}
                </span>
              ))}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">By {project.teamName}</span>
              {project.averageRating && (
                <div className="flex items-center bg-gray-50 px-2 py-1 rounded-full">
                  <span className="text-sm text-gray-500 mr-1">Rating:</span>
                  <span className="text-sm font-medium text-gray-700">{project.averageRating.toFixed(1)}</span>
                </div>
              )}
            </div>
            <Button
              className="w-full mt-3 transition-all duration-200 hover:bg-blue-700"
              onClick={() => navigate(`/projects/${project.id}`)}
            >
              View Details
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProjectList; 