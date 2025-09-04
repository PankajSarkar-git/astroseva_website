import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface ErrorAlertProps {
  errors: string[];
  className?: string;
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({ 
  errors, 
  className = "" 
}) => {
  if (errors.length === 0) return null;

  return (
    <Alert className={`border-red-200 bg-red-50 ${className}`}>
      <AlertCircle className="h-4 w-4 text-red-500" />
      <AlertDescription className="text-red-700">
        {errors.length === 1 ? (
          <span className="text-sm">{errors[0]}</span>
        ) : (
          <ul className="space-y-1">
            {errors.map((error, index) => (
              <li key={index} className="flex items-start space-x-2">
                <span className="text-red-500 text-xs mt-1">•</span>
                <span className="text-sm">{error}</span>
              </li>
            ))}
          </ul>
        )}
      </AlertDescription>
    </Alert>
  );
};

export default ErrorAlert;