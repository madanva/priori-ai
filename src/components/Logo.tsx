import React from 'react';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  withText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ size = 'medium', withText = true }) => {
  const getSizeClass = () => {
    switch (size) {
      case 'small':
        return 'h-8';
      case 'large':
        return 'h-16';
      case 'medium':
      default:
        return 'h-12';
    }
  };

  return (
    <div className="flex items-center">
      <div className={`${getSizeClass()} relative`}>
        {/* Stylized P logo */}
        <div className={`${getSizeClass()} aspect-square bg-gradient-to-br from-[#1EBCBC] to-[#0A9999] rounded-r-full`}>
          <div className={`absolute bottom-0 left-0 w-1/2 h-1/2 bg-white`}></div>
        </div>
      </div>
      
      {withText && (
        <div className="ml-2 font-bold">
          <span className="text-[#1EBCBC]">PRIORI</span> <span className="text-[#333333]">AI</span>
        </div>
      )}
    </div>
  );
};
