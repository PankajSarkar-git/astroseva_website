import React from "react";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";

interface CoordinatesDisplayProps {
  latitude: number;
  longitude: number;
  className?: string;
}

const CoordinatesDisplay: React.FC<CoordinatesDisplayProps> = ({
  latitude,
  longitude,
  className = ""
}) => {
  if (!latitude && !longitude) return null;

  return (
    <div className={`flex items-center space-x-4 p-3 bg-purple-50 rounded-lg ${className}`}>
      <Badge variant="secondary" className="bg-purple-100 text-purple-800 flex items-center space-x-1">
        <MapPin className="h-3 w-3" />
        <span>Coordinates</span>
      </Badge>
      <span className="text-sm text-gray-600">
        {latitude.toFixed(4)}°, {longitude.toFixed(4)}°
      </span>
    </div>
  );
};

export default CoordinatesDisplay;