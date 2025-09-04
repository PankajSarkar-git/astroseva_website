"use client";

import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hook/redux-hook";
import { kundliVimshottari } from "@/lib/store/reducer/kundli";
import { useTranslation } from "react-i18next";
import { parseISO, isValid, format, differenceInDays } from "date-fns";
import { cn } from "@/lib/utils/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, ChevronDown, ChevronRight } from "lucide-react";

// ------------------ TYPES ------------------
interface DashaPeriod {
  start_date?: string;
  end_date?: string;
  start_time?: string;
  end_time?: string;
  antar_dasha?: { [key: string]: DashaPeriod };
}

interface DashaData {
  [key: string]: DashaPeriod;
}

interface ProcessedDashaItem {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  duration: string;
  hasSubPeriods: boolean;
  subPeriods?: ProcessedDashaItem[];
  level: number;
  parentPlanet?: string;
}

// ------------------ COMPONENT ------------------
const VimshottariDasha = ({ active }: { active?: number }) => {
  const [rawData, setRawData] = useState<DashaData | null>(null);
  const [processedData, setProcessedData] = useState<ProcessedDashaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [selectedPlanet, setSelectedPlanet] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"overview" | "detailed">("overview");
  const [dashaType, setDashaType] = useState<
    "maha-dasha" | "antar-dasha" | "pratyantar-dasha" | "sookshma-dasha"
  >("antar-dasha");
  const [showDashaModal, setShowDashaModal] = useState(false);
  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const kundliPerson = useAppSelector((state) => state.kundli.kundliPerson);

  // ------------------ HELPERS ------------------
  const safeFormatDate = (dateString: string): string => {
    const parsed = parseISO(dateString);
    return isValid(parsed) ? format(parsed, "dd-MM-yyyy") : "";
  };

  const calculateDuration = (startDate: string, endDate: string): string => {
    const start = parseISO(startDate);
    const end = parseISO(endDate);
    if (!isValid(start) || !isValid(end)) return "";

    const diffDays = differenceInDays(end, start);
    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);
    const days = diffDays % 30;

    if (years > 0) return `${years}y ${months}m ${days}d`;
    if (months > 0) return `${months}m ${days}d`;
    return `${days}d`;
  };

  const NESTED_KEYS = ["antar_dasha", "pratyantar_dasha", "sookshma_dasha"];

  const processDashaData = (
    data: DashaData,
    level: number = 0,
    parentId: string = "",
    parentPlanet?: string
  ): ProcessedDashaItem[] => {
    return Object.entries(data).flatMap(([planet, period], index) => {
      const startDateRaw = period.start_date || period.start_time || "";
      const endDateRaw = period.end_date || period.end_time || "";

      const startDate = parseISO(startDateRaw);
      const endDate = parseISO(endDateRaw);

      if (!isValid(startDate) || !isValid(endDate)) return [];

      const id = `${parentId ? `${parentId}-` : ""}${planet}-${level}-${index}`;

      const item: ProcessedDashaItem = {
        id,
        title: planet,
        startDate: startDateRaw,
        endDate: endDateRaw,
        duration: calculateDuration(startDateRaw, endDateRaw),
        hasSubPeriods: false,
        level,
        parentPlanet,
      };

      for (const key of NESTED_KEYS) {
        if (period[key as keyof DashaPeriod]) {
          item.hasSubPeriods = true;
          item.subPeriods = processDashaData(
            period[key as keyof DashaPeriod] as DashaData,
            level + 1,
            id,
            planet
          );
          break;
        }
      }

      return [item];
    });
  };

  const flattenDashaData = (
    items: ProcessedDashaItem[]
  ): ProcessedDashaItem[] =>
    items.reduce<ProcessedDashaItem[]>((acc, item) => {
      acc.push(item);
      if (item.subPeriods) acc.push(...flattenDashaData(item.subPeriods));
      return acc;
    }, []);

  const toggleExpansion = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) newExpanded.delete(itemId);
    else newExpanded.add(itemId);
    setExpandedItems(newExpanded);
  };

  const getCurrentActiveDasha = (
    data: ProcessedDashaItem[]
  ): ProcessedDashaItem | null => {
    const now = new Date();
    const allItems = flattenDashaData(data);

    return (
      allItems.find((item) => {
        const start = parseISO(item.startDate);
        const end = parseISO(item.endDate);
        return isValid(start) && isValid(end) && now >= start && now <= end;
      }) || null
    );
  };

  const fetchKundliDetails = async () => {
    setLoading(true);
    try {
      const payload = await dispatch(
        kundliVimshottari({
          body: {
            ...kundliPerson,
            birthPlace: "Varanasi",
            latitude: 25.317645,
            longitude: 82.973915,
          },
          query: { dashaType, lan: i18n.language }, // ✅ use i18n.language here
        })
      ).unwrap();

      if (payload.success) {
        const dashaDetails = payload.dasha.data.maha_dasha;
        setRawData(dashaDetails);
        const processed = processDashaData(dashaDetails);
        setProcessedData(processed);
      }
    } catch (err) {
      console.error("Error fetching kundli details:", err);
    } finally {
      setLoading(false);
      setShowDashaModal(false);
    }
  };

  useEffect(() => {
    if (active === 4) {
      fetchKundliDetails();
      setExpandedItems(new Set());
    }
  }, [dispatch, kundliPerson, dashaType, active]);

  // ------------------ RENDERERS ------------------
  const getPlanetColor = (planet: string): string => {
    const colors: { [key: string]: string } = {
      Sun: "#FFD700",
      Moon: "#C0C0C0",
      Mars: "#FF4500",
      Mercury: "#32CD32",
      Jupiter: "#FF6347",
      Venus: "#FF69B4",
      Saturn: "#4169E1",
      Rahu: "#8B4513",
      Ketu: "#808080",
    };
    return colors[planet] || "#6B7280";
  };

  const renderDashaCard = (item: ProcessedDashaItem) => {
    const isExpanded = expandedItems.has(item.id);
    const isActive = getCurrentActiveDasha([item])?.id === item.id;

    return (
      <Card
        key={item.id}
        className={cn(
          "mb-4 border-l-4 rounded-md overflow-hidden",
          isActive
            ? "border-l-green-600 bg-green-50"
            : "border-l-gray-300 bg-muted/30",
          `ml-${item.level * 4}`
        )}
      >
        <div
          className="flex items-center justify-between p-4 cursor-pointer"
          onClick={() => item.hasSubPeriods && toggleExpansion(item.id)}
        >
          <div className="flex items-center flex-1">
            <div
              className="w-3 h-3 rounded-full mr-3"
              style={{ backgroundColor: getPlanetColor(item.title) }}
            />
            <div>
              <p
                className={cn(
                  "text-base font-semibold",
                  isActive && "text-green-700"
                )}
              >
                {item.title}{" "}
                {item.parentPlanet && (
                  <span className="text-sm text-gray-500 font-normal">
                    in {item.parentPlanet}
                  </span>
                )}
              </p>
              <p className="text-xs text-gray-500 mt-1">{item.duration}</p>
            </div>
          </div>

          {item.hasSubPeriods &&
            (isExpanded ? (
              <ChevronDown size={16} />
            ) : (
              <ChevronRight size={16} />
            ))}
        </div>

        <div className="flex justify-between px-4 pb-4 text-sm text-gray-700">
          <div className="flex-1 text-center">
            <p className="text-xs text-gray-500">Start</p>
            <p>{safeFormatDate(item.startDate)}</p>
          </div>
          <div className="w-px bg-gray-300 mx-4" />
          <div className="flex-1 text-center">
            <p className="text-xs text-gray-500">End</p>
            <p>{safeFormatDate(item.endDate)}</p>
          </div>
        </div>

        {isActive && (
          <div className="bg-green-100 px-4 py-2">
            <p className="text-xs text-green-700 font-semibold">
              ● Currently Active
            </p>
          </div>
        )}

        {isExpanded && item.subPeriods && (
          <div className="bg-gray-50 px-2">
            {item.subPeriods.map((sub) => renderDashaCard(sub))}
          </div>
        )}
      </Card>
    );
  };

  const renderOverview = () => {
    const activeDasha = getCurrentActiveDasha(processedData);

    return (
      <ScrollArea className="h-[80vh] p-4">
        {activeDasha && (
          <Card className="bg-pink-600 text-white rounded-lg p-5 mb-5 text-center">
            <h2 className="text-lg font-semibold mb-3">
              Current Active Period
            </h2>
            <div className="flex items-center justify-center">
              <div
                className="w-5 h-5 rounded-full mr-4"
                style={{ backgroundColor: getPlanetColor(activeDasha.title) }}
              />
              <div>
                <p className="text-xl font-bold">{activeDasha.title}</p>
                <p className="text-sm">
                  {safeFormatDate(activeDasha.startDate)} -{" "}
                  {safeFormatDate(activeDasha.endDate)}
                </p>
              </div>
            </div>
          </Card>
        )}

        <Card className="p-5">
          <h2 className="text-lg font-semibold text-center mb-4">
            Dasha Timeline
          </h2>
          {processedData.map((item, index) => (
            <div key={item.id} className="flex mb-4">
              <div className="flex flex-col items-center mr-4">
                <div
                  className="w-4 h-4 rounded-full mb-2"
                  style={{ backgroundColor: getPlanetColor(item.title) }}
                />
                {index < processedData.length - 1 && (
                  <div className="w-[2px] flex-1 bg-gray-300" />
                )}
              </div>
              <div>
                <p className="font-semibold">{item.title}</p>
                <p className="text-xs text-gray-500">{item.duration}</p>
                <p className="text-xs text-gray-400">
                  {safeFormatDate(item.startDate)} -{" "}
                  {safeFormatDate(item.endDate)}
                </p>
              </div>
            </div>
          ))}
        </Card>
      </ScrollArea>
    );
  };

  // ------------------ MAIN RETURN ------------------
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh]">
        <Loader2 className="animate-spin h-6 w-6 text-pink-600" />
        <p className="mt-2">Please wait...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex justify-between items-center px-5 py-3 bg-muted/50 shadow-sm">
        <h1 className="text-lg font-bold flex-1">
          {t(`dasha.${dashaType}`)} Dasha Periods
        </h1>
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "overview" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("overview")}
          >
            Overview
          </Button>
          <Button
            variant={viewMode === "detailed" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("detailed")}
          >
            Detailed
          </Button>
          <Button
            variant="secondary"
            size="icon"
            onClick={() => setShowDashaModal(true)}
          >
            <Loader2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {viewMode === "overview" ? (
          renderOverview()
        ) : (
          <ScrollArea className="h-[80vh] p-4 space-y-4">
            {processedData.map((item) => renderDashaCard(item))}
          </ScrollArea>
        )}
      </div>

      {/* {showDashaModal && (
        <ChangeDashaModal
          isOpen={showDashaModal}
          onClose={() => setShowDashaModal(false)}
          selectedOption={dashaType}
          onChange={(value:any) => setDashaType(value)}
        />
      )} */}
    </div>
  );
};

export default VimshottariDasha;
