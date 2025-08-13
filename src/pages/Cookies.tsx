import React from 'react';
import ComingSoon from './ComingSoon';
import { Cookie } from 'lucide-react';

const Cookies: React.FC = () => {
  return (
    <ComingSoon 
      title="Cookie Policy"
      description="Learn about how we use cookies to improve your experience on RiskVision."
      icon={Cookie}
    />
  );
};

export default Cookies;