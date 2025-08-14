import React from 'react';

const Input = ({ label, value, onChange, placeholder, id = "input-code" }) => {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium text-primary">
        {label}
      </label>
      <input
        type="text"
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="px-4 py-2 border rounded-md bg-background text-primary focus:outline-none focus:ring-2 focus:ring-accent"
        required
      />
    </div>
  );
};

export default Input;
