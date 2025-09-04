"use-client";
import { MessageCircle, Phone } from "lucide-react";
interface AstrologerCardProps {
  astrologer: {
    name: string;
    expertise: string;
    about: string;
    imgUri: string;
    id: string;
    userId: string;
    online: boolean;
  };
  isLive?: boolean;
}

// Astrologer Card Component
const SmallAstrologerCard = ({
  astrologer,
  isLive = false,
}: AstrologerCardProps) => (
  <div
    className={`bg-surface-tertiary-surface rounded-2xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl hover:scale-105 
                 relative`}
  >
    <div className="flex flex-row gap-4 items-center justify-center text-center">
      <div className="relative flex-shrink-0">
        <img
          src={astrologer.imgUri}
          alt={astrologer.name}
          className={`w-20 h-20  rounded-full object-cover border-2 ${isLive ? "border-green-500" : "border-red-500"}`}
        />
      </div>

      <div className="flex flex-col items-start text-left">
        <h3 className="font-bold text-text-pink mb-2">{astrologer.name}</h3>
        <p className="text-sm text-text-secondary mb-3 line-clamp-2">
          {astrologer.expertise}
        </p>
      </div>
    </div>
  </div>
);

export default SmallAstrologerCard;
