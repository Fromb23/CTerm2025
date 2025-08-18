import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useTheme } from "../../contexts/themeContext.jsx";
import Input from "./Input";
import Button from "./Button";

const Form = ({ fields, onSubmit, children }) => {
  const initialState = fields.reduce((acc, field) => {
    acc[field.name] = "";
    return acc;
  }, {});

  const [formData, setFormData] = useState(initialState);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    // optional: reset form
    // setFormData(initialState);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {fields.map((field) => (
        <Input
          key={field.name}
          name={field.name}
          label={field.label}
          type={field.type === "password" ? (showPassword ? "text" : "password") : field.type}
          value={formData[field.name]}
          onChange={handleChange}
          required={field.required || false}
          rightIcon={
            field.type === "password" ? (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-secondary hover:text-primary transition-colors duration-200"
              >
                {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
              </button>
            ) : null
          }
        />
      ))}

      {children /* e.g., submit buttons passed from parent */}
    </form>
  );
};

export default Form;