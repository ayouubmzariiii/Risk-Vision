import React, { useState, useEffect } from 'react';
import { Risk, RiskCategory, RiskStatus } from '../../types';
import { useProjects } from '../../context/ProjectContext';
import Button from '../ui/Button';
import { Input } from '../ui/Input';
import { Save } from 'lucide-react';
import EmailAutocomplete from '../ui/EmailAutocomplete';

interface RiskFormProps {
  initialRisk?: Risk;
  onComplete?: () => void;
  onCancel?: () => void;
}

const RISK_CATEGORIES: RiskCategory[] = [
  'technical',
  'financial',
  'operational',
  'schedule',
  'scope',
  'resource',
  'stakeholder',
  'legal',
  'security',
  'quality',
  'custom'
];

const RISK_STATUSES: RiskStatus[] = ['open', 'mitigated', 'closed'];

const RiskForm: React.FC<RiskFormProps> = ({ initialRisk, onComplete, onCancel }) => {
  const { addRisk, updateRisk, calculateRiskPriority, currentProject } = useProjects();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<RiskCategory>('technical');
  const [probability, setProbability] = useState(5);
  const [impact, setImpact] = useState(5);
  const [status, setStatus] = useState<RiskStatus>('open');
  const [assignedTo, setAssignedTo] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialRisk) {
      setTitle(initialRisk.title);
      setDescription(initialRisk.description);
      setCategory(initialRisk.category);
      setProbability(initialRisk.probability);
      setImpact(initialRisk.impact);
      setStatus(initialRisk.status);
      setAssignedTo(initialRisk.assignedTo ? [initialRisk.assignedTo] : []);
      setTags(initialRisk.tags);
    }
  }, [initialRisk]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!title.trim()) {
      newErrors.title = 'Risk title is required';
    }
    
    if (!description.trim()) {
      newErrors.description = 'Risk description is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const priority = calculateRiskPriority(probability, impact);
      const finalAssignedTo = assignedTo.length > 0 ? assignedTo[0] : '';
      
      if (initialRisk) {
        updateRisk({
          ...initialRisk,
          title,
          description,
          category,
          probability,
          impact,
          priority,
          status,
          assignedTo: finalAssignedTo,
          tags
        });
      } else {
        addRisk({
          title,
          description,
          category,
          probability,
          impact,
          priority,
          status,
          assignedTo: finalAssignedTo,
          tags
        });
      }
      
      if (onComplete) onComplete();
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleAddAssignee = (email: string) => {
    if (!assignedTo.includes(email)) {
      setAssignedTo([email]); // Only allow one assignee
    }
  };

  const handleRemoveAssignee = (email: string) => {
    setAssignedTo(assignedTo.filter(assignee => assignee !== email));
  };

  // Get available team members for autocomplete
  const getAvailableTeamMembers = () => {
    if (!currentProject?.teamMembers) return [];
    
    return currentProject.teamMembers.map(member => {
      if (typeof member === 'string') {
        return member;
      } else {
        return member.email;
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <Input
          label="Risk Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          error={errors.title}
          placeholder="Enter risk title"
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Risk Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className={`mt-1 block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
              errors.description ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Describe the risk"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value as RiskCategory)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              {RISK_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as RiskStatus)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              {RISK_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="probability" className="block text-sm font-medium text-gray-700 mb-1">
              Probability (1-10): {probability}
            </label>
            <input
              type="range"
              id="probability"
              min="1"
              max="10"
              value={probability}
              onChange={(e) => setProbability(parseInt(e.target.value))}
              className="mt-1 block w-full"
            />
          </div>

          <div>
            <label htmlFor="impact" className="block text-sm font-medium text-gray-700 mb-1">
              Impact (1-10): {impact}
            </label>
            <input
              type="range"
              id="impact"
              min="1"
              max="10"
              value={impact}
              onChange={(e) => setImpact(parseInt(e.target.value))}
              className="mt-1 block w-full"
            />
          </div>
        </div>

        <EmailAutocomplete
          selectedEmails={assignedTo}
          onSelect={handleAddAssignee}
          onRemove={handleRemoveAssignee}
          label="Assigned To"
          placeholder="Type email or name to search team members"
          maxSelections={1}
          availableEmails={getAvailableTeamMembers()}
        />

        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
            Tags
          </label>
          <div className="flex mt-1">
            <input
              type="text"
              id="tags"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && tagInput.trim()) {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
              className="block w-full rounded-l-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="Add a tag"
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 text-sm font-medium rounded-r-md bg-gray-50 text-gray-700 hover:bg-gray-100"
            >
              Add
            </button>
          </div>
          {tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1.5 inline-flex text-blue-400 hover:text-blue-600 focus:outline-none"
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        {onCancel && (
          <Button type="button\" variant="outline\" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" icon={<Save size={16} />}>
          {initialRisk ? 'Update Risk' : 'Add Risk'}
        </Button>
      </div>
    </form>
  );
};

export default RiskForm;