import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Option {
  value: string;
  label: string;
}

interface FormFieldProps {
  id: string;
  label: string;
  type?: 'text' | 'time' | 'select' | 'custom';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  icon?: React.ReactNode;
  options?: Option[];
  children?: React.ReactNode;
  required?: boolean;
}

const FormField: React.FC<FormFieldProps> = ({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  icon,
  options = [],
  children,
  required = false
}) => {
  const renderInput = () => {
    switch (type) {
      case 'select':
        return (
          <Select value={value} onValueChange={onChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      
      case 'custom':
        return children;
      
      default:
        return (
          <Input
            id={id}
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="border-gray-200"
          />
        );
    }
  };

  return (
    <div className="space-y-2">
      <Label 
        htmlFor={id} 
        className="text-sm font-semibold text-gray-700 flex items-center space-x-2"
      >
        {icon && icon}
        <span>{label}</span>
        {required && <span className="text-red-500">*</span>}
      </Label>
      {renderInput()}
    </div>
  );
};

export default FormField;