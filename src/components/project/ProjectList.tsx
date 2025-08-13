import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjects } from '../../context/ProjectContext';
import { Card, CardHeader, CardContent } from '../ui/Card';
import Button from '../ui/Button';
import { Calendar, Trash2, ArrowRight } from 'lucide-react';

const ProjectList: React.FC = () => {
  const { projects, removeProject } = useProjects();
  const navigate = useNavigate();

  if (projects.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No projects yet. Create your first project to get started.</p>
      </div>
    );
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Sort projects by creation date (newest first)
  const sortedProjects = [...projects].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="space-y-4">
      {sortedProjects.map((project) => (
        <Card
          key={project.id}
          className="transition-all hover:shadow-lg"
        >
          <CardHeader className="flex items-center justify-between">
            <h3 className="text-lg font-medium">{project.name}</h3>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500 flex items-center">
                <Calendar size={14} className="mr-1" />
                {formatDate(project.createdAt)}
              </span>
              <Button
                variant="danger"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  if (window.confirm('Are you sure you want to delete this project?')) {
                    removeProject(project.id);
                  }
                }}
                icon={<Trash2 size={14} />}
              >
                Delete
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">{project.description}</p>
            <div className="mt-4 flex justify-between items-center">
              <div className="text-sm text-gray-500">
                {project.risks.length} risk{project.risks.length !== 1 ? 's' : ''}
              </div>
              <Button
                variant="primary"
                size="sm"
                icon={<ArrowRight size={16} />}
                onClick={() => navigate(`/dashboard/project/${project.id}`)}
              >
                View Project
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ProjectList;