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
      // Define CSV headers
      const headers = [
        'Project Name',
        'Project Description',
        'Risk ID',
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

        const row = [
          currentProject.name,
          currentProject.description,
          risk.id,
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

    const element = document.createElement('div');
    element.innerHTML = `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 800px;">
        <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #3B82F6; padding-bottom: 20px;">
          <h1 style="color: #1F2937; margin: 0; font-size: 28px;">${currentProject.name}</h1>
          <p style="color: #6B7280; margin: 10px 0 0 0; font-size: 16px;">${currentProject.description}</p>
          <p style="color: #9CA3AF; margin: 5px 0 0 0; font-size: 14px;">
            Generated on ${formatDate(new Date())} | Total Risks: ${currentProject.risks.length}
          </p>
        </div>

        <div style="margin-bottom: 30px;">
          <h2 style="color: #1F2937; margin-bottom: 15px; font-size: 20px;">Project Summary</h2>
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-bottom: 20px;">
            <div style="background: #F3F4F6; padding: 15px; border-radius: 8px;">
              <h3 style="margin: 0 0 5px 0; color: #374151; font-size: 14px;">Total Risks</h3>
              <p style="margin: 0; font-size: 24px; font-weight: bold; color: #1F2937;">${currentProject.risks.length}</p>
            </div>
            <div style="background: #FEF2F2; padding: 15px; border-radius: 8px;">
              <h3 style="margin: 0 0 5px 0; color: #374151; font-size: 14px;">Critical Risks</h3>
              <p style="margin: 0; font-size: 24px; font-weight: bold; color: #DC2626;">${currentProject.risks.filter(r => r.priority === 'critical').length}</p>
            </div>
            <div style="background: #FEF3C7; padding: 15px; border-radius: 8px;">
              <h3 style="margin: 0 0 5px 0; color: #374151; font-size: 14px;">High Risks</h3>
              <p style="margin: 0; font-size: 24px; font-weight: bold; color: #D97706;">${currentProject.risks.filter(r => r.priority === 'high').length}</p>
            </div>
            <div style="background: #ECFDF5; padding: 15px; border-radius: 8px;">
              <h3 style="margin: 0 0 5px 0; color: #374151; font-size: 14px;">Mitigated</h3>
              <p style="margin: 0; font-size: 24px; font-weight: bold; color: #059669;">${currentProject.risks.filter(r => r.status === 'mitigated').length}</p>
            </div>
          </div>
        </div>

        <div>
          <h2 style="color: #1F2937; margin-bottom: 20px; font-size: 20px;">Risk Details</h2>
          ${currentProject.risks.map(risk => `
            <div style="margin-bottom: 25px; border: 1px solid #E5E7EB; border-radius: 8px; padding: 20px; page-break-inside: avoid;">
              <div style="margin-bottom: 15px;">
                <h3 style="margin: 0 0 8px 0; color: #1F2937; font-size: 18px;">${risk.title}</h3>
                <div style="display: flex; gap: 10px; margin-bottom: 10px;">
                  <span style="background: #3B82F6; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; text-transform: capitalize;">${risk.category}</span>
                  <span style="background: ${risk.priority === 'critical' ? '#DC2626' : risk.priority === 'high' ? '#D97706' : risk.priority === 'medium' ? '#CA8A04' : '#059669'}; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; text-transform: capitalize;">${risk.priority}</span>
                  <span style="background: #6366F1; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; text-transform: capitalize;">${risk.status}</span>
                </div>
              </div>
              
              <p style="margin: 0 0 15px 0; color: #4B5563; line-height: 1.5;">${risk.description}</p>
              
              <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-bottom: 15px;">
                <div>
                  <strong style="color: #374151; font-size: 14px;">Probability:</strong>
                  <span style="color: #6B7280; margin-left: 5px;">${risk.probability}/10</span>
                </div>
                <div>
                  <strong style="color: #374151; font-size: 14px;">Impact:</strong>
                  <span style="color: #6B7280; margin-left: 5px;">${risk.impact}/10</span>
                </div>
                <div>
                  <strong style="color: #374151; font-size: 14px;">Risk Score:</strong>
                  <span style="color: #6B7280; margin-left: 5px;">${risk.probability * risk.impact}</span>
                </div>
              </div>
              
              ${risk.assignedTo ? `
                <div style="margin-bottom: 15px;">
                  <strong style="color: #374151; font-size: 14px;">Assigned To:</strong>
                  <span style="color: #6B7280; margin-left: 5px;">${risk.assignedTo}</span>
                </div>
              ` : ''}
              
              ${risk.tags.length > 0 ? `
                <div style="margin-bottom: 15px;">
                  <strong style="color: #374151; font-size: 14px;">Tags:</strong>
                  <span style="color: #6B7280; margin-left: 5px;">${risk.tags.join(', ')}</span>
                </div>
              ` : ''}
              
              ${risk.mitigationStrategy ? `
                <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #E5E7EB;">
                  <h4 style="margin: 0 0 10px 0; color: #1F2937; font-size: 16px;">Mitigation Strategy</h4>
                  <p style="margin: 0 0 10px 0; color: #4B5563; font-size: 14px;">${risk.mitigationStrategy.overview}</p>
                  ${risk.mitigationStrategy.responsibleRoles.length > 0 ? `
                    <div style="margin-bottom: 10px;">
                      <strong style="color: #374151; font-size: 13px;">Responsible Roles:</strong>
                      <ul style="margin: 5px 0 0 0; padding-left: 20px; color: #6B7280; font-size: 13px;">
                        ${risk.mitigationStrategy.responsibleRoles.map(role => `<li>${role.role}</li>`).join('')}
                      </ul>
                    </div>
                  ` : ''}
                </div>
              ` : ''}
            </div>
          `).join('')}
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #3B82F6; text-align: center; color: #6B7280; font-size: 12px;">
          <p style="margin: 0;">Generated by RiskVision - Intelligent Risk Management Platform</p>
        </div>
      </div>
    `;

    const opt = {
      margin: 0.5,
      filename: `${currentProject.name.replace(/[^a-z0-9]/gi, '_')}_risk_report.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
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

  const generateSummaryReport = () => {
    if (!currentProject) return '';

    const totalRisks = currentProject.risks.length;
    const criticalRisks = currentProject.risks.filter(r => r.priority === 'critical').length;
    const highRisks = currentProject.risks.filter(r => r.priority === 'high').length;
    const openRisks = currentProject.risks.filter(r => r.status === 'open').length;
    const mitigatedRisks = currentProject.risks.filter(r => r.status === 'mitigated').length;
    const closedRisks = currentProject.risks.filter(r => r.status === 'closed').length;

    return `
Project: ${currentProject.name}
Total Risks: ${totalRisks}
Critical: ${criticalRisks} | High: ${highRisks}
Open: ${openRisks} | Mitigated: ${mitigatedRisks} | Closed: ${closedRisks}
    `.trim();
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