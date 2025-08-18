"use client";
import React, { useEffect, useState, useRef } from "react";
import {
  Search,
  Phone,
  MessageCircle,
  Star,
  ArrowRight,
  SearchIcon,
} from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import QuickNavigation from "./quick-navigation";
import AstrologerCard from "./astrologer-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

// Mock data for demonstration
const introCardData = [
  {
    id: 1,
    name: "Pt. Raveena Tandon",
    rate: "10 Rs / Min",
    avatar: "https://i.pravatar.cc/300?img=9",
    specialty: "Specialist in Vedic Gyan",
    online: true,
  },
  {
    id: 2,
    name: "Acharya Ved Prakash",
    rate: "12 Rs / Min",
    avatar: "https://i.pravatar.cc/300?img=8",
    specialty: "Expert in Love & Marriage Solutions",
    online: true,
  },
  {
    id: 3,
    name: "Guru Anand Joshi",
    rate: "15 Rs / Min",
    avatar: "https://i.pravatar.cc/300?img=7",
    specialty: "Career & Finance Consultant",
    online: false,
  },
  {
    id: 4,
    name: "Mata Sushila Devi",
    rate: "8 Rs / Min",
    avatar: "https://i.pravatar.cc/300?img=6",
    specialty: "Spiritual & Reiki Healer",
    online: false,
  },
  {
    id: 6,
    name: "Rushila Devi",
    rate: "8 Rs / Min",
    avatar: "https://i.pravatar.cc/300?img=6",
    specialty: "Spiritual & Reiki Healer",
    online: true,
  },
];

const bannerData = [
  {
    id: "1",
    imgUrl:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=300&fit=crop",
  },
  {
    id: "2",
    imgUrl:
      "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=300&fit=crop",
  },
  {
    id: "3",
    imgUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=300&fit=crop",
  },
];

// Shimmer/Skeleton component
const SkeletonItem = ({ className = "" }) => (
  <div
    className={`bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse rounded-lg ${className}`}
  >
    <div className="w-full h-full bg-gradient-to-r from-transparent via-white to-transparent opacity-40 animate-pulse"></div>
  </div>
);

// Main Home Component
const Home = () => {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState({
    banner: false,
    astrologer: false,
    onlineAstrologer: false,
  });
  const [astrologersData, setAstrologersData] = useState(introCardData);
  const [onlineAstrologers, setOnlineAstrologers] = useState(
    introCardData.filter((a) => a.online)
  );
  const router = useRouter();

  // Simulate loading states
  useEffect(() => {
    setLoading({ banner: true, astrologer: true, onlineAstrologer: true });

    setTimeout(() => {
      setLoading({ banner: false, astrologer: false, onlineAstrologer: false });
    }, 1500);
  }, []);

  const handleSearchChange = (e: any) => {
    setSearch(e.target.value);
  };

  const handleSearchSubmit = () => {
    console.log("Navigating to Astrologers with search:", search);
    // Navigate to Astrologers page
    router.push(`/astrologers?search=${encodeURIComponent(search)}`);
  };

  const handleQuickNavigation = (nav: string) => {
    console.log("Quick navigation to:", nav);
    switch (nav) {
      case "horoscope":
        // Navigate to Horoscope
        break;
      case "kundli":
        // Navigate to KundliForm
        break;
      case "match-making":
        // Navigate to Astrologers with marriage filter
        break;
      case "tarot":
        // Navigate to Astrologers with tarot filter
        break;
    }
  };

  const handleCallNow = () => {
    console.log("Navigate to Astrologers for calling");
  };

  const handleChatNow = () => {
    console.log("Navigate to Astrologers for chatting");
  };

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-orange-50 via-purple-50 to-blue-50">
      {/* Header with Search */}
      <div className="bg-surface-primary-surface py-12">
        <div className="container mx-auto max-w-[600px] px-4 flex gap-4">
          <Input
            className="bg-white rounded-full h-10"
            leftIcon={<SearchIcon className="h-4 w-4" />}
            value={search}
            onChange={handleSearchChange}
            placeholder="Search here for pandits"
          />
          <Button
            className="h-10 rounded-full bg-white text-black border border-white cursor-pointer hover:bg-white hover:border-surface-primary-surface"
            onClick={handleSearchSubmit}
          >
            Search
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 md:px-12 py-8 space-y-12">
        {/* Quick Navigation */}
        <section>
          <QuickNavigation onClick={handleQuickNavigation} />
        </section>

        {/* Banner Carousel */}
        <section>
          {loading.banner ? (
            <div className="px-5">
              <SkeletonItem className="h-32 md:h-60" />
            </div>
          ) : (
            <div className="px-5 flex justify-center">
              <Carousel className="w-[90%]">
                <CarouselContent className="-ml-4">
                  {bannerData.map((item) => (
                    <CarouselItem key={item.id} className="pl-4">
                      <img
                        src={item.imgUrl}
                        alt="Banner"
                        className="w-full h-60 md:h-80 object-cover rounded-xl"
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </div>
          )}
        </section>

        {/* Live Astrologers */}
        <section>
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-8">
            Live Astrologer
          </h2>

          {loading.onlineAstrologer ? (
            <div className="flex justify-center">
              <SkeletonItem className="w-80 h-96" />
            </div>
          ) : (
            <div className="px-5 flex justify-center">
              <Carousel
                plugins={[Autoplay({ delay: 3000 })]}
                opts={{ loop: true, align: "start" }}
                className="w-[90%]"
              >
                <CarouselContent className="-ml-4 my-8">
                  {onlineAstrologers.map((astrologer) => (
                    <CarouselItem
                      key={astrologer.id}
                      className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3"
                    >
                      <div className="flex justify-center">
                        <div className="w-80">
                          <AstrologerCard astrologer={astrologer} isLive />
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </div>
          )}
        </section>

        {/* Divider */}
        <div className="flex justify-center">
          <div className="w-4/5 h-px bg-gray-300"></div>
        </div>

        {/* Top Astrologers */}
        <section>
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-8">
            Top Astrologers
          </h2>
          {loading.astrologer ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-5">
              {[...Array(4)].map((_, i) => (
                <SkeletonItem key={i} className="h-80" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-5">
              {astrologersData.map((astrologer) => (
                <AstrologerCard key={astrologer.id} astrologer={astrologer} />
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Fixed Action Buttons */}
      <div className="fixed bottom-6 left-6 right-6 flex justify-between pointer-events-none">
        <button
          onClick={handleCallNow}
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-full 
                     shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 
                     flex items-center space-x-2 pointer-events-auto"
        >
          <Phone className="w-5 h-5" />
          <span className="font-semibold">Call Now</span>
        </button>

        <button
          onClick={handleChatNow}
          className="bg-gray-700 hover:bg-gray-800 text-white px-6 py-3 rounded-full 
                     shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 
                     flex items-center space-x-2 pointer-events-auto"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="font-semibold">Chat Now</span>
        </button>
      </div>
    </div>
  );
};

export default Home;
