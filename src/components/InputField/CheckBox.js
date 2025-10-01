import React from 'react';
import './Checkbox.css'; // Estilos para o Checkbox

const Checkbox = ({ label, checked, onChange, id }) => {
  return (
    <div className="checkbox-group">
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={onChange}
      />
      <label htmlFor={id}>{label}</label>
    </div>
  );
};

export default Checkbox;