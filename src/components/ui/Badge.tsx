import React from 'react';
import { RiskPriority, RiskStatus } from '../../types';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'outline' | 'priority' | 'status';
  value?: RiskPriority | RiskStatus;
}

const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', value }) => {
  let className = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';

  if (variant === 'default') {
    className += ' bg-blue-100 text-blue-800';
  } else if (variant === 'outline') {
    className += ' bg-transparent border border-gray-300 text-gray-700';
  } else if (variant === 'priority') {
    switch (value as RiskPriority) {
      case 'low':
        className += ' bg-green-100 text-green-800';
        break;
      case 'medium':
        className += ' bg-yellow-100 text-yellow-800';
        break;
      case 'high':
        className += ' bg-orange-100 text-orange-800';
        break;
      case 'critical':
        className += ' bg-red-100 text-red-800';
        break;
      default:
        className += ' bg-gray-100 text-gray-800';
    }
  } else if (variant === 'status') {
    switch (value as RiskStatus) {
      case 'open':
        className += ' bg-blue-100 text-blue-800';
        break;
      case 'mitigated':
        className += ' bg-purple-100 text-purple-800';
        break;
      case 'closed':
        className += ' bg-gray-100 text-gray-800';
        break;
      default:
        className += ' bg-gray-100 text-gray-800';
    }
  }

  return <span className={className}>{children}</span>;
};

export default Badge;