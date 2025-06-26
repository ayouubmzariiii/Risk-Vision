import React, { useState, useEffect } from 'react';
import { Risk, MitigationStrategy } from '../../types';
import { useProjects } from '../../context/ProjectContext';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { Input } from '../ui/Input';
import { Wand2, Save, Clock, Users, Target, DollarSign, AlertTriangle, Edit2, X, Check } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';

interface MitigationModalProps {
  isOpen: boolean;
  onClose: () => void;
  risk: Risk;
}

const MitigationModal: React.FC<MitigationModalProps> = ({ isOpen, onClose, risk }) => {
  const { generateRiskMitigation, generateSolutions, updateRisk } = useProjects();
  const [mitigation, setMitigation] = useState<MitigationStrategy | undefined>(risk.mitigationStrategy);
  const [solutions, setSolutions] = useState<string[]>(risk.solutions || []);
  const [isGeneratingMitigation, setIsGeneratingMitigation] = useState(false);
  const [isGeneratingSolutions, setIsGeneratingSolutions] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingSections, setEditingSections] = useState<Record<string, boolean>>({});
  const [editedMitigation, setEditedMitigation] = useState<MitigationStrategy | undefined>(mitigation);

  useEffect(() => {
    if (isOpen) {
      setMitigation(risk.mitigationStrategy);
      setSolutions(risk.solutions || []);
      setError(null);
      setEditingSections({});
      setEditedMitigation(risk.mitigationStrategy);
    }
  }, [isOpen, risk]);

  const handleGenerateMitigation = async () => {
    setIsGeneratingMitigation(true);
    setError(null);
    
    try {
      const strategy = await generateRiskMitigation(risk);
      setMitigation(strategy);
      setEditedMitigation(strategy);
    } catch (err) {
      setError('Failed to generate mitigation strategy. Please try again later.');
    } finally {
      setIsGeneratingMitigation(false);
    }
  };

  const handleGenerateSolutions = async () => {
    setIsGeneratingSolutions(true);
    setError(null);
    
    try {
      const generatedSolutions = await generateSolutions(risk);
      setSolutions(generatedSolutions);
    } catch (err) {
      setError('Failed to generate solutions. Please try again later.');
    } finally {
      setIsGeneratingSolutions(false);
    }
  };

  const handleSave = () => {
    updateRisk({
      ...risk,
      mitigationStrategy: editedMitigation,
      solutions
    });
    setMitigation(editedMitigation);
    onClose();
  };

  const toggleEditSection = (section: string) => {
    setEditingSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleEditField = (field: string, value: any) => {
    if (!editedMitigation) return;
    setEditedMitigation({
      ...editedMitigation,
      [field]: value
    });
  };

  const handleEditRole = (index: number, field: string, value: any) => {
    if (!editedMitigation) return;
    const updatedRoles = [...editedMitigation.responsibleRoles];
    updatedRoles[index] = {
      ...updatedRoles[index],
      [field]: value
    };
    handleEditField('responsibleRoles', updatedRoles);
  };

  const handleEditTimeline = (index: number, field: string, value: any) => {
    if (!editedMitigation) return;
    const updatedTimeline = [...editedMitigation.timeline];
    updatedTimeline[index] = {
      ...updatedTimeline[index],
      [field]: value
    };
    handleEditField('timeline', updatedTimeline);
  };

  const handleEditCost = (index: number, field: string, value: any) => {
    if (!editedMitigation) return;
    const updatedCosts = [...editedMitigation.costImplications];
    updatedCosts[index] = {
      ...updatedCosts[index],
      [field]: value
    };
    handleEditField('costImplications', updatedCosts);
  };

  const handleAddRole = () => {
    if (!editedMitigation) return;
    const newRole = {
      role: '',
      responsibilities: ['']
    };
    handleEditField('responsibleRoles', [...editedMitigation.responsibleRoles, newRole]);
  };

  const handleAddTimeline = () => {
    if (!editedMitigation) return;
    const newPhase = {
      phase: '',
      duration: '',
      activities: ['']
    };
    handleEditField('timeline', [...editedMitigation.timeline, newPhase]);
  };

  const handleAddCost = () => {
    if (!editedMitigation) return;
    const newCost = {
      item: '',
      estimate: ''
    };
    handleEditField('costImplications', [...editedMitigation.costImplications, newCost]);
  };

  const handleRemoveRole = (index: number) => {
    if (!editedMitigation) return;
    const updatedRoles = editedMitigation.responsibleRoles.filter((_, i) => i !== index);
    handleEditField('responsibleRoles', updatedRoles);
  };

  const handleRemoveTimeline = (index: number) => {
    if (!editedMitigation) return;
    const updatedTimeline = editedMitigation.timeline.filter((_, i) => i !== index);
    handleEditField('timeline', updatedTimeline);
  };

  const handleRemoveCost = (index: number) => {
    if (!editedMitigation) return;
    const updatedCosts = editedMitigation.costImplications.filter((_, i) => i !== index);
    handleEditField('costImplications', updatedCosts);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Risk Management: ${risk.title}`}
      size="xl"
    >
      <div className="space-y-6">
        <Card className="bg-gray-50">
          <CardContent className="p-4">
            <h4 className="font-medium text-gray-900 mb-2">Risk Details</h4>
            <p className="text-gray-700 mb-3">{risk.description}</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Category:</span>
                <p className="text-gray-600 capitalize">{risk.category}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Probability:</span>
                <p className="text-gray-600">{risk.probability}/10</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Impact:</span>
                <p className="text-gray-600">{risk.impact}/10</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Priority:</span>
                <p className="text-gray-600 capitalize">{risk.priority}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-medium text-gray-900">Mitigation Strategy</h4>
              <Button
                variant="secondary"
                size="sm"
                icon={<Wand2 size={14} />}
                onClick={handleGenerateMitigation}
                isLoading={isGeneratingMitigation}
              >
                Generate Strategy
              </Button>
            </div>

            {editedMitigation ? (
              <div className="space-y-6">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-medium text-gray-900">Overview</h5>
                      {!editingSections.overview ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={<Edit2 size={14} />}
                          onClick={() => toggleEditSection('overview')}
                        />
                      ) : (
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            icon={<X size={14} />}
                            onClick={() => {
                              setEditedMitigation({
                                ...editedMitigation,
                                overview: mitigation?.overview || ''
                              });
                              toggleEditSection('overview');
                            }}
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            icon={<Check size={14} />}
                            onClick={() => toggleEditSection('overview')}
                          />
                        </div>
                      )}
                    </div>
                    {editingSections.overview ? (
                      <textarea
                        value={editedMitigation.overview}
                        onChange={(e) => handleEditField('overview', e.target.value)}
                        className="w-full p-2 border rounded-md"
                        rows={4}
                      />
                    ) : (
                      <p className="text-gray-700">{editedMitigation.overview}</p>
                    )}
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <Users className="w-5 h-5 text-blue-600 mr-2" />
                          <h5 className="font-medium text-gray-900">Responsible Roles</h5>
                        </div>
                        {!editingSections.roles ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            icon={<Edit2 size={14} />}
                            onClick={() => toggleEditSection('roles')}
                          />
                        ) : (
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              icon={<X size={14} />}
                              onClick={() => {
                                setEditedMitigation({
                                  ...editedMitigation,
                                  responsibleRoles: mitigation?.responsibleRoles || []
                                });
                                toggleEditSection('roles');
                              }}
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              icon={<Check size={14} />}
                              onClick={() => toggleEditSection('roles')}
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={handleAddRole}
                            >
                              Add Role
                            </Button>
                          </div>
                        )}
                      </div>
                      <div className="space-y-4">
                        {editedMitigation.responsibleRoles.map((role, index) => (
                          <div key={index} className="border-l-2 border-blue-500 pl-3">
                            {editingSections.roles ? (
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <Input
                                    value={role.role}
                                    onChange={(e) => handleEditRole(index, 'role', e.target.value)}
                                    placeholder="Role title"
                                  />
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    icon={<X size={14} />}
                                    onClick={() => handleRemoveRole(index)}
                                    className="ml-2"
                                  />
                                </div>
                                <textarea
                                  value={role.responsibilities.join('\n')}
                                  onChange={(e) => handleEditRole(index, 'responsibilities', e.target.value.split('\n'))}
                                  className="w-full p-2 border rounded-md"
                                  rows={3}
                                  placeholder="Enter responsibilities (one per line)"
                                />
                              </div>
                            ) : (
                              <>
                                <h6 className="font-medium text-gray-800 mb-1">{role.role}</h6>
                                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                                  {role.responsibilities.map((resp, i) => (
                                    <li key={i}>{resp}</li>
                                  ))}
                                </ul>
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <Clock className="w-5 h-5 text-emerald-600 mr-2" />
                          <h5 className="font-medium text-gray-900">Timeline</h5>
                        </div>
                        {!editingSections.timeline ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            icon={<Edit2 size={14} />}
                            onClick={() => toggleEditSection('timeline')}
                          />
                        ) : (
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              icon={<X size={14} />}
                              onClick={() => {
                                setEditedMitigation({
                                  ...editedMitigation,
                                  timeline: mitigation?.timeline || []
                                });
                                toggleEditSection('timeline');
                              }}
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              icon={<Check size={14} />}
                              onClick={() => toggleEditSection('timeline')}
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={handleAddTimeline}
                            >
                              Add Phase
                            </Button>
                          </div>
                        )}
                      </div>
                      <div className="space-y-4">
                        {editedMitigation.timeline.map((phase, index) => (
                          <div key={index} className="border-l-2 border-emerald-500 pl-3">
                            {editingSections.timeline ? (
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <div className="flex-1 grid grid-cols-2 gap-2">
                                    <Input
                                      value={phase.phase}
                                      onChange={(e) => handleEditTimeline(index, 'phase', e.target.value)}
                                      placeholder="Phase name"
                                    />
                                    <Input
                                      value={phase.duration}
                                      onChange={(e) => handleEditTimeline(index, 'duration', e.target.value)}
                                      placeholder="Duration"
                                    />
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    icon={<X size={14} />}
                                    onClick={() => handleRemoveTimeline(index)}
                                    className="ml-2"
                                  />
                                </div>
                                <textarea
                                  value={phase.activities.join('\n')}
                                  onChange={(e) => handleEditTimeline(index, 'activities', e.target.value.split('\n'))}
                                  className="w-full p-2 border rounded-md"
                                  rows={3}
                                  placeholder="Enter activities (one per line)"
                                />
                              </div>
                            ) : (
                              <>
                                <h6 className="font-medium text-gray-800 mb-1">
                                  {phase.phase} ({phase.duration})
                                </h6>
                                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                                  {phase.activities.map((activity, i) => (
                                    <li key={i}>{activity}</li>
                                  ))}
                                </ul>
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <Target className="w-5 h-5 text-purple-600 mr-2" />
                          <h5 className="font-medium text-gray-900">Success Metrics</h5>
                        </div>
                        {!editingSections.metrics ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            icon={<Edit2 size={14} />}
                            onClick={() => toggleEditSection('metrics')}
                          />
                        ) : (
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              icon={<X size={14} />}
                              onClick={() => {
                                setEditedMitigation({
                                  ...editedMitigation,
                                  successMetrics: mitigation?.successMetrics || []
                                });
                                toggleEditSection('metrics');
                              }}
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              icon={<Check size={14} />}
                              onClick={() => toggleEditSection('metrics')}
                            />
                          </div>
                        )}
                      </div>
                      {editingSections.metrics ? (
                        <textarea
                          value={editedMitigation.successMetrics.join('\n')}
                          onChange={(e) => handleEditField('successMetrics', e.target.value.split('\n'))}
                          className="w-full p-2 border rounded-md"
                          rows={4}
                          placeholder="Enter success metrics (one per line)"
                        />
                      ) : (
                        <ul className="list-disc list-inside text-gray-600 space-y-2">
                          {editedMitigation.successMetrics.map((metric, index) => (
                            <li key={index}>{metric}</li>
                          ))}
                        </ul>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <DollarSign className="w-5 h-5 text-amber-600 mr-2" />
                          <h5 className="font-medium text-gray-900">Cost Implications</h5>
                        </div>
                        {!editingSections.costs ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            icon={<Edit2 size={14} />}
                            onClick={() => toggleEditSection('costs')}
                          />
                        ) : (
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              icon={<X size={14} />}
                              onClick={() => {
                                setEditedMitigation({
                                  ...editedMitigation,
                                  costImplications: mitigation?.costImplications || []
                                });
                                toggleEditSection('costs');
                              }}
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              icon={<Check size={14} />}
                              onClick={() => toggleEditSection('costs')}
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={handleAddCost}
                            >
                              Add Cost
                            </Button>
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        {editedMitigation.costImplications.map((cost, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            {editingSections.costs ? (
                              <div className="flex-1 grid grid-cols-2 gap-2 items-center">
                                <Input
                                  value={cost.item}
                                  onChange={(e) => handleEditCost(index, 'item', e.target.value)}
                                  placeholder="Cost item"
                                />
                                <div className="flex items-center gap-2">
                                  <Input
                                    value={cost.estimate}
                                    onChange={(e) => handleEditCost(index, 'estimate', e.target.value)}
                                    placeholder="Estimate"
                                  />
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    icon={<X size={14} />}
                                    onClick={() => handleRemoveCost(index)}
                                  />
                                </div>
                              </div>
                            ) : (
                              <>
                                <span className="text-gray-700">{cost.item}</span>
                                <span className="font-medium text-gray-900">{cost.estimate}</span>
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
                        <h5 className="font-medium text-gray-900">Implementation Challenges</h5>
                      </div>
                      {!editingSections.challenges ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={<Edit2 size={14} />}
                          onClick={() => toggleEditSection('challenges')}
                        />
                      ) : (
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            icon={<X size={14} />}
                            onClick={() => {
                              setEditedMitigation({
                                ...editedMitigation,
                                implementationChallenges: mitigation?.implementationChallenges || []
                              });
                              toggleEditSection('challenges');
                            }}
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            icon={<Check size={14} />}
                            onClick={() => toggleEditSection('challenges')}
                          />
                        </div>
                      )}
                    </div>
                    {editingSections.challenges ? (
                      <textarea
                        value={editedMitigation.implementationChallenges.join('\n')}
                        onChange={(e) => handleEditField('implementationChallenges', e.target.value.split('\n'))}
                        className="w-full p-2 border rounded-md"
                        rows={4}
                        placeholder="Enter implementation challenges (one per line)"
                      />
                    ) : (
                      <ul className="list-disc list-inside text-gray-600 space-y-2">
                        {editedMitigation.implementationChallenges.map((challenge, index) => (
                          <li key={index}>{challenge}</li>
                        ))}
                      </ul>
                    )}
                  </CardContent>
                </Card>
              </div>
            ) : (
              <p className="text-gray-500 text-sm italic">
                No mitigation strategy generated yet. Click the button above to generate a strategy.
              </p>
            )}
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-medium text-gray-900">Solutions</h4>
              <Button
                variant="secondary"
                size="sm"
                icon={<Wand2 size={14} />}
                onClick={handleGenerateSolutions}
                isLoading={isGeneratingSolutions}
              >
                Generate Solutions
              </Button>
            </div>
            {solutions.length > 0 ? (
              <div className="space-y-3">
                {solutions.map((solution, index) => (
                  <Card key={index} className="bg-white">
                    <CardContent className="p-4">
                      <div className="flex items-start">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </span>
                        <p className="ml-3 text-gray-700">{solution}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm italic">
                No solutions generated yet. Click the button above to generate potential solutions.
              </p>
            )}
          </div>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex justify-end space-x-3 pt-4">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            icon={<Save size={16} />}
            onClick={handleSave}
          >
            Save Changes
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default MitigationModal;