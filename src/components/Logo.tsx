
import React from 'react';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = "" }) => {
  return (
    <div className={`flex items-center ${className}`}>
      <img 
        src="/lovable-uploads/9b22ae12-42c0-4369-82c7-aa8811ceccbd.png" 
        alt="Mindease Logo" 
        className="h-10 w-auto"
      />
    </div>
  );
};

export default Logo;
