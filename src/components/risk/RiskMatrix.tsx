import React, { useState, useEffect, useRef } from 'react';
import { useProjects } from '../../context/ProjectContext';
import { Risk } from '../../types';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { TrendingUp, AlertTriangle, Target, BarChart3 } from 'lucide-react';

const RiskMatrix: React.FC = () => {
  const { currentProject } = useProjects();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedRisk, setSelectedRisk] = useState<Risk | null>(null);
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0 });
  
  useEffect(() => {
    if (!currentProject || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const risks = currentProject.risks;
    
    // Set canvas dimensions with better scaling
    const containerWidth = canvas.parentElement?.clientWidth || 700;
    const size = Math.min(containerWidth - 40, 700); // Max 700px, responsive
    canvas.width = size;
    canvas.height = size + 60; // Extra height for labels
    
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw grid with better proportions
    const cellSize = (width - 100) / 10; // 10x10 matrix
    const offsetX = 60;
    const offsetY = 40;
    
    // Draw background colors for risk zones with better visual hierarchy
    const matrixWidth = cellSize * 10;
    const matrixHeight = cellSize * 10;
    const matrixStartX = offsetX;
    const matrixStartY = offsetY;
    
    // Draw background colors for each cell based on risk level calculation
    for (let impact = 1; impact <= 10; impact++) {
      for (let probability = 1; probability <= 10; probability++) {
        const riskScore = impact * probability;
        let color;
        
        if (riskScore <= 15) {
          color = 'rgba(16, 185, 129, 0.1)'; // Low risk (green)
        } else if (riskScore <= 35) {
          color = 'rgba(245, 158, 11, 0.15)'; // Medium risk (yellow)
        } else if (riskScore <= 65) {
          color = 'rgba(249, 115, 22, 0.2)'; // High risk (orange)
        } else {
          color = 'rgba(239, 68, 68, 0.25)'; // Critical risk (red)
        }
        
        ctx.fillStyle = color;
        ctx.fillRect(
          matrixStartX + (impact - 1) * cellSize,
          matrixStartY + matrixHeight - probability * cellSize,
          cellSize,
          cellSize
        );
      }
    }
    
    // Draw grid lines with better styling
    ctx.strokeStyle = '#d1d5db';
    ctx.lineWidth = 0.5;
    
    // Vertical lines
    for (let i = 0; i <= 10; i++) {
      ctx.beginPath();
      ctx.moveTo(matrixStartX + i * cellSize, matrixStartY);
      ctx.lineTo(matrixStartX + i * cellSize, matrixStartY + matrixHeight);
      ctx.stroke();
    }
    
    // Horizontal lines
    for (let i = 0; i <= 10; i++) {
      ctx.beginPath();
      ctx.moveTo(matrixStartX, matrixStartY + i * cellSize);
      ctx.lineTo(matrixStartX + matrixWidth, matrixStartY + i * cellSize);
      ctx.stroke();
    }
    
    // Draw border
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 2;
    ctx.strokeRect(matrixStartX, matrixStartY, matrixWidth, matrixHeight);
    
    // Draw labels with better typography
    ctx.fillStyle = '#1f2937';
    ctx.font = 'bold 14px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    
    // X-axis (Impact) title
    ctx.fillText('Impact →', matrixStartX + matrixWidth / 2, matrixStartY + matrixHeight + 45);
    
    // X-axis numbers
    ctx.font = '10px system-ui, -apple-system, sans-serif';
    for (let i = 1; i <= 10; i++) {
      ctx.fillText(i.toString(), matrixStartX + i * cellSize - cellSize / 2, matrixStartY + matrixHeight + 15);
    }
    
    // Y-axis (Probability) title
    ctx.save();
    ctx.translate(20, matrixStartY + matrixHeight / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.font = 'bold 14px system-ui, -apple-system, sans-serif';
    ctx.fillText('← Probability', 0, 0);
    ctx.restore();
    
    // Y-axis numbers
    ctx.font = '10px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    for (let i = 1; i <= 10; i++) {
      ctx.fillText(i.toString(), 40, matrixStartY + matrixHeight - i * cellSize + cellSize / 2 + 3);
    }
    
    // Group risks by their cell position
    const risksByCell = new Map();
    risks.forEach((risk, index) => {
      const cellKey = `${risk.impact}-${risk.probability}`;
      if (!risksByCell.has(cellKey)) {
        risksByCell.set(cellKey, []);
      }
      risksByCell.get(cellKey).push({ risk, index });
    });

    // Calculate positions with collision detection to prevent overlapping
    const riskPositions = [];
    const radius = 6; // Reduced radius for better fit
    const minDistance = radius * 2.5; // Minimum distance between points
    
    // Helper function to check if two circles overlap
    const checkOverlap = (x1, y1, x2, y2, r1 = radius, r2 = radius) => {
      const distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
      return distance < (r1 + r2);
    };
    
    // Helper function to find non-overlapping position within cell bounds
    const findValidPosition = (cellCenterX, cellCenterY, existingPositions, maxAttempts = 50) => {
      const cellBounds = cellSize * 0.4; // Stay within 40% of cell size from center
      
      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        // Try different positioning strategies
        let x, y;
        
        if (attempt < 20) {
          // First 20 attempts: systematic grid positions
          const gridSize = Math.ceil(Math.sqrt(maxAttempts));
          const row = Math.floor(attempt / gridSize);
          const col = attempt % gridSize;
          const stepX = (cellBounds * 2) / (gridSize + 1);
          const stepY = (cellBounds * 2) / (gridSize + 1);
          x = cellCenterX - cellBounds + (col + 1) * stepX;
          y = cellCenterY - cellBounds + (row + 1) * stepY;
        } else {
          // Remaining attempts: random positions within bounds
          const angle = Math.random() * 2 * Math.PI;
          const distance = Math.random() * cellBounds;
          x = cellCenterX + Math.cos(angle) * distance;
          y = cellCenterY + Math.sin(angle) * distance;
        }
        
        // Check if this position overlaps with existing points
        let hasOverlap = false;
        for (const pos of existingPositions) {
          if (checkOverlap(x, y, pos.x, pos.y)) {
            hasOverlap = true;
            break;
          }
        }
        
        if (!hasOverlap) {
          return { x, y };
        }
      }
      
      // Fallback: place at cell center with slight random offset
      const fallbackOffset = Math.random() * 5;
      const fallbackAngle = Math.random() * 2 * Math.PI;
      return {
        x: cellCenterX + Math.cos(fallbackAngle) * fallbackOffset,
        y: cellCenterY + Math.sin(fallbackAngle) * fallbackOffset
      };
    };
    
    risksByCell.forEach((cellRisks, cellKey) => {
      const [impact, probability] = cellKey.split('-').map(Number);
      const cellCenterX = matrixStartX + impact * cellSize - cellSize / 2;
      const cellCenterY = matrixStartY + matrixHeight - probability * cellSize + cellSize / 2;
      
      const cellPositions = [];
      
      cellRisks.forEach((riskData, idx) => {
        let position;
        
        if (idx === 0) {
          // First point goes to center
          position = { x: cellCenterX, y: cellCenterY };
        } else {
          // Find non-overlapping position for subsequent points
          position = findValidPosition(cellCenterX, cellCenterY, cellPositions);
        }
        
        cellPositions.push(position);
        riskPositions.push({
          ...riskData,
          ...position
        });
      });
    });

    // Draw risk points with enhanced styling
    riskPositions.forEach(({ risk, index, x, y }) => {
      
      // Draw outer shadow
      ctx.beginPath();
      ctx.arc(x + 2, y + 2, radius + 1, 0, 2 * Math.PI);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
      ctx.fill();
      
      // Draw main circle with gradient effect
      const gradient = ctx.createRadialGradient(x - 3, y - 3, 0, x, y, radius);
      
      // Color based on priority with modern gradients
      switch (risk.priority) {
        case 'low':
          gradient.addColorStop(0, '#34D399'); // lighter emerald
          gradient.addColorStop(1, '#059669'); // darker emerald
          break;
        case 'medium':
          gradient.addColorStop(0, '#FBBF24'); // lighter amber
          gradient.addColorStop(1, '#D97706'); // darker amber
          break;
        case 'high':
          gradient.addColorStop(0, '#FB923C'); // lighter orange
          gradient.addColorStop(1, '#EA580C'); // darker orange
          break;
        case 'critical':
          gradient.addColorStop(0, '#F87171'); // lighter red
          gradient.addColorStop(1, '#DC2626'); // darker red
          break;
        default:
          gradient.addColorStop(0, '#9CA3AF'); // lighter gray
          gradient.addColorStop(1, '#4B5563'); // darker gray
      }
      
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, 2 * Math.PI);
      ctx.fillStyle = gradient;
      ctx.fill();
      
      // Add clean white border
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2.5;
      ctx.stroke();
      
      // Add subtle inner highlight
      ctx.beginPath();
      ctx.arc(x - 2, y - 2, radius * 0.3, 0, 2 * Math.PI);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.fill();
      
      // Add risk number with better typography
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // Add text shadow for better readability
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
      ctx.shadowBlur = 2;
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1;
      
      // Use index + 1 for better identification
      const label = (index + 1).toString();
      ctx.fillText(label, x, y);
      
      // Reset shadow
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
    });
    
    // Add event listeners for canvas
    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const x = (event.clientX - rect.left) * scaleX;
      const y = (event.clientY - rect.top) * scaleY;
      
      // Check if mouse is over any risk point using calculated positions
      for (const { risk, x: riskX, y: riskY } of riskPositions) {
        const distance = Math.sqrt(Math.pow(x - riskX, 2) + Math.pow(y - riskY, 2));
        
        if (distance <= 6) {
          setSelectedRisk(risk);
          setTooltip({
            visible: true,
            x: event.clientX,
            y: event.clientY
          });
          canvas.style.cursor = 'pointer';
          return;
        }
      }
      
      setSelectedRisk(null);
      setTooltip({ visible: false, x: 0, y: 0 });
      canvas.style.cursor = 'default';
    };
    
    canvas.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
    };
  }, [currentProject]);
  
  if (!currentProject) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Select a project to view the risk matrix.</p>
      </div>
    );
  }
  
  // Calculate risk statistics
  const riskStats = currentProject.risks.reduce((acc, risk) => {
    acc[risk.priority] = (acc[risk.priority] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BarChart3 className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Risk Matrix</h2>
              <p className="text-sm text-gray-600 mt-1">
                Visual representation of {currentProject.risks.length} project risks
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{currentProject.risks.length}</div>
              <div className="text-xs text-gray-500">Total Risks</div>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-3">
            <Target className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Risk Distribution</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-green-800">Low</span>
              </div>
              <span className="text-lg font-bold text-green-600">{riskStats.low || 0}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-200">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                <span className="text-sm font-medium text-amber-800">Medium</span>
              </div>
              <span className="text-lg font-bold text-amber-600">{riskStats.medium || 0}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span className="text-sm font-medium text-orange-800">High</span>
              </div>
              <span className="text-lg font-bold text-orange-600">{riskStats.high || 0}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm font-medium text-red-800">Critical</span>
              </div>
              <span className="text-lg font-bold text-red-600">{riskStats.critical || 0}</span>
            </div>
          </div>
        </div>
        
        <div className="relative bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border border-gray-200">
          <div className="flex items-center space-x-2 mb-4">
            <TrendingUp className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Interactive Matrix</span>
            <span className="text-xs text-gray-500">• Hover over points for details</span>
          </div>
          
          <div className="flex justify-center">
            <canvas
              ref={canvasRef}
              className="max-w-full h-auto rounded-lg shadow-sm border border-gray-300"
            />
          </div>
          
          {tooltip.visible && selectedRisk && (
            <div
              className="fixed z-50 bg-white border border-gray-200 shadow-xl rounded-lg p-4 max-w-sm"
              style={{
                left: `${Math.min(tooltip.x + 10, window.innerWidth - 250)}px`,
                top: `${Math.max(tooltip.y - 120, 10)}px`,
              }}
            >
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg ${
                  selectedRisk.priority === 'low' ? 'bg-green-100' :
                  selectedRisk.priority === 'medium' ? 'bg-amber-100' :
                  selectedRisk.priority === 'high' ? 'bg-orange-100' :
                  'bg-red-100'
                }`}>
                  <AlertTriangle className={`h-4 w-4 ${
                    selectedRisk.priority === 'low' ? 'text-green-600' :
                    selectedRisk.priority === 'medium' ? 'text-amber-600' :
                    selectedRisk.priority === 'high' ? 'text-orange-600' :
                    'text-red-600'
                  }`} />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">{selectedRisk.title}</h4>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{selectedRisk.description}</p>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="text-center p-2 bg-blue-50 rounded">
                      <div className="font-semibold text-blue-600">{selectedRisk.probability}</div>
                      <div className="text-blue-500">Probability</div>
                    </div>
                    <div className="text-center p-2 bg-purple-50 rounded">
                      <div className="font-semibold text-purple-600">{selectedRisk.impact}</div>
                      <div className="text-purple-500">Impact</div>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded">
                      <div className={`font-semibold capitalize ${
                        selectedRisk.priority === 'low' ? 'text-green-600' :
                        selectedRisk.priority === 'medium' ? 'text-amber-600' :
                        selectedRisk.priority === 'high' ? 'text-orange-600' :
                        'text-red-600'
                      }`}>{selectedRisk.priority}</div>
                      <div className="text-gray-500">Priority</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="mt-4 space-y-4">
           <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
             <div className="flex items-start space-x-3">
               <div className="p-2 bg-blue-100 rounded-lg">
                 <BarChart3 className="h-5 w-5 text-blue-600" />
               </div>
               <div className="flex-1">
                 <h4 className="text-sm font-semibold text-blue-900 mb-2">What is a Risk Matrix?</h4>
                 <p className="text-xs text-blue-700 mb-3">
                   A risk matrix is a visual tool that helps assess and prioritize project risks by plotting them according to their likelihood of occurrence and potential impact on the project. This systematic approach enables teams to focus resources on the most critical risks first.
                 </p>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                   <div className="bg-white/60 p-3 rounded border border-blue-100">
                     <h5 className="font-semibold text-blue-800 mb-1">📊 Probability (Y-Axis)</h5>
                     <p className="text-blue-600">
                       The likelihood that a risk event will occur, rated from 1 (very unlikely) to 10 (almost certain). Consider historical data, expert judgment, and current conditions.
                     </p>
                   </div>
                   <div className="bg-white/60 p-3 rounded border border-blue-100">
                     <h5 className="font-semibold text-blue-800 mb-1">💥 Impact (X-Axis)</h5>
                     <p className="text-blue-600">
                       The severity of consequences if the risk occurs, rated from 1 (minimal impact) to 10 (catastrophic). Consider effects on timeline, budget, quality, and scope.
                     </p>
                   </div>
                 </div>
               </div>
             </div>
           </div>
           
           <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
             <div className="flex items-start space-x-3">
               <div className="p-1 bg-amber-100 rounded">
                 <AlertTriangle className="h-4 w-4 text-amber-600" />
               </div>
               <div>
                 <h4 className="text-sm font-semibold text-amber-900 mb-1">How to Read the Matrix</h4>
                 <p className="text-xs text-amber-700">
                   Each numbered circle represents a project risk. Risks are positioned based on their probability (Y-axis) and impact (X-axis). 
                   The colored background zones indicate risk severity: <span className="font-medium">green (low)</span>, <span className="font-medium">yellow (medium)</span>, <span className="font-medium">orange (high)</span>, and <span className="font-medium">red (critical)</span>. 
                   Hover over any risk point to view detailed information.
                 </p>
               </div>
             </div>
           </div>
         </div>
      </CardContent>
    </Card>
  );
};

export default RiskMatrix;