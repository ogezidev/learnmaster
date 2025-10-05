// src/components/InputField.jsx
import React, { useState } from 'react';
import './InputField.css';

const InputField = ({ label, type, value, onChange, id }) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  return (
    <div className={`input-group ${isFocused || value ? 'active' : ''}`}>
      <input
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        required
      />
      <label htmlFor={id}>{label}</label>

    </div>
  );
};

export default InputField;