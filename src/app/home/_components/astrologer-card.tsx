"use-client";
import { MessageCircle, Phone } from "lucide-react";

// Astrologer Card Component
const AstrologerCard = ({ astrologer, isLive = false }) => (
  <div
    className={`bg-white rounded-2xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl hover:scale-105 
                   ${isLive ? "border-2 border-green-400" : ""} relative`}
  >
    {isLive && astrologer.online && (
      <div className="absolute -top-2 -right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center">
        <div className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse"></div>
        LIVE
      </div>
    )}

    <div className="flex flex-col items-center text-center">
      <div className="relative mb-4">
        <img
          src={astrologer.avatar}
          alt={astrologer.name}
          className="w-20 h-20 rounded-full object-cover border-4 border-orange-200"
        />
        {astrologer.online && (
          <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 border-2 border-white rounded-full"></div>
        )}
      </div>

      <h3 className="font-bold text-gray-800 mb-2">{astrologer.name}</h3>
      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
        {astrologer.specialty}
      </p>
      <p className="text-orange-600 font-bold mb-4">{astrologer.rate}</p>

      <div className="flex gap-2 w-full">
        <button className="flex-1 bg-orange-500 text-white py-2 px-3 rounded-lg hover:bg-orange-600 transition-colors duration-200 flex items-center justify-center">
          <Phone className="w-4 h-4 mr-1" />
          Call
        </button>
        <button className="flex-1 bg-gray-700 text-white py-2 px-3 rounded-lg hover:bg-gray-800 transition-colors duration-200 flex items-center justify-center">
          <MessageCircle className="w-4 h-4 mr-1" />
          Chat
        </button>
      </div>
    </div>
  </div>
);

export default AstrologerCard;
