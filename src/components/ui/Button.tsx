import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'success' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  className = '',
  disabled,
  ...props
}) => {
  let baseClasses = 'inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  // Add variant styles
  switch (variant) {
    case 'primary':
      baseClasses += ' bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500';
      break;
    case 'secondary':
      baseClasses += ' bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500';
      break;
    case 'outline':
      baseClasses += ' border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-blue-500';
      break;
    case 'danger':
      baseClasses += ' bg-red-600 text-white hover:bg-red-700 focus:ring-red-500';
      break;
    case 'success':
      baseClasses += ' bg-green-600 text-white hover:bg-green-700 focus:ring-green-500';
      break;
    case 'ghost':
      baseClasses += ' text-gray-700 hover:bg-gray-100 focus:ring-gray-500';
      break;
  }
  
  // Add size styles
  switch (size) {
    case 'sm':
      baseClasses += ' px-3 py-1.5 text-sm';
      break;
    case 'md':
      baseClasses += ' px-4 py-2 text-sm';
      break;
    case 'lg':
      baseClasses += ' px-6 py-3 text-base';
      break;
  }
  
  // Add disabled styles
  if (disabled || isLoading) {
    baseClasses += ' opacity-50 cursor-not-allowed';
  }
  
  return (
    <button
      className={`${baseClasses} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {icon && !isLoading && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};

export default Button;