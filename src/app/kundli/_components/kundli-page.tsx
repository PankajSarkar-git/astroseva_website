// "use client";

// import { useState, useRef, useEffect } from "react";
// import { useAppSelector } from "@/lib/hook/redux-hook";
// import { Card } from "@/components/ui/card";
// import { cn } from "@/lib/utils/utils";
// import { motion } from "framer-motion";

// // Import your existing kundli components (already adapted for web)
// import BirthChart from "./birth-chart";
// import NavamshaChart from "./navamsha-chart";
// import AkshvedanshaChart from "./akshvedansha-chart";
// // import BasicDetails from "@/components/kundli/basic-detail";
// // import VimshottariDasha from "@/components/kundli/vimshottari-dasha";

// export default function Kundli() {
//   const [activeTab, setActiveTab] = useState(0);
//   const containerRef = useRef<HTMLDivElement>(null);

//   const tabs = [
//     { id: 1, label: "Birth Chart", component: <BirthChart active={activeTab} /> },
//     { id: 2, label: "Navamsha Chart", component: <NavamshaChart active={activeTab} /> },
//     { id: 3, label: "Akshvedansha Chart", component: <AkshvedanshaChart active={activeTab} /> },
//     // { id: 4, label: "Basic Detail", component: <BasicDetails active={activeTab} /> },
//     // { id: 5, label: "Vimshottari Dasha", component: <VimshottariDasha active={activeTab} /> },
//   ];

//   const handleTabClick = (index: number) => {
//     setActiveTab(index);
//     const container = containerRef.current;
//     if (container) {
//       container.scrollTo({ left: index * container.clientWidth, behavior: "smooth" });
//     }
//   };

//   const handleScroll = () => {
//     const container = containerRef.current;
//     if (container) {
//       const index = Math.round(container.scrollLeft / container.clientWidth);
//       if (index !== activeTab) setActiveTab(index);
//     }
//   };

//   return (
//     <div className="flex flex-col h-full bg-background">
//       {/* Tab Header */}
//       <div className="flex overflow-x-auto border-b border-border px-4">
//         {tabs.map((tab, index) => (
//           <button
//             key={tab.id}
//             onClick={() => handleTabClick(index)}
//             className={cn(
//               "relative py-3 px-4 text-sm font-medium whitespace-nowrap transition-colors",
//               activeTab === index ? "text-primary" : "text-muted-foreground"
//             )}
//           >
//             {tab.label}
//             {activeTab === index && (
//               <motion.div
//                 layoutId="underline"
//                 className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
//               />
//             )}
//           </button>
//         ))}
//       </div>

//       {/* Scrollable Content */}
//       <div
//         ref={containerRef}
//         onScroll={handleScroll}
//         className="flex-1 flex overflow-x-hidden snap-x snap-mandatory scroll-smooth"
//       >
//         {tabs.map((tab) => (
//           <div
//             key={tab.id}
//             className="snap-start shrink-0 w-full h-full overflow-y-auto"
//           >
//             <Card className="w-full h-full p-4 rounded-none border-0 shadow-none">
//               {tab.component}
//             </Card>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import { useAppSelector } from "@/lib/hook/redux-hook";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils/utils";
import { motion } from "framer-motion";
import { Dialog, DialogContent } from "@/components/ui/dialog";

// Import your kundli components
import BirthChart from "./birth-chart";
import NavamshaChart from "./navamsha-chart";
import AkshvedanshaChart from "./akshvedansha-chart";
import KundliForm from "./kundli-form";

export default function Kundli() {
  const [activeTab, setActiveTab] = useState(0);
  const [showForm, setShowForm] = useState(true); 

  const tabs = [
    {
      id: 1,
      label: "Birth Chart",
      component: <BirthChart active={activeTab} />,
    },
    {
      id: 2,
      label: "Navamsha Chart",
      component: <NavamshaChart active={activeTab} />,
    },
    {
      id: 3,
      label: "Akshvedansha Chart",
      component: <AkshvedanshaChart active={activeTab} />,
    },
  ];

  const handleTabClick = (index: number) => setActiveTab(index);

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Tab Header */}
      <div className="flex overflow-x-auto border-b border-border px-4">
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(index)}
            className={cn(
              "relative py-3 px-4 text-sm font-medium whitespace-nowrap transition-colors",
              activeTab === index ? "text-primary" : "text-muted-foreground"
            )}
          >
            {tab.label}
            {activeTab === index && (
              <motion.div
                layoutId="underline"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
              />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 flex overflow-x-hidden snap-x snap-mandatory scroll-smooth">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className="snap-start shrink-0 w-full h-full overflow-y-auto"
          >
            <Card className="w-full h-full p-4 rounded-none border-0 shadow-none">
              {tab.component}
            </Card>
          </div>
        ))}
      </div>

      {/* Form Modal */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl p-0 border-0 shadow-xl bg-transparent">
          <KundliForm
            onSubmitSuccess={() => setShowForm(false)} // 👈 close modal when submitted
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
