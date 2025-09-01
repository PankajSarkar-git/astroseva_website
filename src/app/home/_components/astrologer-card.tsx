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
const AstrologerCard = ({
  astrologer,
  isLive = false,
}: AstrologerCardProps) => (
  <div
    className={`bg-gradient-to-b from-card-light-orange via-card-orange to-pink-600 to-card-secondary rounded-2xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl hover:scale-105 
                 relative`}
  >
    <div className="flex flex-col items-center text-center">
      <div className="relative mb-4">
        <img
          src={astrologer.imgUri}
          alt={astrologer.name}
          className={`w-20 h-20 rounded-full object-cover border-2 ${isLive ? "border-green-500" : "border-red-500"}`}
        />
        {astrologer.online && (
          <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 border-2 border-white rounded-full"></div>
        )}
      </div>

      <h3 className="font-bold text-white mb-2">{astrologer.name}</h3>
      <p className="text-sm text-white mb-3 line-clamp-2">
        {astrologer.expertise}
      </p>
      {/* <p className="text-orange-600 font-bold mb-4">{astrologer.}</p> */}

      <div className="flex gap-2 w-full justify-between mt-4">
        <button className="h-10 w-10 rounded-full bg-white text-white hover:bg-orange-600 transition-colors duration-200 flex items-center justify-center">
          <Phone className="w-4 h-4 text-black" />
        </button>
        <button className="h-10 w-10 rounded-full bg-white text-white hover:bg-gray-800 transition-colors duration-200 flex items-center justify-center">
          <MessageCircle className="w-4 h-4 text-black" />
        </button>
      </div>
    </div>
  </div>
);

export default AstrologerCard;
