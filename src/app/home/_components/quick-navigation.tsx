import HoroscopeIcon from "@/assets/icons/horoscope-icon";
import KundliBookIcon from "@/assets/icons/kundli-book-icon";
import MatchmakingIcon from "@/assets/icons/match-making-icon";
import TarotIcon from "@/assets/icons/tarot-icon";
import { useRouter } from "next/navigation";

// Quick Navigation Component
const QuickNavigation = ({ onClick }: { onClick: (id: string) => void }) => {
  const quickNavItems = [
    {
      id: "horoscope",
      title: "Horoscope",
      icon: <HoroscopeIcon size={24} />,
      color: "border border-surface-highlight",
      url: "/horoscope",
    },
    {
      id: "kundli",
      title: "Kundli",
      icon: <KundliBookIcon />,
      color: "border border-surface-highlight",
      url: "/kundli",
    },
    {
      id: "match-making",
      title: "Match Making",
      icon: <MatchmakingIcon size={24} />,
      color: "border border-surface-highlight",
      url: "/match-making",
    },
    {
      id: "tarot",
      title: "Tarot",
      icon: <TarotIcon size={30} />,
      color: "border border-surface-highlight",
      url: "/tarot",
    },
  ];

  const router = useRouter();

  return (
    <div className="grid grid-cols-4 gap-4 px-5">
      {quickNavItems.map((item) => (
        <div key={item.id} className="flex flex-col items-center">
          <button
            onClick={() => {
              onClick(item.id);
              router.push(item.url);
            }}
            className={`${item.color} h-16 w-16 flex justify-center items-center rounded-full bg-surface-highlight shadow-lg hover:scale-105 
                     transform transition-all duration-300 hover:shadow-xl cursor-pointer`}
          >
            <div className="text-4xl mb-2">{item.icon}</div>
          </button>
          <div className="text-sm font-semibold text-center">{item.title}</div>
        </div>
      ))}
    </div>
  );
};

export default QuickNavigation;
