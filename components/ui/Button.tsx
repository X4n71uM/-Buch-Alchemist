
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseClasses = 'px-6 py-3 font-semibold rounded-full transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#1a1032]';

  const variantClasses = {
    primary: 'bg-gradient-to-br from-yellow-400 to-amber-500 text-slate-900 shadow-lg shadow-yellow-500/20 hover:shadow-xl hover:shadow-yellow-500/40 transform hover:-translate-y-1',
    secondary: 'bg-transparent border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-slate-900',
    ghost: 'bg-transparent text-slate-300 hover:bg-slate-700/50',
  };

  return (
    <button className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};
