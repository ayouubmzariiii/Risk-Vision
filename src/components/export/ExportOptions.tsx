import React, { useState } from 'react';
import { useProjects } from '../../context/ProjectContext';
import Button from '../ui/Button';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Download, FileText, BarChart3, CheckCircle } from 'lucide-react';
import html2pdf from 'html2pdf.js';

const ExportOptions: React.FC = () => {
  const { currentProject } = useProjects();
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const escapeCSV = (value: string | number | undefined | null): string => {
    if (value === undefined || value === null) return '';
    const stringValue = String(value);
    // Escape quotes and wrap in quotes if contains comma, quote, or newline
    if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
      return `"${stringValue.replace(/"/g, '""')}"`;
    }
    return stringValue;
  };

  const exportToCSV = () => {
    if (!currentProject) return;

    setIsExporting(true);

    try {
      // Define CSV headers (removed Risk ID)
      const headers = [
        'Project Name',
        'Project Description',
        'Risk Title',
        'Risk Description',
        'Category',
        'Status',
        'Priority',
        'Probability (1-10)',
        'Impact (1-10)',
        'Risk Score (P×I)',
        'Assigned To',
        'Tags',
        'Has Mitigation Strategy',
        'Mitigation Overview',
        'Responsible Roles',
        'Implementation Timeline',
        'Success Metrics',
        'Cost Implications',
        'Implementation Challenges',
        'Number of Solutions',
        'Solutions Summary',
        'Risk Created Date',
        'Risk Last Updated',
        'Project Created Date',
        'Project Last Updated'
      ];

      // Create CSV rows
      const rows: string[][] = [];
      
      // Add header row
      rows.push(headers);

      // Add project and risk data
      currentProject.risks.forEach((risk) => {
        const riskScore = risk.probability * risk.impact;
        
        // Format mitigation strategy data
        const mitigationOverview = risk.mitigationStrategy?.overview || 'No mitigation strategy';
        const responsibleRoles = risk.mitigationStrategy?.responsibleRoles
          ? risk.mitigationStrategy.responsibleRoles
              .map(role => `${role.role}: ${role.responsibilities.join('; ')}`)
              .join(' | ')
          : 'Not defined';
        
        const timeline = risk.mitigationStrategy?.timeline
          ? risk.mitigationStrategy.timeline
              .map(phase => `${phase.phase} (${phase.duration}): ${phase.activities.join('; ')}`)
              .join(' | ')
          : 'Not defined';
        
        const successMetrics = risk.mitigationStrategy?.successMetrics
          ? risk.mitigationStrategy.successMetrics.join('; ')
          : 'Not defined';
        
        const costImplications = risk.mitigationStrategy?.costImplications
          ? risk.mitigationStrategy.costImplications
              .map(cost => `${cost.item}: ${cost.estimate}`)
              .join('; ')
          : 'Not defined';
        
        const implementationChallenges = risk.mitigationStrategy?.implementationChallenges
          ? risk.mitigationStrategy.implementationChallenges.join('; ')
          : 'Not defined';
        
        const solutionsSummary = risk.solutions && risk.solutions.length > 0
          ? risk.solutions.map((solution, index) => `Solution ${index + 1}: ${solution}`).join(' | ')
          : 'No solutions generated';

        // Removed risk.id from the row data
        const row = [
          currentProject.name,
          currentProject.description,
          risk.title,
          risk.description,
          risk.category,
          risk.status,
          risk.priority,
          risk.probability.toString(),
          risk.impact.toString(),
          riskScore.toString(),
          risk.assignedTo || 'Unassigned',
          risk.tags.join('; '),
          risk.mitigationStrategy ? 'Yes' : 'No',
          mitigationOverview,
          responsibleRoles,
          timeline,
          successMetrics,
          costImplications,
          implementationChallenges,
          risk.solutions?.length.toString() || '0',
          solutionsSummary,
          formatDate(risk.createdAt),
          formatDate(risk.updatedAt),
          formatDate(currentProject.createdAt),
          formatDate(currentProject.updatedAt)
        ];

        rows.push(row);
      });

      // Convert to CSV string
      const csvContent = rows
        .map(row => row.map(cell => escapeCSV(cell)).join(','))
        .join('\n');

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${currentProject.name.replace(/[^a-z0-9]/gi, '_')}_risks_export.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 3000);
    } catch (error) {
      console.error('Error exporting CSV:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const exportToPDF = () => {
    if (!currentProject) return;

    setIsExporting(true);

    const getRiskPriorityColor = (priority: string) => {
      switch (priority) {
        case 'critical': return '#DC2626';
        case 'high': return '#EA580C';
        case 'medium': return '#CA8A04';
        case 'low': return '#059669';
        default: return '#6B7280';
      }
    };

    const getRiskStatusColor = (status: string) => {
      switch (status) {
        case 'open': return '#2563EB';
        case 'mitigated': return '#7C3AED';
        case 'closed': return '#059669';
        default: return '#6B7280';
      }
    };

    const element = document.createElement('div');
    element.innerHTML = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #111827; line-height: 1.6;">
        <!-- Header Section -->
        <div style="background: linear-gradient(135deg, #1E40AF 0%, #3B82F6 50%, #06B6D4 100%); padding: 40px 30px; text-align: center; margin: -20px -20px 30px -20px; color: white;">
          <div style="max-width: 600px; margin: 0 auto;">
            <h1 style="margin: 0 0 10px 0; font-size: 32px; font-weight: 700; letter-spacing: -0.5px;">${currentProject.name}</h1>
            <p style="margin: 0 0 15px 0; font-size: 18px; opacity: 0.9;">${currentProject.description}</p>
            <div style="background: rgba(255,255,255,0.2); border-radius: 12px; padding: 15px; margin-top: 20px; backdrop-filter: blur(10px);">
              <p style="margin: 0; font-size: 14px; opacity: 0.9;">
                📊 Risk Assessment Report | Generated on ${formatDate(new Date())} | ${currentProject.risks.length} Total Risks
              </p>
            </div>
          </div>
        </div>

        <!-- Executive Summary -->
        <div style="margin-bottom: 35px;">
          <h2 style="color: #1F2937; margin-bottom: 20px; font-size: 24px; font-weight: 600; border-bottom: 3px solid #3B82F6; padding-bottom: 8px; display: inline-block;">📈 Executive Summary</h2>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 20px; margin-bottom: 25px;">
            <div style="background: linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%); padding: 20px; border-radius: 12px; text-align: center; border: 2px solid #93C5FD;">
              <div style="font-size: 36px; font-weight: 700; color: #1D4ED8; margin-bottom: 5px;">${currentProject.risks.length}</div>
              <div style="font-size: 14px; color: #1E40AF; font-weight: 500;">Total Risks</div>
            </div>
            
            <div style="background: linear-gradient(135deg, #FEF2F2 0%, #FEE2E2 100%); padding: 20px; border-radius: 12px; text-align: center; border: 2px solid #FCA5A5;">
              <div style="font-size: 36px; font-weight: 700; color: #DC2626; margin-bottom: 5px;">${currentProject.risks.filter(r => r.priority === 'critical').length}</div>
              <div style="font-size: 14px; color: #B91C1C; font-weight: 500;">Critical Risks</div>
            </div>
            
            <div style="background: linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%); padding: 20px; border-radius: 12px; text-align: center; border: 2px solid #FDB366;">
              <div style="font-size: 36px; font-weight: 700; color: #EA580C; margin-bottom: 5px;">${currentProject.risks.filter(r => r.priority === 'high').length}</div>
              <div style="font-size: 14px; color: #C2410C; font-weight: 500;">High Priority</div>
            </div>
            
            <div style="background: linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%); padding: 20px; border-radius: 12px; text-align: center; border: 2px solid #86EFAC;">
              <div style="font-size: 36px; font-weight: 700; color: #059669; margin-bottom: 5px;">${currentProject.risks.filter(r => r.status === 'mitigated').length}</div>
              <div style="font-size: 14px; color: #047857; font-weight: 500;">Mitigated</div>
            </div>
          </div>

          <!-- Status Distribution -->
          <div style="background: #F9FAFB; padding: 20px; border-radius: 12px; border: 1px solid #E5E7EB;">
            <h3 style="margin: 0 0 15px 0; color: #374151; font-size: 16px; font-weight: 600;">📊 Risk Status Distribution</h3>
            <div style="display: flex; justify-content: space-between; flex-wrap: wrap; gap: 15px;">
              <div style="text-align: center;">
                <div style="font-size: 24px; font-weight: 600; color: #2563EB;">${currentProject.risks.filter(r => r.status === 'open').length}</div>
                <div style="font-size: 12px; color: #6B7280;">Open</div>
              </div>
              <div style="text-align: center;">
                <div style="font-size: 24px; font-weight: 600; color: #7C3AED;">${currentProject.risks.filter(r => r.status === 'mitigated').length}</div>
                <div style="font-size: 12px; color: #6B7280;">Mitigated</div>
              </div>
              <div style="text-align: center;">
                <div style="font-size: 24px; font-weight: 600; color: #059669;">${currentProject.risks.filter(r => r.status === 'closed').length}</div>
                <div style="font-size: 12px; color: #6B7280;">Closed</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Risk Details -->
        <div>
          <h2 style="color: #1F2937; margin-bottom: 25px; font-size: 24px; font-weight: 600; border-bottom: 3px solid #3B82F6; padding-bottom: 8px; display: inline-block;">🔍 Detailed Risk Analysis</h2>
          
          ${currentProject.risks.length === 0 ? `
            <div style="text-align: center; padding: 40px; background: #F9FAFB; border-radius: 12px; border: 2px dashed #D1D5DB;">
              <p style="color: #6B7280; font-size: 16px; margin: 0;">No risks have been identified for this project yet.</p>
            </div>
          ` : currentProject.risks.map((risk, index) => `
            <div style="margin-bottom: 30px; background: white; border: 2px solid #E5E7EB; border-radius: 16px; padding: 25px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); page-break-inside: avoid; position: relative; overflow: hidden;">
              <!-- Risk Header -->
              <div style="border-left: 5px solid ${getRiskPriorityColor(risk.priority)}; padding-left: 20px; margin-bottom: 20px;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
                  <h3 style="margin: 0; color: #1F2937; font-size: 20px; font-weight: 600; flex: 1; margin-right: 15px;">${index + 1}. ${risk.title}</h3>
                  <div style="font-size: 18px; font-weight: 700; color: ${getRiskPriorityColor(risk.priority)}; background: rgba(${getRiskPriorityColor(risk.priority).replace('#', '')}, 0.1); padding: 6px 12px; border-radius: 20px; white-space: nowrap;">
                    ${risk.probability * risk.impact}/100
                  </div>
                </div>
                
                <div style="display: flex; gap: 8px; margin-bottom: 15px; flex-wrap: wrap;">
                  <span style="background: #3B82F6; color: white; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 500; text-transform: capitalize;">📁 ${risk.category}</span>
                  <span style="background: ${getRiskPriorityColor(risk.priority)}; color: white; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 500; text-transform: capitalize;">⚠️ ${risk.priority} Priority</span>
                  <span style="background: ${getRiskStatusColor(risk.status)}; color: white; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 500; text-transform: capitalize;">📊 ${risk.status}</span>
                </div>
              </div>
              
              <!-- Risk Description -->
              <div style="background: #F8FAFC; padding: 18px; border-radius: 12px; margin-bottom: 20px; border-left: 4px solid #3B82F6;">
                <p style="margin: 0; color: #374151; line-height: 1.6; font-size: 15px;">${risk.description}</p>
              </div>
              
              <!-- Risk Metrics -->
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 15px; margin-bottom: 20px;">
                <div style="text-align: center; background: #EFF6FF; padding: 15px; border-radius: 10px; border: 1px solid #DBEAFE;">
                  <div style="font-size: 24px; font-weight: 700; color: #1D4ED8; margin-bottom: 4px;">${risk.probability}</div>
                  <div style="font-size: 12px; color: #1E40AF; font-weight: 500;">Probability</div>
                </div>
                <div style="text-align: center; background: #FEF2F2; padding: 15px; border-radius: 10px; border: 1px solid #FECACA;">
                  <div style="font-size: 24px; font-weight: 700; color: #DC2626; margin-bottom: 4px;">${risk.impact}</div>
                  <div style="font-size: 12px; color: #B91C1C; font-weight: 500;">Impact</div>
                </div>
                <div style="text-align: center; background: #F3F4F6; padding: 15px; border-radius: 10px; border: 1px solid #D1D5DB;">
                  <div style="font-size: 24px; font-weight: 700; color: #374151; margin-bottom: 4px;">${risk.probability * risk.impact}</div>
                  <div style="font-size: 12px; color: #6B7280; font-weight: 500;">Risk Score</div>
                </div>
              </div>
              
              ${risk.assignedTo ? `
                <div style="margin-bottom: 20px; background: #F0F9FF; padding: 15px; border-radius: 10px; border: 1px solid #BAE6FD;">
                  <div style="display: flex; align-items: center;">
                    <span style="font-weight: 600; color: #0284C7; margin-right: 8px;">👤 Assigned To:</span>
                    <span style="color: #0369A1; font-weight: 500;">${risk.assignedTo}</span>
                  </div>
                </div>
              ` : ''}
              
              ${risk.tags.length > 0 ? `
                <div style="margin-bottom: 20px;">
                  <div style="font-weight: 600; color: #374151; margin-bottom: 8px; font-size: 14px;">🏷️ Tags:</div>
                  <div style="display: flex; gap: 6px; flex-wrap: wrap;">
                    ${risk.tags.map(tag => `<span style="background: #E5E7EB; color: #374151; padding: 4px 10px; border-radius: 12px; font-size: 12px; font-weight: 500;">${tag}</span>`).join('')}
                  </div>
                </div>
              ` : ''}
              
              ${risk.mitigationStrategy ? `
                <div style="background: linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%); padding: 20px; border-radius: 12px; border: 2px solid #86EFAC; margin-top: 20px;">
                  <h4 style="margin: 0 0 15px 0; color: #14532D; font-size: 16px; font-weight: 600; display: flex; align-items: center;">
                    🛡️ Mitigation Strategy
                  </h4>
                  <p style="margin: 0 0 15px 0; color: #166534; font-size: 14px; line-height: 1.5; background: rgba(255,255,255,0.7); padding: 12px; border-radius: 8px;">${risk.mitigationStrategy.overview}</p>
                  
                  ${risk.mitigationStrategy.responsibleRoles.length > 0 ? `
                    <div style="margin-bottom: 12px;">
                      <div style="font-weight: 600; color: #14532D; margin-bottom: 8px; font-size: 13px;">👥 Key Responsibilities:</div>
                      <div style="background: rgba(255,255,255,0.7); padding: 12px; border-radius: 8px;">
                        ${risk.mitigationStrategy.responsibleRoles.slice(0, 3).map(role => `
                          <div style="margin-bottom: 6px; color: #166534; font-size: 13px;">
                            <strong>${role.role}:</strong> ${role.responsibilities.slice(0, 2).join(', ')}${role.responsibilities.length > 2 ? '...' : ''}
                          </div>
                        `).join('')}
                      </div>
                    </div>
                  ` : ''}
                  
                  ${risk.mitigationStrategy.timeline.length > 0 ? `
                    <div>
                      <div style="font-weight: 600; color: #14532D; margin-bottom: 8px; font-size: 13px;">⏱️ Implementation Timeline:</div>
                      <div style="background: rgba(255,255,255,0.7); padding: 12px; border-radius: 8px;">
                        ${risk.mitigationStrategy.timeline.slice(0, 2).map(phase => `
                          <div style="margin-bottom: 6px; color: #166534; font-size: 13px;">
                            <strong>${phase.phase}</strong> (${phase.duration})
                          </div>
                        `).join('')}
                      </div>
                    </div>
                  ` : ''}
                </div>
              ` : `
                <div style="background: #FEF2F2; border: 1px solid #FECACA; border-radius: 8px; padding: 15px; text-align: center;">
                  <p style="margin: 0; color: #B91C1C; font-size: 14px; font-weight: 500;">⚠️ No mitigation strategy defined</p>
                </div>
              `}
            </div>
          `).join('')}
        </div>
        
        <!-- Footer -->
        <div style="margin-top: 40px; padding: 25px; background: linear-gradient(135deg, #1E293B 0%, #334155 100%); border-radius: 12px; text-align: center; color: white;">
          <div style="margin-bottom: 10px;">
            <strong style="font-size: 16px;">🛡️ RiskVision</strong>
          </div>
          <p style="margin: 5px 0; font-size: 14px; opacity: 0.9;">Intelligent Risk Management Platform</p>
          <p style="margin: 5px 0; font-size: 12px; opacity: 0.7;">Report generated on ${formatDate(new Date())}</p>
          <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid rgba(255,255,255,0.2);">
            <p style="margin: 0; font-size: 11px; opacity: 0.8;">This report contains confidential project risk assessment data. Distribution should be limited to authorized personnel only.</p>
          </div>
        </div>
      </div>
    `;

    const opt = {
      margin: 0.5,
      filename: `${currentProject.name.replace(/[^a-z0-9]/gi, '_')}_risk_report.pdf`,
      image: { type: 'jpeg', quality: 0.95 },
      html2canvas: { 
        scale: 2, 
        useCORS: true,
        letterRendering: true,
        allowTaint: false,
        backgroundColor: '#ffffff'
      },
      jsPDF: { 
        unit: 'in', 
        format: 'a4', 
        orientation: 'portrait',
        compress: true
      }
    };

    html2pdf().set(opt).from(element).save().then(() => {
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 3000);
      setIsExporting(false);
    }).catch((error) => {
      console.error('Error generating PDF:', error);
      setIsExporting(false);
    });
  };

  if (!currentProject) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <h2 className="text-xl font-semibold mb-4">No Project Selected</h2>
          <p className="text-gray-500">Please select a project to export its data.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold mb-2">Export Options</h2>
          <p className="text-sm text-gray-600">
            Export your project risk data in various formats for reporting and analysis.
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <BarChart3 className="w-8 h-8 text-blue-600 mr-3" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">CSV Export</h3>
                    <p className="text-sm text-gray-600">Structured data for analysis</p>
                  </div>
                </div>
                <p className="text-sm text-gray-700 mb-4">
                  Export comprehensive risk data with detailed columns including project info, 
                  risk details, mitigation strategies, solutions, and timestamps.
                </p>
                <ul className="text-xs text-gray-600 mb-4 space-y-1">
                  <li>• Complete risk information with calculated risk scores</li>
                  <li>• Mitigation strategy details and timelines</li>
                  <li>• Solutions and implementation data</li>
                  <li>• Properly formatted for Excel/Google Sheets</li>
                </ul>
                <Button
                  variant="primary"
                  onClick={exportToCSV}
                  isLoading={isExporting}
                  icon={<Download size={16} />}
                  className="w-full"
                >
                  Export CSV
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-emerald-50 border-emerald-200">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <FileText className="w-8 h-8 text-emerald-600 mr-3" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">PDF Report</h3>
                    <p className="text-sm text-gray-600">Professional documentation</p>
                  </div>
                </div>
                <p className="text-sm text-gray-700 mb-4">
                  Generate a comprehensive PDF report with project summary, 
                  risk analysis, and detailed mitigation strategies.
                </p>
                <ul className="text-xs text-gray-600 mb-4 space-y-1">
                  <li>• Executive summary with key metrics</li>
                  <li>• Detailed risk breakdown with priorities</li>
                  <li>• Visual risk categorization</li>
                  <li>• Ready for stakeholder presentation</li>
                </ul>
                <Button
                  variant="secondary"
                  onClick={exportToPDF}
                  isLoading={isExporting}
                  icon={<Download size={16} />}
                  className="w-full"
                >
                  Generate PDF
                </Button>
              </CardContent>
            </Card>
          </div>

          {exportSuccess && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
              <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
              <span className="text-green-800 font-medium">Export completed successfully!</span>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Project Summary</h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{currentProject.risks.length}</div>
              <div className="text-sm text-gray-600">Total Risks</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {currentProject.risks.filter(r => r.priority === 'critical').length}
              </div>
              <div className="text-sm text-gray-600">Critical</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {currentProject.risks.filter(r => r.priority === 'high').length}
              </div>
              <div className="text-sm text-gray-600">High Priority</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {currentProject.risks.filter(r => r.status === 'mitigated').length}
              </div>
              <div className="text-sm text-gray-600">Mitigated</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExportOptions;