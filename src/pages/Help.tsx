import React from 'react';
import ComingSoon from './ComingSoon';
import { HelpCircle } from 'lucide-react';

const Help: React.FC = () => {
  return (
    <ComingSoon 
      title="Help Center"
      description="Get support, find answers, and learn how to use RiskVision effectively."
      icon={HelpCircle}
    />
  );
};

export default Help;