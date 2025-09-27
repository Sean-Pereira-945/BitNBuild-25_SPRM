import React from 'react';

const FormInput = ({ label, type, value, onChange, placeholder, required }) => {
  return (
    <div className="form-input-group">
      <label>{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
      />
    </div>
  );
};

export default FormInput;
