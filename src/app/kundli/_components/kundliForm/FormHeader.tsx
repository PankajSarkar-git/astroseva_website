import React from "react";
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";


interface FormHeaderProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

const FormHeader: React.FC<FormHeaderProps> = ({ 
  title, 
  description,
}) => {
  return (
    <CardHeader className="pb-6">
      <div className="flex items-center space-x-3">
        <div>
          <CardTitle className="text-2xl font-bold text-text-primary">
            {title}
          </CardTitle>
          <CardDescription className="text-gray-600 mt-1">
            {description}
          </CardDescription>
        </div>
      </div>
    </CardHeader>
  );
};

export default FormHeader;