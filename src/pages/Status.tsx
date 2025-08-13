import React from 'react';
import ComingSoon from './ComingSoon';
import { Activity } from 'lucide-react';

const Status: React.FC = () => {
  return (
    <ComingSoon 
      title="System Status"
      description="Real-time status updates and uptime information for all RiskVision services."
      icon={Activity}
    />
  );
};

export default Status;