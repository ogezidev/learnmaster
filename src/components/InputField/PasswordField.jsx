import React, { useState } from 'react';
import './PasswordField.css'; // Estilos para o PasswordField
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Ícones de olho (instale react-icons)

const PasswordField = ({ label, value, onChange, id }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);
  const toggleShowPassword = () => setShowPassword(!showPassword);

  return (
    <div className={`input-group ${isFocused || value ? 'active' : ''}`}>
      <input
        type={showPassword ? 'text' : 'password'}
        id={id}
        value={value}
        onChange={onChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        required
      />
      <label htmlFor={id}>{label}</label>
      <span className="password-toggle" onClick={toggleShowPassword}>
        {showPassword ? <FaEyeSlash /> : <FaEye />}
      </span>
    </div>
  );
};

export default PasswordField;