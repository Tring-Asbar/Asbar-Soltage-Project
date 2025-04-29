import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import './InputField.scss'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  className?: string;
  placeholder?: string;
  options?: string[]; 
}

const InputField: React.FC<InputProps> = ({ name, className, placeholder, type, options, ...props }) => {
  const required = "Should not be empty"
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    formState: { errors },
    getValues
  } = useFormContext();

  const inputValidations = {
    FirstName: {
      required: required,
      pattern: {
        value: /^[A-Za-z\s]+$/,
        message: "Enter a valid name",
      },
    },
    LastName: {
      required: required,
      pattern: {
        value: /^[A-Za-z\s]+$/,
        message: "Enter a valid name",
      },
    },
    Password: {
      required: "Password is required",
      
    },
    OldPassword:{
      required:required,
    },
    ConfirmPassword:{
      required:required,
      validate: (value: string) => value === getValues("Password") || "Passwords do not match."
    },
    Email: {
      required: "Email is required",
      pattern: {
        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: "Enter a valid email address",
      },
    },
    Department: {
      required: "Please select one",
    },
  };

  const isPassword = type === 'password';
  const togglePassword = () => setShowPassword((prev) => !prev);

  const error = errors[name]?.message as string;
  const validationRules = inputValidations[name as keyof typeof inputValidations] || {};

  const isDropdown = options && options.length > 0; // NEW

  return (
    <div className="input-container">
      <div className={isPassword ? "input-wrapper" : ""}>
        {isDropdown ? (
          <select
            {...register(name, validationRules)}
            className={className}
            
          >
            <option value="">Select Department</option>
            {options.map((opt, idx) => (
              <option key={idx} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        ) : (
          <input
            {...register(name, validationRules)}
            type={isPassword ? (showPassword ? 'text' : 'password') : type}
            className={className}
            placeholder={placeholder}
            {...props}
          />
        )}

        {isPassword && (
          <span className="toggle-icon" onClick={togglePassword}>
            {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
          </span>
        )}
      </div>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default InputField;
