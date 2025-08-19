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
import { useAppDispatch } from "@/lib/hook/redux-hook";
import { getAllAstrologers } from "@/lib/store/reducer/astrologers";
import { Astrologers } from "@/lib/utils/types";
import { getBanner } from "@/lib/store/reducer/general";
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
  const [loading, setLoading] = useState<{
    banner: boolean;
    astrologer: boolean;
    onlineAstrologer: boolean;
  }>({
    banner: false,
    astrologer: false,
    onlineAstrologer: false,
  });
  const [banner, setBanner] = useState<{ imgUrl: string; id: string }[]>([]);
  const [onlineAstrologers, setOnlineAstrologers] = useState([]);
  const [astrologersData, setAstrologersData] = useState<
    {
      name: string;
      expertise: string;
      about: string;
      imgUri: string;
      id: string;
      userId: string;
      online: boolean;
    }[]
  >([]);

  const dispatch = useAppDispatch();

  // Simulate loading states
  useEffect(() => {
    getBannerData();
    fetchAstrologersData();
  }, []);

  const fetchAstrologersData = async (pageNumber = 1, append = false) => {
    if (loading.astrologer) return;
    try {
      setLoading((prev) => ({ ...prev, astrologer: true }));

      const payload = await dispatch(getAllAstrologers(`?page=1`)).unwrap();

      if (payload.success) {
        console.log("payload", payload);

        const newData =
          payload.astrologers.map((item: Astrologers) => ({
            name: item?.user?.name,
            expertise: item?.expertise,
            about: item?.about,
            id: item?.id,
            imgUri: item?.user?.imgUri,
            userId: item?.user?.id,
            online: item?.online,
          })) || [];

        setAstrologersData(newData);
      }
    } catch (error) {
    } finally {
      setLoading((prev) => ({ ...prev, astrologer: false }));
    }
  };
  console.log("astrologersData", astrologersData);

  const getBannerData = async () => {
    if (loading.banner) return;
    try {
      setLoading((prev) => ({ ...prev, banner: true }));

      const payload = await dispatch(getBanner()).unwrap();

      if (payload.success) {
        setBanner(payload.bannars);
      }
    } catch (error) {
    } finally {
      setLoading((prev) => ({ ...prev, banner: false }));
    }
  };

  const handleSearchChange = (e: any) => {
    setSearch(e.target.value);
  };

  const handleSearchSubmit = () => {
    console.log("Navigating to Astrologers with search:", search);
    // Navigate to Astrologers page
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
  const onlineAstrologersFiltered = astrologersData.filter(
    (a) => a.online === true
  );
  return (
    <div className="min-h-screen  bg-gradient-to-br from-orange-50 via-purple-50 to-blue-50">
      {/* Header with Search */}
      <div className="bg-yellow-400 py-8">
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
            onClick={() => {}}
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
                  {banner.map((item) => (
                    <CarouselItem key={item.id} className="pl-4">
                      <img
                        src={item.imgUrl}
                        alt="Banner"
                        className="w-full max-h-80 object-fill rounded-xl"
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
        {onlineAstrologersFiltered.length > 0 && (
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
                    {astrologersData
                      .filter((a) => a.online === true)
                      .map((astrologer) => (
                        <CarouselItem
                          key={astrologer.id}
                          className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3"
                        >
                          <div className="flex justify-center">
                            <div className="w-80">
                              <AstrologerCard
                                astrologer={astrologer}
                                isLive={astrologer.online}
                              />
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
        )}

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
      <div className="fixed bottom-6 left-6 right-6 flex flex-col sm:flex-row gap-3 sm:justify-between pointer-events-none">
        <button
          onClick={handleCallNow}
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-full 
               shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 
               flex items-center justify-center space-x-2 pointer-events-auto w-full sm:w-auto"
        >
          <Phone className="w-5 h-5" />
          <span className="font-semibold">Call Now</span>
        </button>

        <button
          onClick={handleChatNow}
          className="bg-gray-700 hover:bg-gray-800 text-white px-6 py-3 rounded-full 
               shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 
               flex items-center justify-center space-x-2 pointer-events-auto w-full sm:w-auto"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="font-semibold">Chat Now</span>
        </button>
      </div>
    </div>
  );
};

export default Home;
