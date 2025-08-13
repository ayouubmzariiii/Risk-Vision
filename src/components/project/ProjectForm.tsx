import React, { useState, useEffect } from 'react';
import { useProjects } from '../../context/ProjectContext';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';
import { Input } from '../ui/Input';
import { Plus, Wand2 } from 'lucide-react';
import EmailAutocomplete from '../ui/EmailAutocomplete';

interface ProjectFormProps {
  onComplete?: () => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ onComplete }) => {
  const { createProject } = useProjects();
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [teamMembers, setTeamMembers] = useState<string[]>([]);
  const [errors, setErrors] = useState<{ name?: string; description?: string }>({});

  // Add current user to team members by default
  useEffect(() => {
    if (user?.email && !teamMembers.includes(user.email)) {
      setTeamMembers([user.email]);
    }
  }, [user?.email]);

  const validateForm = (): boolean => {
    const newErrors: { name?: string; description?: string } = {};
    
    if (!name.trim()) {
      newErrors.name = 'Project name is required';
    }
    
    if (!description.trim()) {
      newErrors.description = 'Project description is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      createProject(name, description, teamMembers);
      setName('');
      setDescription('');
      setTeamMembers([]);
      if (onComplete) onComplete();
    }
  };

  const handleAddTeamMember = (email: string) => {
    if (!teamMembers.includes(email)) {
      setTeamMembers([...teamMembers, email]);
    }
  };

  const handleRemoveTeamMember = (email: string) => {
    setTeamMembers(teamMembers.filter(member => member !== email));
  };

  const handleSuggest = () => {
    const suggestions = [
      {
        name: 'E-Commerce Platform Redesign',
        description: 'A comprehensive redesign of our e-commerce platform to improve user experience, increase conversion rates, and modernize the technology stack.'
      },
      {
        name: 'Cloud Migration Initiative',
        description: 'Strategic migration of on-premise infrastructure to cloud services, focusing on scalability, cost optimization, and improved disaster recovery capabilities.'
      },
      {
        name: 'Mobile App Development',
        description: 'Development of a cross-platform mobile application to extend our digital presence and provide customers with a seamless mobile experience.'
      },
      {
        name: 'Data Analytics Platform',
        description: 'Implementation of a comprehensive data analytics platform to leverage business intelligence and improve decision-making processes.'
      }
    ];

    const suggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
    setName(suggestion.name);
    setDescription(suggestion.description);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <Input
          label="Project Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
          placeholder="Enter project name"
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Project Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className={`mt-1 block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
              errors.description ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Describe your project"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
          )}
        </div>

        <EmailAutocomplete
          selectedEmails={teamMembers}
          onSelect={handleAddTeamMember}
          onRemove={handleRemoveTeamMember}
        />
      </div>

      <div className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          icon={<Wand2 size={16} />}
          onClick={handleSuggest}
        >
          Suggest Project
        </Button>
        <Button type="submit" icon={<Plus size={16} />}>
          Create Project
        </Button>
      </div>
    </form>
  );
};

export default ProjectForm;