"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hook/redux-hook";
import { kundliChart } from "@/lib/store/reducer/kundli";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { makeResponsiveSVG } from "@/lib/utils/utils";

export default function NavamshaChart({
  forModal = false,
  active,
  chartWidth,
}: {
  forModal?: boolean;
  active?: number;
  chartWidth?: number;
}) {
  const [width, setWidth] = useState<number>(chartWidth ?? 600);
  const [changeKundliOpen, setChangeKundliOpen] = useState(false);
  const { kundliPerson } = useAppSelector((state) => state.kundli);
  const [chartSvg, setChartSvg] = useState<string | null>(null);
  const { t, i18n } = useTranslation(); // ✅ access i18n
  const [loading, setLoading] = useState(false);

  const [selectedKundliType, setSelectedKundliType] = useState(
    i18n.language === "bn"
      ? { label: "East-Indian Style", id: "east_indian_style", value: "east" }
      : { label: "North-Indian Style", id: "north_indian_style", value: "north" }
  );

  const dispatch = useAppDispatch();

  const getKundliChartData = async () => {
    try {
      setLoading(true);

      const body = {
        ...kundliPerson,
        birthPlace: "Varanasi",
        latitude: 25.317645,
        longitude: 82.973915,
      };

      const payload: any = await dispatch(
        kundliChart({
          body,
          query: {
            chartType: "D9",
            chartStyle: selectedKundliType.value,
            lan: i18n.language, // ✅ use active language
          },
        })
      ).unwrap();

      if (payload) setChartSvg(payload);
    } catch (err) {
      toast.error("Failed to fetch chart");
    } finally {
      setLoading(false);
    }
  };

  // handle resize
  useEffect(() => {
    if (!chartWidth) {
      const handleResize = () => setWidth(window.innerWidth);
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, [chartWidth]);

  // fetch chart when active + dependencies change
  useEffect(() => {
    if (active === 1) {
      getKundliChartData();
    }
  }, [dispatch, kundliPerson, selectedKundliType, active, i18n.language]); // ✅ re-fetch when language changes

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-pink-600" />
        <p className="mt-2 text-gray-600">Please wait a moment…</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 px-5">
        <Card className="flex-1 px-4 py-2 text-center border rounded-full">
          <p className="text-base font-medium">{selectedKundliType.label}</p>
        </Card>
        <Button
          size="icon"
          variant="outline"
          className="rounded-full bg-gray-100"
          onClick={() => setChangeKundliOpen(true)}
        >
          <RefreshCw className="h-5 w-5" />
        </Button>
      </div>

      {/* Kundli Chart */}
      <div className="flex justify-center">
        {chartSvg ? (
          <div
            className="w-[500px] h-[500px]"
            dangerouslySetInnerHTML={{
              __html: makeResponsiveSVG(chartSvg, "600px", "90vh", true),
            }}
          />
        ) : (
          <p className="text-gray-500">No Kundli to show</p>
        )}
      </div>

      <p className="text-center text-sm text-gray-500">
        You can download this kundli with all the additional details using the
        top right button in PDF format.
      </p>

      {/* Change Kundli Type Modal */}
      <Dialog open={changeKundliOpen} onOpenChange={setChangeKundliOpen}>
        <DialogContent className="p-6 max-w-md">
          <h2 className="text-lg font-semibold mb-4">Change Kundli Type</h2>
          <div className="space-y-3">
            {[
              { label: "North-Indian Style", id: "north_indian_style", value: "north" },
              { label: "East-Indian Style", id: "east_indian_style", value: "east" },
            ].map((option) => (
              <motion.button
                key={option.value}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setSelectedKundliType(option);
                  setChangeKundliOpen(false);
                }}
                className={`w-full px-4 py-2 rounded-md border text-left ${
                  selectedKundliType.value === option.value
                    ? "bg-pink-100 border-pink-400"
                    : "hover:bg-gray-100"
                }`}
              >
                {option.label}
              </motion.button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
