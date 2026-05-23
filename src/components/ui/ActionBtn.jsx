import React from 'react';
import './ActionBtn.css';

const ActionBtn = ({ children, onClick, variant = 'primary', type = "button" }) => {
  return (
    <button type={type} className={`action-btn ${variant}`} onClick={onClick}>
      {children}
    </button>
  );
};

export default ActionBtn;
