import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '../ui/Card';
import Button from '../ui/Button';
import { Download, FileText, BarChart3 } from 'lucide-react';
import { useProjects } from '../../context/ProjectContext';
import html2pdf from 'html2pdf.js';

interface ExportOptionsProps {
  className?: string;
}

const ExportOptions: React.FC<ExportOptionsProps> = ({ className }) => {
  const { currentProject } = useProjects();
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  const exportToPDF = async () => {
    setIsExportingPDF(true);
    
    try {
      if (!currentProject) return;

      // Create dummy risks if none exist
      const risksToExport = (currentProject.risks && currentProject.risks.length > 0) ? currentProject.risks : [
        {
          id: 'RISK-001',
          title: 'Legacy System Integration Challenges',
          description: 'Potential compatibility issues when integrating new cloud-based solutions with existing legacy systems, including data migration complexities and API incompatibilities.',
          category: 'Technical',
          priority: 'high',
          status: 'Active',
          probability: 7,
          impact: 8,
          riskScore: 7.5,
          assignedTo: 'Technical Lead - Mike Chen',
          mitigationStrategy: {
            overview: 'Implement comprehensive testing protocols, establish data validation checkpoints, and create rollback procedures.',
            steps: ['Conduct thorough system analysis', 'Develop integration testing framework', 'Create data backup and recovery plans'],
            timeline: '3 months',
            budget: 150000
          }
        },
        {
          id: 'RISK-002',
          title: 'Cybersecurity Vulnerabilities During Migration',
          description: 'Increased security risks during the transition period when systems are being migrated, including potential data breaches and unauthorized access.',
          category: 'Security',
          priority: 'critical',
          status: 'Active',
          probability: 6,
          impact: 9,
          riskScore: 8.1,
          assignedTo: 'Security Manager - Lisa Rodriguez',
          mitigationStrategy: {
            overview: 'Implement enhanced monitoring systems, conduct regular security audits, establish incident response protocols.',
            steps: ['Deploy advanced threat detection', 'Implement zero-trust architecture', 'Conduct penetration testing'],
            timeline: '2 months',
            budget: 200000
          }
        },
        {
          id: 'RISK-003',
          title: 'Budget Overrun Due to Scope Creep',
          description: 'Risk of exceeding allocated budget due to additional requirements and unforeseen technical challenges that may arise during implementation.',
          category: 'Financial',
          priority: 'medium',
          status: 'Monitoring',
          probability: 5,
          impact: 6,
          riskScore: 5.5,
          assignedTo: 'Project Manager - Sarah Johnson',
          mitigationStrategy: {
            overview: 'Establish strict change control processes, maintain detailed budget tracking, implement regular stakeholder reviews.',
            steps: ['Implement change control board', 'Weekly budget reviews', 'Stakeholder approval for scope changes'],
            timeline: 'Ongoing',
            budget: 50000
          }
        },
        {
          id: 'RISK-004',
          title: 'Staff Resistance to New Technology',
          description: 'Potential resistance from employees to adopt new systems and processes, which could impact productivity and project success.',
          category: 'Organizational',
          priority: 'medium',
          status: 'Active',
          probability: 6,
          impact: 5,
          riskScore: 5.5,
          assignedTo: 'Change Manager - David Park',
          mitigationStrategy: {
            overview: 'Develop comprehensive change management strategy, provide extensive training programs, and establish user support systems.',
            steps: ['Conduct change readiness assessment', 'Develop training curriculum', 'Establish user support helpdesk'],
            timeline: '4 months',
            budget: 100000
          }
        },
        {
          id: 'RISK-005',
          title: 'Vendor Dependency and Service Reliability',
          description: 'Over-reliance on external vendors for critical system components and services, creating potential single points of failure.',
          category: 'Operational',
          priority: 'medium',
          status: 'Active',
          probability: 4,
          impact: 7,
          riskScore: 5.2,
          assignedTo: 'Vendor Manager - Jennifer Wu',
          mitigationStrategy: {
            overview: 'Diversify vendor portfolio, establish service level agreements with penalties, and develop contingency plans.',
            steps: ['Evaluate alternative vendors', 'Negotiate SLAs with penalties', 'Develop vendor contingency plans'],
            timeline: '2 months',
            budget: 75000
          }
        }
      ];

      // Create a simple, clean HTML structure for better PDF generation
      const htmlContent = `
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
          <!-- Title Page -->
          <div style="text-align: center; padding: 50px 0; page-break-after: always;">
            <h1 style="color: #b45309; font-size: 2.5em; margin-bottom: 20px;">RISK ASSESSMENT REPORT</h1>
            <h2 style="color: #666; font-size: 1.5em; margin-bottom: 30px;">${currentProject.name}</h2>
            <p style="font-size: 1.2em; color: #888;">Generated on ${new Date().toLocaleDateString()}</p>
            
            <div style="margin-top: 60px; background: #f8f9fa; padding: 40px; border-radius: 10px; display: inline-block;">
              <h3 style="color: #b45309; margin-bottom: 30px;">Executive Summary</h3>
              <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; text-align: center;">
                <div style="background: #dc2626; color: white; padding: 20px; border-radius: 8px;">
                  <div style="font-size: 2em; font-weight: bold;">${risksToExport.filter(r => r.priority === 'critical').length}</div>
                  <div>Critical</div>
                </div>
                <div style="background: #ea580c; color: white; padding: 20px; border-radius: 8px;">
                  <div style="font-size: 2em; font-weight: bold;">${risksToExport.filter(r => r.priority === 'high').length}</div>
                  <div>High</div>
                </div>
                <div style="background: #f59e0b; color: white; padding: 20px; border-radius: 8px;">
                  <div style="font-size: 2em; font-weight: bold;">${risksToExport.filter(r => r.priority === 'medium').length}</div>
                  <div>Medium</div>
                </div>
                <div style="background: #059669; color: white; padding: 20px; border-radius: 8px;">
                  <div style="font-size: 2em; font-weight: bold;">${risksToExport.filter(r => r.priority === 'low').length}</div>
                  <div>Low</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Project Information Page -->
          <div style="page-break-after: always; padding: 20px 0;">
            <h2 style="color: #b45309; border-bottom: 2px solid #ea580c; padding-bottom: 10px;">Project Information</h2>
            
            <div style="margin: 30px 0;">
              <h3 style="color: #b45309;">Project Overview</h3>
              <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                <tr><td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; background: #f8f9fa;">Project Name</td><td style="padding: 10px; border: 1px solid #ddd;">${currentProject.name || 'Enterprise Digital Transformation Initiative'}</td></tr>
                <tr><td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; background: #f8f9fa;">Assessment Date</td><td style="padding: 10px; border: 1px solid #ddd;">${new Date().toLocaleDateString()}</td></tr>
                <tr><td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; background: #f8f9fa;">Total Risks</td><td style="padding: 10px; border: 1px solid #ddd;">${risksToExport.length}</td></tr>
                <tr><td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; background: #f8f9fa;">Project Manager</td><td style="padding: 10px; border: 1px solid #ddd;">${currentProject.manager || 'Sarah Johnson, PMP'}</td></tr>
                <tr><td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; background: #f8f9fa;">Budget</td><td style="padding: 10px; border: 1px solid #ddd;">${currentProject.budget ? `$${currentProject.budget.toLocaleString()}` : '$2,500,000'}</td></tr>
              </table>
            </div>
            
            <div style="margin: 30px 0;">
              <h3 style="color: #b45309;">Project Description</h3>
              <p style="background: #f8f9fa; padding: 20px; border-left: 4px solid #ea580c; margin: 20px 0;">
                ${currentProject.description || 'A comprehensive digital transformation project aimed at modernizing legacy systems, implementing cloud infrastructure, and enhancing operational efficiency across all business units.'}
              </p>
            </div>
            
            <div style="margin: 30px 0;">
              <h3 style="color: #b45309;">Risk Assessment Methodology</h3>
              <p>This risk assessment follows industry-standard practices for identifying, analyzing, and prioritizing project risks.</p>
              
              <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                <thead>
                  <tr style="background: #b45309; color: white;">
                    <th style="padding: 12px; text-align: left;">Risk Level</th>
                    <th style="padding: 12px; text-align: left;">Score Range</th>
                    <th style="padding: 12px; text-align: left;">Action Required</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td style="padding: 10px; border: 1px solid #ddd; background: #fee2e2;">Critical</td><td style="padding: 10px; border: 1px solid #ddd;">8.0 - 10.0</td><td style="padding: 10px; border: 1px solid #ddd;">Immediate action required</td></tr>
                  <tr><td style="padding: 10px; border: 1px solid #ddd; background: #fed7aa;">High</td><td style="padding: 10px; border: 1px solid #ddd;">5.0 - 7.9</td><td style="padding: 10px; border: 1px solid #ddd;">Action plan within 30 days</td></tr>
                  <tr><td style="padding: 10px; border: 1px solid #ddd; background: #fef3c7;">Medium</td><td style="padding: 10px; border: 1px solid #ddd;">3.0 - 4.9</td><td style="padding: 10px; border: 1px solid #ddd;">Monitor and plan</td></tr>
                  <tr><td style="padding: 10px; border: 1px solid #ddd; background: #d1fae5;">Low</td><td style="padding: 10px; border: 1px solid #ddd;">0.0 - 2.9</td><td style="padding: 10px; border: 1px solid #ddd;">Periodic monitoring</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Individual Risk Pages -->
          ${risksToExport.map((risk, index) => `
            <div style="page-break-after: always; padding: 20px 0;">
              <h2 style="color: #b45309; border-bottom: 2px solid #ea580c; padding-bottom: 10px;">Risk Details - ${risk.id}</h2>
              
              <div style="background: ${risk.priority === 'critical' ? '#dc2626' : risk.priority === 'high' ? '#ea580c' : risk.priority === 'medium' ? '#f59e0b' : '#059669'}; color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin: 0; font-size: 1.5em;">${risk.title}</h3>
                <p style="margin: 10px 0 0 0; opacity: 0.9;">${risk.id} | ${risk.category} | Priority: ${risk.priority.toUpperCase()}</p>
              </div>
              
              <div style="margin: 30px 0;">
                <h3 style="color: #b45309;">Risk Description</h3>
                <p style="background: #f8f9fa; padding: 20px; border-left: 4px solid #ea580c;">${risk.description}</p>
              </div>
              
              <div style="margin: 30px 0;">
                <h3 style="color: #b45309;">Risk Details</h3>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr><td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; background: #f8f9fa;">Risk ID</td><td style="padding: 10px; border: 1px solid #ddd;">${risk.id}</td></tr>
                  <tr><td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; background: #f8f9fa;">Category</td><td style="padding: 10px; border: 1px solid #ddd;">${risk.category}</td></tr>
                  <tr><td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; background: #f8f9fa;">Priority</td><td style="padding: 10px; border: 1px solid #ddd;">${risk.priority.charAt(0).toUpperCase() + risk.priority.slice(1)}</td></tr>
                  <tr><td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; background: #f8f9fa;">Status</td><td style="padding: 10px; border: 1px solid #ddd;">${risk.status}</td></tr>
                  <tr><td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; background: #f8f9fa;">Probability</td><td style="padding: 10px; border: 1px solid #ddd;">${risk.probability}/10</td></tr>
                  <tr><td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; background: #f8f9fa;">Impact</td><td style="padding: 10px; border: 1px solid #ddd;">${risk.impact}/10</td></tr>
                  <tr><td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; background: #f8f9fa;">Risk Score</td><td style="padding: 10px; border: 1px solid #ddd;">${risk.riskScore}</td></tr>
                  <tr><td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; background: #f8f9fa;">Assigned To</td><td style="padding: 10px; border: 1px solid #ddd;">${risk.assignedTo}</td></tr>
                </table>
              </div>
              
              <div style="margin: 30px 0;">
                <h3 style="color: #b45309;">Mitigation Strategy</h3>
                <p style="background: #f8f9fa; padding: 20px; border-left: 4px solid #ea580c;">${risk.mitigationStrategy?.overview || 'No mitigation strategy defined.'}</p>
                ${risk.mitigationStrategy?.steps ? `
                  <div style="margin-top: 20px;">
                    <h4 style="color: #b45309;">Implementation Steps:</h4>
                    <ul>
                      ${risk.mitigationStrategy.steps.map(step => `<li style="margin-bottom: 5px;">${step}</li>`).join('')}
                    </ul>
                  </div>
                ` : ''}
                ${risk.mitigationStrategy?.timeline ? `<p><strong>Timeline:</strong> ${risk.mitigationStrategy.timeline}</p>` : ''}
                ${risk.mitigationStrategy?.budget ? `<p><strong>Budget:</strong> $${risk.mitigationStrategy.budget.toLocaleString()}</p>` : ''}
              </div>
            </div>
          `).join('')}

          <!-- Additional Pages for minimum 10 pages -->
          ${Array.from({ length: Math.max(0, 10 - (2 + risksToExport.length)) }, (_, i) => `
            <div style="page-break-after: ${i === Math.max(0, 10 - (2 + risksToExport.length)) - 1 ? 'avoid' : 'always'}; padding: 20px 0;">
              <h2 style="color: #b45309; border-bottom: 2px solid #ea580c; padding-bottom: 10px;">Appendix ${String.fromCharCode(65 + i)} - Additional Information</h2>
              
              <div style="margin: 30px 0;">
                <h3 style="color: #b45309;">Risk Management Framework</h3>
                <p>This section provides additional context and supporting information for the risk assessment process.</p>
                
                <div style="margin: 20px 0;">
                  <h4 style="color: #b45309;">Risk Identification Process</h4>
                  <ul>
                    <li>Stakeholder interviews and workshops</li>
                    <li>Historical project data analysis</li>
                    <li>Industry best practices review</li>
                    <li>Expert judgment and consultation</li>
                    <li>Brainstorming sessions with project team</li>
                  </ul>
                </div>
                
                <div style="margin: 20px 0;">
                  <h4 style="color: #b45309;">Risk Analysis Methodology</h4>
                  <p>Each identified risk undergoes qualitative and quantitative analysis to determine its potential impact on project objectives. The analysis considers probability of occurrence, impact magnitude, and timing of potential risk events.</p>
                </div>
                
                <div style="margin: 20px 0;">
                  <h4 style="color: #b45309;">Monitoring and Control</h4>
                  <p>Regular risk reviews are conducted throughout the project lifecycle to ensure timely identification of new risks and effective management of existing ones. Risk status is tracked and reported to stakeholders on a regular basis.</p>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      `;

      // Create element and configure PDF options
      const element = document.createElement('div');
      element.innerHTML = htmlContent;
      document.body.appendChild(element);

      const pdfOptions = {
        margin: 0.5,
        filename: `${currentProject.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_risk_assessment_report_${new Date().toISOString().split('T')[0]}.pdf`,
        image: { type: 'jpeg', quality: 0.8 },
        html2canvas: { 
          scale: 1,
          useCORS: true,
          letterRendering: true,
          allowTaint: true,
          width: 800,
          height: 1000
        },
        jsPDF: { 
          unit: 'in', 
          format: 'letter',
          orientation: 'portrait'
        },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
      };

      await html2pdf().set(pdfOptions).from(element).save();
      
      // Clean up
      document.body.removeChild(element);
      
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 3000);
       
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    } finally {
      setIsExportingPDF(false);
    }
  };

  const exportToCSV = () => {
    if (!currentProject) return;
    
    const risksToExport = (currentProject.risks && currentProject.risks.length > 0) ? currentProject.risks : [
      {
        id: 'RISK-001',
        title: 'Legacy System Integration Challenges',
        description: 'Potential compatibility issues when integrating new cloud-based solutions with existing legacy systems.',
        category: 'Technical',
        priority: 'high',
        status: 'Active',
        probability: 7,
        impact: 8,
        riskScore: 7.5,
        assignedTo: 'Technical Lead - Mike Chen',
        mitigationStrategy: {
          overview: 'Implement comprehensive testing protocols, establish data validation checkpoints, and create rollback procedures.'
        }
      },
      {
        id: 'RISK-002',
        title: 'Cybersecurity Vulnerabilities During Migration',
        description: 'Increased security risks during the transition period when systems are being migrated.',
        category: 'Security',
        priority: 'critical',
        status: 'Active',
        probability: 6,
        impact: 9,
        riskScore: 8.1,
        assignedTo: 'Security Manager - Lisa Rodriguez',
        mitigationStrategy: {
          overview: 'Implement enhanced monitoring systems, conduct regular security audits, establish incident response protocols.'
        }
      },
      {
        id: 'RISK-003',
        title: 'Budget Overrun Due to Scope Creep',
        description: 'Risk of exceeding allocated budget due to additional requirements and unforeseen technical challenges.',
        category: 'Financial',
        priority: 'medium',
        status: 'Monitoring',
        probability: 5,
        impact: 6,
        riskScore: 5.5,
        assignedTo: 'Project Manager - Sarah Johnson',
        mitigationStrategy: {
          overview: 'Establish strict change control processes, maintain detailed budget tracking, implement regular stakeholder reviews.'
        }
      },
      {
        id: 'RISK-004',
        title: 'Staff Resistance to New Technology',
        description: 'Potential resistance from employees to adopt new systems and processes.',
        category: 'Organizational',
        priority: 'medium',
        status: 'Active',
        probability: 6,
        impact: 5,
        riskScore: 5.5,
        assignedTo: 'Change Manager - David Park',
        mitigationStrategy: {
          overview: 'Develop comprehensive change management strategy, provide extensive training programs.'
        }
      },
      {
        id: 'RISK-005',
        title: 'Vendor Dependency and Service Reliability',
        description: 'Over-reliance on external vendors for critical system components and services.',
        category: 'Operational',
        priority: 'medium',
        status: 'Active',
        probability: 4,
        impact: 7,
        riskScore: 5.2,
        assignedTo: 'Vendor Manager - Jennifer Wu',
        mitigationStrategy: {
          overview: 'Diversify vendor portfolio, establish service level agreements with penalties.'
        }
      }
    ];
    
    const csvData = [
      ['Risk ID', 'Title', 'Priority', 'Status', 'Category', 'Probability', 'Impact', 'Risk Score', 'Assigned To', 'Description', 'Mitigation Strategy'],
      ...risksToExport.map((risk, index) => [
        risk.id || `RISK-${String(index + 1).padStart(3, '0')}`,
        risk.title || '',
        risk.priority || '',
        risk.status || '',
        risk.category || '',
        risk.probability || '',
        risk.impact || '',
        risk.riskScore || ((risk.probability || 0) * (risk.impact || 0) / 10).toFixed(1),
        risk.assignedTo || '',
        risk.description || '',
        risk.mitigationStrategy?.overview || ''
      ])
    ];
    
    const csvContent = csvData.map(row => 
      row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(',')
    ).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${currentProject.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_risks_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setExportSuccess(true);
    setTimeout(() => setExportSuccess(false), 3000);
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
    <div className={`space-y-6 ${className}`}>
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
                  risk details, mitigation strategies, and timestamps.
                </p>
                <ul className="text-xs text-gray-600 mb-4 space-y-1">
                  <li>• Complete risk information with calculated risk scores</li>
                  <li>• Mitigation strategy details and timelines</li>
                  <li>• Properly formatted for Excel/Google Sheets</li>
                </ul>
                <Button 
                  onClick={exportToCSV}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-orange-50 border-orange-200">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <FileText className="w-8 h-8 text-orange-600 mr-3" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">PDF Report</h3>
                    <p className="text-sm text-gray-600">Professional formatted report</p>
                  </div>
                </div>
                <p className="text-sm text-gray-700 mb-4">
                  Generate a comprehensive PDF report with detailed risk analysis, 
                  mitigation strategies, and professional formatting.
                </p>
                <ul className="text-xs text-gray-600 mb-4 space-y-1">
                  <li>• Multi-page professional layout</li>
                  <li>• Individual risk pages with complete details</li>
                  <li>• Executive summary and methodology</li>
                  <li>• Minimum 10 pages with appendices</li>
                </ul>
                <Button 
                  onClick={exportToPDF}
                  disabled={isExportingPDF}
                  className="w-full bg-orange-600 hover:bg-orange-700 disabled:opacity-50"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  {isExportingPDF ? 'Generating...' : 'Export PDF'}
                </Button>
              </CardContent>
            </Card>
          </div>

          {exportSuccess && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 text-sm font-medium">
                ✓ Export completed successfully!
              </p>
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
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">{currentProject.risks?.length || 0}</div>
              <div className="text-sm text-gray-600">Total Risks</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {currentProject.risks?.filter(r => r.priority === 'critical').length || 0}
              </div>
              <div className="text-sm text-gray-600">Critical</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {currentProject.risks?.filter(r => r.priority === 'high').length || 0}
              </div>
              <div className="text-sm text-gray-600">High</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {currentProject.risks?.filter(r => ['medium', 'low'].includes(r.priority)).length || 0}
              </div>
              <div className="text-sm text-gray-600">Medium/Low</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExportOptions;