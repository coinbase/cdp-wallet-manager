import React from 'react';

interface CustomInputProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  min?: string;
  step?: string;
}

const CustomInput: React.FC<CustomInputProps> = ({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  required,
  min,
  step
}) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        min={min}
        step={step}
        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md 
                   focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 
                   transition duration-200 ease-in-out"
      />
    </div>
  );
};

export default CustomInput;