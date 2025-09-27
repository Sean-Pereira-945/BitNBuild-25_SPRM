import React from 'react';

const Button = ({ children, onClick, type = 'button', variant = 'primary' }) => {
  const baseStyle = 'button';
  const variantStyle = `button-${variant}`;

  return (
    <button type={type} onClick={onClick} className={`${baseStyle} ${variantStyle}`}>
      {children}
    </button>
  );
};

export default Button;
