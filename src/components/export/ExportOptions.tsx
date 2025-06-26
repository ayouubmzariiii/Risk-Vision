import React, { useState } from 'react';
import { useProjects } from '../../context/ProjectContext';
import Button from '../ui/Button';
import { FileDown, File as FilePdf, FileSpreadsheet } from 'lucide-react';
import html2pdf from 'html2pdf.js';
import { Risk } from '../../types';

const ExportOptions: React.FC = () => {
  const { currentProject } = useProjects();
  const [exporting, setExporting] = useState(false);
  
  if (!currentProject) return null;

  const generateRiskReport = (risk: Risk) => {
    const container = document.createElement('div');
    container.innerHTML = `
      <div style="
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        line-height: 1.6;
        color: #2d3748;
        max-width: 210mm;
        margin: 0 auto;
        padding: 20mm;
        background: white;
      ">
        <!-- Header -->
        <div style="
          text-align: center;
          margin-bottom: 40px;
          padding-bottom: 20px;
          border-bottom: 3px solid #3182ce;
        ">
          <h1 style="
            font-size: 28px;
            font-weight: 700;
            color: #1a202c;
            margin: 0 0 10px 0;
            letter-spacing: -0.5px;
          ">Risk Assessment Report</h1>
          <h2 style="
            font-size: 20px;
            font-weight: 600;
            color: #3182ce;
            margin: 0 0 15px 0;
          ">${risk.title}</h2>
          <p style="
            color: #718096;
            font-size: 14px;
            margin: 0;
          ">Generated on ${new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</p>
        </div>

        <!-- Risk Overview Card -->
        <div style="
          background: #f7fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 25px;
          margin-bottom: 30px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        ">
          <h3 style="
            font-size: 18px;
            font-weight: 600;
            color: #1a202c;
            margin: 0 0 20px 0;
            display: flex;
            align-items: center;
          ">
            <span style="
              display: inline-block;
              width: 4px;
              height: 20px;
              background: #3182ce;
              margin-right: 12px;
              border-radius: 2px;
            "></span>
            Risk Overview
          </h3>
          
          <div style="
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 25px;
            margin-bottom: 20px;
          ">
            <div>
              <div style="margin-bottom: 12px;">
                <span style="font-weight: 600; color: #4a5568;">Category:</span>
                <span style="
                  margin-left: 8px;
                  padding: 4px 12px;
                  background: #bee3f8;
                  color: #2c5282;
                  border-radius: 20px;
                  font-size: 13px;
                  font-weight: 500;
                ">${risk.category}</span>
              </div>
              <div style="margin-bottom: 12px;">
                <span style="font-weight: 600; color: #4a5568;">Priority:</span>
                <span style="
                  margin-left: 8px;
                  padding: 4px 12px;
                  background: ${
                    risk.priority === 'critical' ? '#fed7d7' :
                    risk.priority === 'high' ? '#feebc8' :
                    risk.priority === 'medium' ? '#fefcbf' :
                    '#c6f6d5'
                  };
                  color: ${
                    risk.priority === 'critical' ? '#c53030' :
                    risk.priority === 'high' ? '#dd6b20' :
                    risk.priority === 'medium' ? '#d69e2e' :
                    '#38a169'
                  };
                  border-radius: 20px;
                  font-size: 13px;
                  font-weight: 600;
                  text-transform: uppercase;
                ">${risk.priority}</span>
              </div>
              <div style="margin-bottom: 12px;">
                <span style="font-weight: 600; color: #4a5568;">Status:</span>
                <span style="
                  margin-left: 8px;
                  padding: 4px 12px;
                  background: ${
                    risk.status === 'open' ? '#bee3f8' :
                    risk.status === 'mitigated' ? '#d6f5d6' :
                    '#e2e8f0'
                  };
                  color: ${
                    risk.status === 'open' ? '#2c5282' :
                    risk.status === 'mitigated' ? '#276749' :
                    '#4a5568'
                  };
                  border-radius: 20px;
                  font-size: 13px;
                  font-weight: 500;
                  text-transform: capitalize;
                ">${risk.status}</span>
              </div>
            </div>
            <div>
              <div style="margin-bottom: 12px;">
                <span style="font-weight: 600; color: #4a5568;">Probability:</span>
                <span style="margin-left: 8px; font-weight: 600; color: #1a202c;">${risk.probability}/10</span>
                <div style="
                  width: 100px;
                  height: 6px;
                  background: #e2e8f0;
                  border-radius: 3px;
                  margin-top: 4px;
                  overflow: hidden;
                ">
                  <div style="
                    width: ${risk.probability * 10}%;
                    height: 100%;
                    background: linear-gradient(90deg, #48bb78, #38a169);
                    border-radius: 3px;
                  "></div>
                </div>
              </div>
              <div style="margin-bottom: 12px;">
                <span style="font-weight: 600; color: #4a5568;">Impact:</span>
                <span style="margin-left: 8px; font-weight: 600; color: #1a202c;">${risk.impact}/10</span>
                <div style="
                  width: 100px;
                  height: 6px;
                  background: #e2e8f0;
                  border-radius: 3px;
                  margin-top: 4px;
                  overflow: hidden;
                ">
                  <div style="
                    width: ${risk.impact * 10}%;
                    height: 100%;
                    background: linear-gradient(90deg, #f56565, #e53e3e);
                    border-radius: 3px;
                  "></div>
                </div>
              </div>
              <div style="margin-bottom: 12px;">
                <span style="font-weight: 600; color: #4a5568;">Assigned To:</span>
                <span style="margin-left: 8px; color: #1a202c;">${risk.assignedTo || 'Not assigned'}</span>
              </div>
            </div>
          </div>
          
          <div style="
            padding-top: 20px;
            border-top: 1px solid #e2e8f0;
          ">
            <h4 style="
              font-weight: 600;
              color: #1a202c;
              margin: 0 0 10px 0;
              font-size: 16px;
            ">Description</h4>
            <p style="
              color: #4a5568;
              margin: 0;
              line-height: 1.7;
            ">${risk.description}</p>
          </div>
        </div>

        ${risk.mitigationStrategy ? `
          <!-- Mitigation Strategy -->
          <div style="
            background: white;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 25px;
            margin-bottom: 30px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          ">
            <h3 style="
              font-size: 18px;
              font-weight: 600;
              color: #1a202c;
              margin: 0 0 20px 0;
              display: flex;
              align-items: center;
            ">
              <span style="
                display: inline-block;
                width: 4px;
                height: 20px;
                background: #38a169;
                margin-right: 12px;
                border-radius: 2px;
              "></span>
              Mitigation Strategy
            </h3>
            
            <div style="
              background: #f0fff4;
              border-left: 4px solid #38a169;
              padding: 20px;
              margin-bottom: 25px;
              border-radius: 0 8px 8px 0;
            ">
              <p style="
                color: #1a202c;
                margin: 0;
                line-height: 1.7;
                font-weight: 500;
              ">${risk.mitigationStrategy.overview}</p>
            </div>
            
            <!-- Responsible Roles -->
            <div style="margin-bottom: 25px;">
              <h4 style="
                font-size: 16px;
                font-weight: 600;
                color: #2d3748;
                margin: 0 0 15px 0;
                display: flex;
                align-items: center;
              ">
                <span style="
                  display: inline-block;
                  width: 20px;
                  height: 20px;
                  background: #3182ce;
                  border-radius: 50%;
                  margin-right: 10px;
                  position: relative;
                ">
                  <span style="
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    color: white;
                    font-size: 12px;
                    font-weight: bold;
                  ">👥</span>
                </span>
                Responsible Roles
              </h4>
              ${risk.mitigationStrategy.responsibleRoles.map(role => `
                <div style="
                  background: #f8fafc;
                  border: 1px solid #e2e8f0;
                  border-radius: 8px;
                  padding: 15px;
                  margin-bottom: 12px;
                ">
                  <h5 style="
                    font-weight: 600;
                    color: #2d3748;
                    margin: 0 0 8px 0;
                    font-size: 14px;
                  ">${role.role}</h5>
                  <ul style="
                    margin: 0;
                    padding-left: 20px;
                    color: #4a5568;
                  ">
                    ${role.responsibilities.map(resp => `
                      <li style="margin-bottom: 4px; line-height: 1.5;">${resp}</li>
                    `).join('')}
                  </ul>
                </div>
              `).join('')}
            </div>
            
            <!-- Timeline -->
            <div style="margin-bottom: 25px;">
              <h4 style="
                font-size: 16px;
                font-weight: 600;
                color: #2d3748;
                margin: 0 0 15px 0;
                display: flex;
                align-items: center;
              ">
                <span style="
                  display: inline-block;
                  width: 20px;
                  height: 20px;
                  background: #ed8936;
                  border-radius: 50%;
                  margin-right: 10px;
                  position: relative;
                ">
                  <span style="
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    color: white;
                    font-size: 12px;
                    font-weight: bold;
                  ">⏱</span>
                </span>
                Implementation Timeline
              </h4>
              ${risk.mitigationStrategy.timeline.map((phase, index) => `
                <div style="
                  position: relative;
                  padding-left: 30px;
                  margin-bottom: 20px;
                ">
                  <div style="
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 20px;
                    height: 20px;
                    background: #4299e1;
                    border-radius: 50%;
                    color: white;
                    font-size: 10px;
                    font-weight: bold;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                  ">${index + 1}</div>
                  <div style="
                    background: white;
                    border: 1px solid #e2e8f0;
                    border-radius: 8px;
                    padding: 15px;
                  ">
                    <h5 style="
                      font-weight: 600;
                      color: #2d3748;
                      margin: 0 0 5px 0;
                      font-size: 14px;
                    ">${phase.phase}</h5>
                    <p style="
                      color: #718096;
                      margin: 0 0 10px 0;
                      font-size: 13px;
                      font-weight: 500;
                    ">Duration: ${phase.duration}</p>
                    <ul style="
                      margin: 0;
                      padding-left: 20px;
                      color: #4a5568;
                    ">
                      ${phase.activities.map(activity => `
                        <li style="margin-bottom: 4px; line-height: 1.5;">${activity}</li>
                      `).join('')}
                    </ul>
                  </div>
                </div>
              `).join('')}
            </div>
            
            <!-- Success Metrics -->
            <div style="margin-bottom: 25px;">
              <h4 style="
                font-size: 16px;
                font-weight: 600;
                color: #2d3748;
                margin: 0 0 15px 0;
                display: flex;
                align-items: center;
              ">
                <span style="
                  display: inline-block;
                  width: 20px;
                  height: 20px;
                  background: #38a169;
                  border-radius: 50%;
                  margin-right: 10px;
                  position: relative;
                ">
                  <span style="
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    color: white;
                    font-size: 12px;
                    font-weight: bold;
                  ">🎯</span>
                </span>
                Success Metrics
              </h4>
              <div style="
                background: #f0fff4;
                border: 1px solid #c6f6d5;
                border-radius: 8px;
                padding: 15px;
              ">
                <ul style="
                  margin: 0;
                  padding-left: 20px;
                  color: #276749;
                ">
                  ${risk.mitigationStrategy.successMetrics.map(metric => `
                    <li style="margin-bottom: 8px; line-height: 1.6; font-weight: 500;">${metric}</li>
                  `).join('')}
                </ul>
              </div>
            </div>
            
            <!-- Cost Implications -->
            <div>
              <h4 style="
                font-size: 16px;
                font-weight: 600;
                color: #2d3748;
                margin: 0 0 15px 0;
                display: flex;
                align-items: center;
              ">
                <span style="
                  display: inline-block;
                  width: 20px;
                  height: 20px;
                  background: #d69e2e;
                  border-radius: 50%;
                  margin-right: 10px;
                  position: relative;
                ">
                  <span style="
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    color: white;
                    font-size: 12px;
                    font-weight: bold;
                  ">💰</span>
                </span>
                Cost Implications
              </h4>
              <div style="
                background: #fffbeb;
                border: 1px solid #f6e05e;
                border-radius: 8px;
                padding: 15px;
              ">
                ${risk.mitigationStrategy.costImplications.map(cost => `
                  <div style="
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 8px 0;
                    border-bottom: 1px solid #f6e05e;
                    margin-bottom: 8px;
                  ">
                    <span style="color: #744210; font-weight: 500;">${cost.item}</span>
                    <span style="color: #744210; font-weight: 600;">${cost.estimate}</span>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        ` : ''}
        
        ${risk.solutions && risk.solutions.length > 0 ? `
          <!-- Solutions -->
          <div style="
            background: white;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 25px;
            margin-bottom: 30px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          ">
            <h3 style="
              font-size: 18px;
              font-weight: 600;
              color: #1a202c;
              margin: 0 0 20px 0;
              display: flex;
              align-items: center;
            ">
              <span style="
                display: inline-block;
                width: 4px;
                height: 20px;
                background: #805ad5;
                margin-right: 12px;
                border-radius: 2px;
              "></span>
              Proposed Solutions
            </h3>
            ${risk.solutions.map((solution, index) => `
              <div style="
                background: #faf5ff;
                border: 1px solid #e9d8fd;
                border-radius: 8px;
                padding: 20px;
                margin-bottom: 15px;
                position: relative;
              ">
                <div style="
                  position: absolute;
                  top: -10px;
                  left: 20px;
                  background: #805ad5;
                  color: white;
                  width: 24px;
                  height: 24px;
                  border-radius: 50%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-size: 12px;
                  font-weight: bold;
                ">${index + 1}</div>
                <p style="
                  color: #553c9a;
                  margin: 10px 0 0 0;
                  line-height: 1.7;
                  font-weight: 500;
                ">${solution}</p>
              </div>
            `).join('')}
          </div>
        ` : ''}
        
        <!-- Footer -->
        <div style="
          text-align: center;
          padding-top: 30px;
          border-top: 1px solid #e2e8f0;
          color: #718096;
          font-size: 12px;
        ">
          <p style="margin: 0;">
            This report was generated by RiskVision - Intelligent Risk Management
          </p>
          <p style="margin: 5px 0 0 0;">
            © ${new Date().getFullYear()} RiskVision. All rights reserved.
          </p>
        </div>
      </div>
    `;
    
    // Generate PDF
    document.body.appendChild(container);
    
    const options = {
      margin: [10, 10, 10, 10],
      filename: `Risk_Report_${risk.title.replace(/\s+/g, '_')}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2,
        useCORS: true,
        letterRendering: true
      },
      jsPDF: { 
        unit: 'mm', 
        format: 'a4', 
        orientation: 'portrait',
        compress: true
      }
    };
    
    html2pdf().from(container).set(options).save().then(() => {
      document.body.removeChild(container);
    });
  };
  
  const exportToPDF = () => {
    setExporting(true);
    
    // Create a temporary container
    const container = document.createElement('div');
    container.innerHTML = `
      <div style="
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        line-height: 1.6;
        color: #2d3748;
        max-width: 210mm;
        margin: 0 auto;
        padding: 20mm;
        background: white;
      ">
        <!-- Cover Page -->
        <div style="
          text-align: center;
          margin-bottom: 60px;
          padding: 40px 0;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-radius: 16px;
          margin: -20mm -20mm 40px -20mm;
          padding: 60px 20mm;
        ">
          <div style="
            background: rgba(255,255,255,0.1);
            border-radius: 50%;
            width: 80px;
            height: 80px;
            margin: 0 auto 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 36px;
          ">🛡️</div>
          <h1 style="
            font-size: 36px;
            font-weight: 700;
            margin: 0 0 15px 0;
            letter-spacing: -1px;
          ">Risk Assessment Report</h1>
          <h2 style="
            font-size: 24px;
            font-weight: 400;
            margin: 0 0 30px 0;
            opacity: 0.9;
          ">${currentProject.name}</h2>
          <div style="
            background: rgba(255,255,255,0.2);
            border-radius: 8px;
            padding: 20px;
            display: inline-block;
          ">
            <p style="
              font-size: 16px;
              margin: 0 0 10px 0;
              opacity: 0.9;
            ">${currentProject.description}</p>
            <p style="
              font-size: 14px;
              margin: 0;
              opacity: 0.8;
            ">Generated on ${new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</p>
          </div>
        </div>

        <!-- Executive Summary -->
        <div style="
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 30px;
          margin-bottom: 40px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.05);
        ">
          <h2 style="
            font-size: 24px;
            font-weight: 700;
            color: #1a202c;
            margin: 0 0 25px 0;
            display: flex;
            align-items: center;
          ">
            <span style="
              display: inline-block;
              width: 6px;
              height: 30px;
              background: #3182ce;
              margin-right: 15px;
              border-radius: 3px;
            "></span>
            Executive Summary
          </h2>
          
          <div style="
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 30px;
            margin-bottom: 25px;
          ">
            <div style="
              background: white;
              border-radius: 12px;
              padding: 25px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.05);
              border-left: 4px solid #3182ce;
            ">
              <h3 style="
                font-size: 16px;
                font-weight: 600;
                color: #2d3748;
                margin: 0 0 15px 0;
              ">Risk Status Overview</h3>
              <div style="margin-bottom: 12px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <span style="color: #4a5568; font-weight: 500;">Total Risks</span>
                  <span style="
                    background: #3182ce;
                    color: white;
                    padding: 4px 12px;
                    border-radius: 20px;
                    font-weight: 600;
                    font-size: 14px;
                  ">${currentProject.risks.length}</span>
                </div>
              </div>
              <div style="margin-bottom: 12px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <span style="color: #4a5568; font-weight: 500;">Open</span>
                  <span style="
                    background: #fed7d7;
                    color: #c53030;
                    padding: 4px 12px;
                    border-radius: 20px;
                    font-weight: 600;
                    font-size: 14px;
                  ">${currentProject.risks.filter(r => r.status === 'open').length}</span>
                </div>
              </div>
              <div style="margin-bottom: 12px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <span style="color: #4a5568; font-weight: 500;">Mitigated</span>
                  <span style="
                    background: #c6f6d5;
                    color: #276749;
                    padding: 4px 12px;
                    border-radius: 20px;
                    font-weight: 600;
                    font-size: 14px;
                  ">${currentProject.risks.filter(r => r.status === 'mitigated').length}</span>
                </div>
              </div>
              <div>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <span style="color: #4a5568; font-weight: 500;">Closed</span>
                  <span style="
                    background: #e2e8f0;
                    color: #4a5568;
                    padding: 4px 12px;
                    border-radius: 20px;
                    font-weight: 600;
                    font-size: 14px;
                  ">${currentProject.risks.filter(r => r.status === 'closed').length}</span>
                </div>
              </div>
            </div>
            
            <div style="
              background: white;
              border-radius: 12px;
              padding: 25px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.05);
              border-left: 4px solid #e53e3e;
            ">
              <h3 style="
                font-size: 16px;
                font-weight: 600;
                color: #2d3748;
                margin: 0 0 15px 0;
              ">Priority Distribution</h3>
              <div style="margin-bottom: 12px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <span style="color: #4a5568; font-weight: 500;">Critical</span>
                  <span style="
                    background: #fed7d7;
                    color: #c53030;
                    padding: 4px 12px;
                    border-radius: 20px;
                    font-weight: 600;
                    font-size: 14px;
                  ">${currentProject.risks.filter(r => r.priority === 'critical').length}</span>
                </div>
              </div>
              <div style="margin-bottom: 12px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <span style="color: #4a5568; font-weight: 500;">High</span>
                  <span style="
                    background: #feebc8;
                    color: #dd6b20;
                    padding: 4px 12px;
                    border-radius: 20px;
                    font-weight: 600;
                    font-size: 14px;
                  ">${currentProject.risks.filter(r => r.priority === 'high').length}</span>
                </div>
              </div>
              <div style="margin-bottom: 12px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <span style="color: #4a5568; font-weight: 500;">Medium</span>
                  <span style="
                    background: #fefcbf;
                    color: #d69e2e;
                    padding: 4px 12px;
                    border-radius: 20px;
                    font-weight: 600;
                    font-size: 14px;
                  ">${currentProject.risks.filter(r => r.priority === 'medium').length}</span>
                </div>
              </div>
              <div>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <span style="color: #4a5568; font-weight: 500;">Low</span>
                  <span style="
                    background: #c6f6d5;
                    color: #276749;
                    padding: 4px 12px;
                    border-radius: 20px;
                    font-weight: 600;
                    font-size: 14px;
                  ">${currentProject.risks.filter(r => r.priority === 'low').length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Risk Matrix Visualization -->
        <div style="
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 30px;
          margin-bottom: 40px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.05);
          page-break-inside: avoid;
        ">
          <h2 style="
            font-size: 24px;
            font-weight: 700;
            color: #1a202c;
            margin: 0 0 25px 0;
            display: flex;
            align-items: center;
          ">
            <span style="
              display: inline-block;
              width: 6px;
              height: 30px;
              background: #805ad5;
              margin-right: 15px;
              border-radius: 3px;
            "></span>
            Risk Matrix
          </h2>
          
          <div style="
            background: #f8fafc;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 20px;
          ">
            <table style="
              width: 100%;
              border-collapse: collapse;
              font-size: 12px;
            ">
              <tr>
                <th style="
                  width: 60px;
                  height: 40px;
                  background: #4a5568;
                  color: white;
                  text-align: center;
                  font-weight: 600;
                "></th>
                <th colspan="10" style="
                  text-align: center;
                  padding: 10px;
                  background: #4a5568;
                  color: white;
                  font-weight: 600;
                  font-size: 14px;
                ">Impact →</th>
              </tr>
              <tr>
                <td style="
                  background: #4a5568;
                  color: white;
                  text-align: center;
                  font-weight: 600;
                  writing-mode: vertical-lr;
                  text-orientation: mixed;
                  padding: 10px 5px;
                ">Probability ↑</td>
                ${Array.from({ length: 10 }, (_, i) => `
                  <td style="
                    text-align: center;
                    padding: 5px;
                    background: #e2e8f0;
                    color: #4a5568;
                    font-weight: 600;
                    border: 1px solid #cbd5e0;
                  ">${i + 1}</td>
                `).join('')}
              </tr>
              ${Array.from({ length: 10 }, (_, i) => {
                const probability = 10 - i;
                return `
                  <tr>
                    <td style="
                      text-align: center;
                      padding: 5px;
                      background: #e2e8f0;
                      color: #4a5568;
                      font-weight: 600;
                      border: 1px solid #cbd5e0;
                    ">${probability}</td>
                    ${Array.from({ length: 10 }, (_, j) => {
                      const impact = j + 1;
                      const risks = currentProject.risks.filter(
                        r => r.probability === probability && r.impact === impact
                      );
                      const score = probability * impact;
                      const backgroundColor = 
                        score >= 64 ? '#fed7d7' :
                        score >= 36 ? '#feebc8' :
                        score >= 16 ? '#fefcbf' :
                        '#c6f6d5';
                      const textColor = 
                        score >= 64 ? '#c53030' :
                        score >= 36 ? '#dd6b20' :
                        score >= 16 ? '#d69e2e' :
                        '#276749';
                      return `
                        <td style="
                          width: 40px;
                          height: 40px;
                          background: ${backgroundColor};
                          border: 1px solid #cbd5e0;
                          text-align: center;
                          vertical-align: middle;
                          font-weight: 600;
                          color: ${textColor};
                        ">
                          ${risks.length > 0 ? risks.length : ''}
                        </td>
                      `;
                    }).join('')}
                  </tr>
                `;
              }).join('')}
            </table>
          </div>
          
          <!-- Legend -->
          <div style="
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 15px;
            margin-top: 20px;
          ">
            <div style="
              display: flex;
              align-items: center;
              background: #c6f6d5;
              padding: 10px;
              border-radius: 6px;
            ">
              <span style="
                display: inline-block;
                width: 16px;
                height: 16px;
                background: #38a169;
                border-radius: 50%;
                margin-right: 8px;
              "></span>
              <span style="color: #276749; font-weight: 600; font-size: 13px;">Low Risk</span>
            </div>
            <div style="
              display: flex;
              align-items: center;
              background: #fefcbf;
              padding: 10px;
              border-radius: 6px;
            ">
              <span style="
                display: inline-block;
                width: 16px;
                height: 16px;
                background: #d69e2e;
                border-radius: 50%;
                margin-right: 8px;
              "></span>
              <span style="color: #744210; font-weight: 600; font-size: 13px;">Medium Risk</span>
            </div>
            <div style="
              display: flex;
              align-items: center;
              background: #feebc8;
              padding: 10px;
              border-radius: 6px;
            ">
              <span style="
                display: inline-block;
                width: 16px;
                height: 16px;
                background: #dd6b20;
                border-radius: 50%;
                margin-right: 8px;
              "></span>
              <span style="color: #9c4221; font-weight: 600; font-size: 13px;">High Risk</span>
            </div>
            <div style="
              display: flex;
              align-items: center;
              background: #fed7d7;
              padding: 10px;
              border-radius: 6px;
            ">
              <span style="
                display: inline-block;
                width: 16px;
                height: 16px;
                background: #e53e3e;
                border-radius: 50%;
                margin-right: 8px;
              "></span>
              <span style="color: #c53030; font-weight: 600; font-size: 13px;">Critical Risk</span>
            </div>
          </div>
        </div>

        <!-- Detailed Risk Register -->
        <div style="page-break-before: always;">
          <h2 style="
            font-size: 24px;
            font-weight: 700;
            color: #1a202c;
            margin: 0 0 30px 0;
            display: flex;
            align-items: center;
          ">
            <span style="
              display: inline-block;
              width: 6px;
              height: 30px;
              background: #e53e3e;
              margin-right: 15px;
              border-radius: 3px;
            "></span>
            Detailed Risk Register
          </h2>
          
          ${currentProject.risks.map((risk, index) => `
            <div style="
              background: white;
              border: 1px solid #e2e8f0;
              border-radius: 12px;
              padding: 25px;
              margin-bottom: 25px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.05);
              page-break-inside: avoid;
            ">
              <div style="
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                margin-bottom: 15px;
              ">
                <div style="flex: 1;">
                  <h3 style="
                    font-size: 18px;
                    font-weight: 600;
                    color: #1a202c;
                    margin: 0 0 8px 0;
                  ">${index + 1}. ${risk.title}</h3>
                  <div style="
                    display: flex;
                    gap: 8px;
                    flex-wrap: wrap;
                  ">
                    <span style="
                      padding: 4px 12px;
                      background: #bee3f8;
                      color: #2c5282;
                      border-radius: 20px;
                      font-size: 12px;
                      font-weight: 500;
                      text-transform: capitalize;
                    ">${risk.category}</span>
                    <span style="
                      padding: 4px 12px;
                      background: ${
                        risk.priority === 'critical' ? '#fed7d7' :
                        risk.priority === 'high' ? '#feebc8' :
                        risk.priority === 'medium' ? '#fefcbf' :
                        '#c6f6d5'
                      };
                      color: ${
                        risk.priority === 'critical' ? '#c53030' :
                        risk.priority === 'high' ? '#dd6b20' :
                        risk.priority === 'medium' ? '#d69e2e' :
                        '#276749'
                      };
                      border-radius: 20px;
                      font-size: 12px;
                      font-weight: 600;
                      text-transform: uppercase;
                    ">${risk.priority}</span>
                    <span style="
                      padding: 4px 12px;
                      background: ${
                        risk.status === 'open' ? '#bee3f8' :
                        risk.status === 'mitigated' ? '#c6f6d5' :
                        '#e2e8f0'
                      };
                      color: ${
                        risk.status === 'open' ? '#2c5282' :
                        risk.status === 'mitigated' ? '#276749' :
                        '#4a5568'
                      };
                      border-radius: 20px;
                      font-size: 12px;
                      font-weight: 500;
                      text-transform: capitalize;
                    ">${risk.status}</span>
                  </div>
                </div>
                <div style="
                  background: #f8fafc;
                  border-radius: 8px;
                  padding: 15px;
                  margin-left: 20px;
                  min-width: 120px;
                ">
                  <div style="text-align: center; margin-bottom: 8px;">
                    <span style="
                      font-size: 11px;
                      color: #718096;
                      font-weight: 500;
                      text-transform: uppercase;
                      letter-spacing: 0.5px;
                    ">Risk Score</span>
                  </div>
                  <div style="
                    font-size: 24px;
                    font-weight: 700;
                    color: ${
                      risk.probability * risk.impact >= 64 ? '#c53030' :
                      risk.probability * risk.impact >= 36 ? '#dd6b20' :
                      risk.probability * risk.impact >= 16 ? '#d69e2e' :
                      '#276749'
                    };
                    text-align: center;
                    margin-bottom: 5px;
                  ">${risk.probability * risk.impact}</div>
                  <div style="
                    font-size: 11px;
                    color: #718096;
                    text-align: center;
                  ">P:${risk.probability} × I:${risk.impact}</div>
                </div>
              </div>
              
              <p style="
                color: #4a5568;
                margin: 0 0 15px 0;
                line-height: 1.7;
              ">${risk.description}</p>
              
              <div style="
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 15px;
                margin-bottom: 15px;
                padding: 15px;
                background: #f8fafc;
                border-radius: 8px;
              ">
                <div>
                  <span style="
                    font-size: 12px;
                    color: #718096;
                    font-weight: 500;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                  ">Probability</span>
                  <div style="
                    font-size: 16px;
                    font-weight: 600;
                    color: #1a202c;
                    margin-top: 2px;
                  ">${risk.probability}/10</div>
                </div>
                <div>
                  <span style="
                    font-size: 12px;
                    color: #718096;
                    font-weight: 500;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                  ">Impact</span>
                  <div style="
                    font-size: 16px;
                    font-weight: 600;
                    color: #1a202c;
                    margin-top: 2px;
                  ">${risk.impact}/10</div>
                </div>
                <div>
                  <span style="
                    font-size: 12px;
                    color: #718096;
                    font-weight: 500;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                  ">Assigned To</span>
                  <div style="
                    font-size: 14px;
                    font-weight: 500;
                    color: #1a202c;
                    margin-top: 2px;
                  ">${risk.assignedTo || 'Not assigned'}</div>
                </div>
              </div>
              
              ${risk.mitigationStrategy ? `
                <div style="
                  background: #f0fff4;
                  border: 1px solid #c6f6d5;
                  border-radius: 8px;
                  padding: 15px;
                  margin-top: 15px;
                ">
                  <h4 style="
                    font-size: 14px;
                    font-weight: 600;
                    color: #276749;
                    margin: 0 0 8px 0;
                  ">Mitigation Strategy</h4>
                  <p style="
                    color: #276749;
                    margin: 0;
                    font-size: 13px;
                    line-height: 1.6;
                  ">${risk.mitigationStrategy.overview}</p>
                </div>
              ` : ''}
              
              ${risk.solutions && risk.solutions.length > 0 ? `
                <div style="
                  background: #faf5ff;
                  border: 1px solid #e9d8fd;
                  border-radius: 8px;
                  padding: 15px;
                  margin-top: 15px;
                ">
                  <h4 style="
                    font-size: 14px;
                    font-weight: 600;
                    color: #553c9a;
                    margin: 0 0 10px 0;
                  ">Key Solutions</h4>
                  ${risk.solutions.slice(0, 2).map((solution, sIndex) => `
                    <div style="
                      margin-bottom: 8px;
                      padding-left: 15px;
                      position: relative;
                    ">
                      <span style="
                        position: absolute;
                        left: 0;
                        color: #805ad5;
                        font-weight: 600;
                        font-size: 12px;
                      ">${sIndex + 1}.</span>
                      <p style="
                        color: #553c9a;
                        margin: 0;
                        font-size: 13px;
                        line-height: 1.6;
                      ">${solution.length > 150 ? solution.substring(0, 150) + '...' : solution}</p>
                    </div>
                  `).join('')}
                </div>
              ` : ''}
            </div>
          `).join('')}
        </div>
        
        <!-- Footer -->
        <div style="
          text-align: center;
          padding: 30px 0;
          border-top: 2px solid #e2e8f0;
          margin-top: 40px;
          color: #718096;
        ">
          <div style="
            background: #f8fafc;
            border-radius: 8px;
            padding: 20px;
            display: inline-block;
          ">
            <h4 style="
              font-size: 16px;
              font-weight: 600;
              color: #2d3748;
              margin: 0 0 10px 0;
            ">RiskVision - Intelligent Risk Management</h4>
            <p style="
              font-size: 12px;
              margin: 0 0 5px 0;
            ">This comprehensive risk assessment report was generated automatically</p>
            <p style="
              font-size: 12px;
              margin: 0;
            ">© ${new Date().getFullYear()} RiskVision. All rights reserved.</p>
          </div>
        </div>
      </div>
    `;
    
    // Generate PDF
    document.body.appendChild(container);
    
    const options = {
      margin: [5, 5, 5, 5],
      filename: `${currentProject.name.replace(/\s+/g, '_')}_Risk_Assessment_Report.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2,
        useCORS: true,
        letterRendering: true,
        allowTaint: true
      },
      jsPDF: { 
        unit: 'mm', 
        format: 'a4', 
        orientation: 'portrait',
        compress: true
      },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };
    
    html2pdf().from(container).set(options).save().then(() => {
      document.body.removeChild(container);
      setExporting(false);
    });
  };
  
  const exportToCSV = () => {
    setExporting(true);
    
    // Prepare CSV content
    const headers = [
      'ID', 'Title', 'Description', 'Category', 'Probability', 'Impact',
      'Priority', 'Status', 'Assigned To', 'Tags', 'Mitigation Strategy', 'Solutions'
    ];
    
    const rows = currentProject.risks.map(risk => [
      risk.id,
      risk.title,
      risk.description.replace(/,/g, ';').replace(/\n/g, ' '),
      risk.category,
      risk.probability,
      risk.impact,
      risk.priority,
      risk.status,
      risk.assignedTo,
      risk.tags.join(';'),
      (risk.mitigationStrategy?.overview || '').replace(/,/g, ';').replace(/\n/g, ' '),
      (risk.solutions || []).join(' | ').replace(/,/g, ';').replace(/\n/g, ' ')
    ]);
    
    // Convert to CSV
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    // Create and download the file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${currentProject.name.replace(/\s+/g, '_')}_Risk_Register.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setExporting(false);
  };
  
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Export Options</h2>
        <p className="text-sm text-gray-500 mb-4">
          Export your project risk data in different formats for reporting and sharing.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button
            variant="primary"
            icon={<FilePdf size={16} />}
            onClick={exportToPDF}
            isLoading={exporting}
            className="justify-center"
          >
            Export Full Report
          </Button>
          
          <Button
            variant="secondary"
            icon={<FileSpreadsheet size={16} />}
            onClick={exportToCSV}
            isLoading={exporting}
            className="justify-center"
          >
            Export to CSV
          </Button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Individual Risk Reports</h2>
        <p className="text-sm text-gray-500 mb-4">
          Generate detailed reports for specific risks.
        </p>
        
        <div className="space-y-4">
          {currentProject.risks.map((risk) => (
            <div key={risk.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-medium">{risk.title}</h3>
                <p className="text-sm text-gray-500">{risk.category} | {risk.priority}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                icon={<FileDown size={16} />}
                onClick={() => generateRiskReport(risk)}
              >
                Export
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExportOptions;