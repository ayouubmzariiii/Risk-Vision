import React from 'react';
import ComingSoon from './ComingSoon';
import { Puzzle } from 'lucide-react';

const Integrations: React.FC = () => {
  return (
    <ComingSoon 
      title="Integrations"
      description="Connect RiskVision with your favorite tools and streamline your workflow."
      icon={Puzzle}
    />
  );
};

export default Integrations;