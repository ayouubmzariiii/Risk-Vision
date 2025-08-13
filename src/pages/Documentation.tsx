import React from 'react';
import ComingSoon from './ComingSoon';
import { FileText } from 'lucide-react';

const Documentation: React.FC = () => {
  return (
    <ComingSoon 
      title="Documentation"
      description="Comprehensive guides and API documentation to help you get the most out of RiskVision."
      icon={FileText}
    />
  );
};

export default Documentation;