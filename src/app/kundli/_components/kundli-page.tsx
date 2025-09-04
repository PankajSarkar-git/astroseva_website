


"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils/utils";
import { motion } from "framer-motion";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// Import kundli components
import BirthChart from "./birth-chart";
import NavamshaChart from "./navamsha-chart";
import AkshvedanshaChart from "./akshvedansha-chart";
import KundliForm from "./kundliForm/kundli-form";
import BasicDetails from "./basic-details";
import VimshottariDasha from "./vimshottari-dasha";

export default function Kundli() {
  const [activeTab, setActiveTab] = useState(0);
  const [showForm, setShowForm] = useState(true); // open first time
  const [formSubmitted, setFormSubmitted] = useState(false);

  const tabs = [
    { id: 1, label: "Birth Chart", Component: BirthChart },
    { id: 2, label: "Navamsha Chart", Component: NavamshaChart },
    { id: 3, label: "Akshvedansha Chart", Component: AkshvedanshaChart },
    { id: 4, label: "Basic Detail", Component: BasicDetails },
    { id: 5, label: "Vimshottari Dasha", Component: VimshottariDasha },
  ];

  const handleTabClick = (index: number) => setActiveTab(index);

  const ActiveComponent = tabs[activeTab].Component;

  return (
    <div className="flex flex-col h-full bg-background relative">
      {/* Show button in center if form not submitted */}
      {!formSubmitted && (
        <div className="flex flex-col min-h-screen items-center justify-center text-center px-4 py-16 sm:py-24 h-full w-full bg-gradient-to-b from-background to-muted">
          <div className="max-w-2xl">
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight mb-4">
              Discover Your <span className="text-primary">Kundli</span>
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg mb-8">
              Enter your birth details to generate your personalized
              astrological charts. Start with your Birth Chart, Navamsha Chart,
              and Akshvedansha Chart.
            </p>
            <Button
              size="lg"
              className="px-8 py-6 text-lg rounded-xl shadow-lg hover:scale-105 transition-transform"
              onClick={() => setShowForm(true)}
            >
              Open Kundli Form
            </Button>
          </div>
        </div>
      )}

      {/* Show tabs and content after form submission */}
      {formSubmitted && (
        <>
          {/* Tab Header */}
          <div className="flex items-center justify-between border-b border-border px-4">
            <div className="flex overflow-x-auto">
              {tabs.map((tab, index) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(index)}
                  className={cn(
                    "relative py-3 px-4 text-sm font-medium whitespace-nowrap transition-colors",
                    activeTab === index
                      ? "text-primary"
                      : "text-muted-foreground"
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

            {/* Button to reopen form */}
            <Button
              size="sm"
              className="ml-4 px-4 py-2 rounded-md text-white bg-primary hover:bg-primary/80 shadow-md"
              onClick={() => setShowForm(true)}
            >
              Edit Details
            </Button>
          </div>

          {/* Tab Content */}
          <div className="flex-1 flex overflow-x-hidden snap-x snap-mandatory scroll-smooth">
            <div className="snap-start shrink-0 w-full h-full overflow-y-auto">
              <Card className="w-full h-full p-4 rounded-none border-0 shadow-none">
                <ActiveComponent active={activeTab} />
              </Card>
            </div>
          </div>
        </>
      )}

      {/* Form Modal */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl p-0 border-0 shadow-xl bg-transparent">
          <KundliForm
            onSubmitSuccess={() => {
              setFormSubmitted(true);
              setShowForm(false);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
