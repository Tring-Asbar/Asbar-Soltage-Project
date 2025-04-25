import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import './InputField.scss'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  className?: string;
  placeholder?: string;
}

const InputField: React.FC<InputProps> = ({ name, className, placeholder, type, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const inputValidations = {
    FirstName: {
      required: "Should not be empty",
      pattern: {
        value: /^[A-Za-z\s]+$/,
        message: "Enter a valid name",
      },
    },
    LastName: {
      required: "Should not be empty",
      pattern: {
        value: /^[A-Za-z\s]+$/,
        message: "Enter a valid name",
      },
    },
    
    Password:{
      required:"Password is required"
    },
    Email: {
      required: "Email is required",
      pattern: {
        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: "Enter a valid email address",
      },
    },
    
    Department: {
      required: "Department is required",
      
    },
  };

  const isPassword = type === 'password';
  const togglePassword = () => setShowPassword((prev) => !prev);

  const error = errors[name]?.message as string;
  const validationRules = inputValidations[name as keyof typeof inputValidations] || {};


  return (
    <div className="input-container">
      <div className={type==='password'?"input-wrapper":""}>
        <input
          {...register(name, validationRules)}
          type={isPassword?(showPassword ? 'text' : 'password'):type}
          className={className}
          placeholder={placeholder}
          {...props}
        />
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
