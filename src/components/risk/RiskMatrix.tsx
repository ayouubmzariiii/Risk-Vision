import React, { useState, useEffect, useRef } from 'react';
import { useProjects } from '../../context/ProjectContext';
import { Risk } from '../../types';

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
    
    // Set canvas dimensions
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw grid
    const cellSize = width / 10;
    
    // Draw background colors for risk zones
    // Low risk (green)
    ctx.fillStyle = 'rgba(220, 252, 231, 0.6)'; // light green
    ctx.fillRect(0, height - 4 * cellSize, 4 * cellSize, 4 * cellSize);
    
    // Medium risk (yellow)
    ctx.fillStyle = 'rgba(254, 249, 195, 0.6)'; // light yellow
    ctx.fillRect(4 * cellSize, height - 4 * cellSize, 2 * cellSize, 4 * cellSize);
    ctx.fillRect(0, height - 6 * cellSize, 4 * cellSize, 2 * cellSize);
    
    // High risk (orange)
    ctx.fillStyle = 'rgba(254, 215, 170, 0.6)'; // light orange
    ctx.fillRect(6 * cellSize, height - 6 * cellSize, 4 * cellSize, 6 * cellSize);
    ctx.fillRect(0, height - 10 * cellSize, 6 * cellSize, 4 * cellSize);
    ctx.fillRect(4 * cellSize, height - 6 * cellSize, 2 * cellSize, 2 * cellSize);
    
    // Critical risk (red)
    ctx.fillStyle = 'rgba(254, 202, 202, 0.6)'; // light red
    ctx.fillRect(6 * cellSize, height - 10 * cellSize, 4 * cellSize, 4 * cellSize);
    
    // Draw grid lines
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    
    // Vertical lines
    for (let i = 0; i <= 10; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, height);
      ctx.stroke();
    }
    
    // Horizontal lines
    for (let i = 0; i <= 10; i++) {
      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(width, i * cellSize);
      ctx.stroke();
    }
    
    // Draw labels
    ctx.fillStyle = '#374151';
    ctx.font = '12px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    
    // X-axis (Impact)
    ctx.fillText('Impact', width / 2, height - 5);
    for (let i = 1; i <= 10; i++) {
      ctx.fillText(i.toString(), i * cellSize - cellSize / 2, height - 10);
    }
    
    // Y-axis (Probability)
    ctx.save();
    ctx.translate(10, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Probability', 0, 0);
    ctx.restore();
    
    for (let i = 1; i <= 10; i++) {
      ctx.fillText(i.toString(), 15, height - i * cellSize + cellSize / 2 + 4);
    }
    
    // Draw risk points
    risks.forEach((risk) => {
      const x = risk.impact * cellSize - cellSize / 2;
      const y = height - risk.probability * cellSize + cellSize / 2;
      const radius = 8;
      
      // Draw circle for risk
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, 2 * Math.PI);
      
      // Color based on priority
      switch (risk.priority) {
        case 'low':
          ctx.fillStyle = '#10B981'; // green
          break;
        case 'medium':
          ctx.fillStyle = '#F59E0B'; // amber
          break;
        case 'high':
          ctx.fillStyle = '#F97316'; // orange
          break;
        case 'critical':
          ctx.fillStyle = '#EF4444'; // red
          break;
        default:
          ctx.fillStyle = '#6B7280'; // gray
      }
      
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Add risk ID or initials
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 10px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // Get first letter of risk title
      const initial = risk.title.charAt(0).toUpperCase();
      ctx.fillText(initial, x, y);
    });
    
    // Add event listeners for canvas
    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const x = (event.clientX - rect.left) * scaleX;
      const y = (event.clientY - rect.top) * scaleY;
      
      // Check if mouse is over any risk point
      for (const risk of risks) {
        const riskX = risk.impact * cellSize - cellSize / 2;
        const riskY = height - risk.probability * cellSize + cellSize / 2;
        const distance = Math.sqrt(Math.pow(x - riskX, 2) + Math.pow(y - riskY, 2));
        
        if (distance <= 8) {
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
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 relative">
      <h2 className="text-xl font-semibold mb-4">Risk Matrix</h2>
      <div className="text-sm text-gray-500 mb-4">
        This matrix visualizes your project risks based on their probability and impact. 
        Hover over a risk dot to see details.
      </div>
      
      <div className="relative bg-white">
        <canvas
          ref={canvasRef}
          width={500}
          height={500}
          className="w-full h-auto border border-gray-200 rounded"
        />
        
        {tooltip.visible && selectedRisk && (
          <div
            className="absolute z-10 bg-gray-800 text-white p-2 rounded shadow-lg text-sm w-64"
            style={{
              left: `${tooltip.x + 10}px`,
              top: `${tooltip.y - 80}px`,
              transform: 'translateX(-50%)'
            }}
          >
            <p className="font-medium">{selectedRisk.title}</p>
            <p className="text-xs text-gray-300 truncate">{selectedRisk.description}</p>
            <div className="flex justify-between mt-1 text-xs">
              <span>P: {selectedRisk.probability}/10</span>
              <span>I: {selectedRisk.impact}/10</span>
              <span className="capitalize">{selectedRisk.priority}</span>
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="flex items-center">
          <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
          <span className="text-sm">Low Risk</span>
        </div>
        <div className="flex items-center">
          <span className="inline-block w-3 h-3 bg-amber-500 rounded-full mr-2"></span>
          <span className="text-sm">Medium Risk</span>
        </div>
        <div className="flex items-center">
          <span className="inline-block w-3 h-3 bg-orange-500 rounded-full mr-2"></span>
          <span className="text-sm">High Risk</span>
        </div>
        <div className="flex items-center">
          <span className="inline-block w-3 h-3 bg-red-500 rounded-full mr-2"></span>
          <span className="text-sm">Critical Risk</span>
        </div>
      </div>
    </div>
  );
};

export default RiskMatrix;