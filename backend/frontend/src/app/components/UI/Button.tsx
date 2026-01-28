import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ children, ...props }) => {
  return (
    <button
      {...props}
      className={`px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800 ${props.className || ''}`}
    >
      {children}
    </button>
  );
};
