import React, { useState } from 'react';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const InputField: React.FC<InputProps> = ({ ...props }) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = props.type === 'password';
  const togglePassword = () => setShowPassword((prev) => !prev);

  return (
    <div>
      <input
        {...props}
        type={isPassword ? (showPassword ? 'text' : 'password') : props.type}
        className={props.className} 
      />
      {/* {isPassword && (
        <span
        className='toggle-icon'
          onClick={togglePassword}>
          {showPassword ? <VisibilityIcon/> : <VisibilityOffIcon/>}
        </span>
      )} */}
    </div>
  );
};

export default InputField;
