// Quick Navigation Component
const QuickNavigation = ({ onClick }: { onClick: (id: string) => void }) => {
  const quickNavItems = [
    {
      id: "horoscope",
      title: "Horoscope",
      icon: "🔮",
      color: "border border-surface-highlight",
    },
    {
      id: "kundli",
      title: "Kundli",
      icon: "📊",
      color: "border border-surface-highlight",
    },
    {
      id: "match-making",
      title: "Match Making",
      icon: "💕",
      color: "border border-surface-highlight",
    },
    {
      id: "tarot",
      title: "Tarot",
      icon: "🃏",
      color: "border border-surface-highlight",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-5 min-h-52 mb-8">
      {quickNavItems.map((item) => (
        <button
          key={item.id}
          onClick={() => onClick(item.id)}
          className={`${item.color} p-4 rounded-xl shadow-lg hover:scale-105 
                     transform transition-all duration-300 hover:shadow-xl cursor-pointer`}
        >
          <div className="text-4xl mb-2">{item.icon}</div>
          <div className="text-sm font-semibold">{item.title}</div>
        </button>
      ))}
    </div>
  );
};

export default QuickNavigation;
