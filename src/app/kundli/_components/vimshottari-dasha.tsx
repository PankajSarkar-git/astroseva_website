"use client";

import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import { format, parseISO, isValid, differenceInDays } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronDown, ChevronRight, Loader2, RefreshCw } from "lucide-react";

/**
 * Types translated from the React Native version
 */
interface DashaPeriod {
  start_date?: string;
  end_date?: string;
  start_time?: string;
  end_time?: string;
  antar_dasha?: { [key: string]: DashaPeriod };
  pratyantar_dasha?: { [key: string]: DashaPeriod };
  sookshma_dasha?: { [key: string]: DashaPeriod };
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

type DashaType =
  | "maha-dasha"
  | "antar-dasha"
  | "pratyantar-dasha"
  | "sookshma-dasha";

/**
 * Helper utilities
 */
const safeFormatDate = (dateString: string): string => {
  if (!dateString) return "";
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

const PLANET_COLORS: Record<string, string> = {
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

const getPlanetColor = (planet: string): string =>
  PLANET_COLORS[planet] || "#6B7280";

const NESTED_KEYS: Array<keyof DashaPeriod> = [
  "antar_dasha",
  "pratyantar_dasha",
  "sookshma_dasha",
];

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
      if (period[key]) {
        item.hasSubPeriods = true;
        item.subPeriods = processDashaData(
          period[key] as unknown as DashaData,
          level + 1,
          id,
          planet
        );
        break; // only one nested key per level
      }
    }

    return [item];
  });
};

const flattenDashaData = (
  items: ProcessedDashaItem[]
): ProcessedDashaItem[] => {
  return items.reduce<ProcessedDashaItem[]>((acc, item) => {
    acc.push(item);
    if (item.subPeriods) acc.push(...flattenDashaData(item.subPeriods));
    return acc;
  }, []);
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

/**
 * Change Dasha Modal (shadcn Dialog + Select)
 */
function ChangeDashaModal({
  value,
  onChange,
  trigger,
}: {
  value: DashaType;
  onChange: (val: DashaType) => void;
  trigger?: React.ReactNode;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger ?? <Button variant="secondary">Change</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Change Dasha Type</DialogTitle>
          <DialogDescription>
            Select which dasha sequence to view.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <label className="text-sm text-muted-foreground">Dasha Type</label>
          <Select value={value} onValueChange={(v) => onChange(v as DashaType)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select dasha" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="maha-dasha">Maha Dasha</SelectItem>
              <SelectItem value="antar-dasha">Antar Dasha</SelectItem>
              <SelectItem value="pratyantar-dasha">Pratyantar Dasha</SelectItem>
              <SelectItem value="sookshma-dasha">Sookshma Dasha</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button type="button" onClick={() => {}} className="w-full">
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Main Component
 */
export default function VimshottariDasha({
  active,
  // Optional props for integration
  t = (k: string) => k, // i18n function fallback
  loadVimshottari,
}: {
  active?: number;
  t?: (key: string) => string;
  /**
   * Optional data loader hook for integration with your store.
   * It should return an object shaped like { success: boolean, dasha: { data: { maha_dasha: DashaData } } }
   */
  loadVimshottari?: (args: {
    body: any;
    query: { dashaType: DashaType; lan?: string };
  }) => Promise<any>;
}) {
  const [rawData, setRawData] = useState<DashaData | null>(null);
  const [processedData, setProcessedData] = useState<ProcessedDashaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<"overview" | "detailed">("overview");
  const [dashaType, setDashaType] = useState<DashaType>("antar-dasha");

  const toggleExpansion = (id: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const fetchKundliDetails = async () => {
    setLoading(true);
    try {
      if (loadVimshottari) {
        const payload = await loadVimshottari({
          body: {
            // Provide the body as required by your API
          },
          query: { dashaType, lan: t("lan") as any },
        });
        if (payload?.success) {
          const dashaDetails: DashaData = payload.dasha.data.maha_dasha;
          setRawData(dashaDetails);
          const processed = processDashaData(dashaDetails);
          setProcessedData(processed);
        }
      } else {
        // Fallback: expect data passed via prop not available; keep empty
        setRawData(null);
        setProcessedData([]);
      }
    } catch (e) {
      console.error("Error loading vimshottari: ", e);
    } finally {
      setLoading(false);
      setExpandedItems(new Set());
    }
  };

  useEffect(() => {
    if (active === 4) {
      fetchKundliDetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, dashaType]);

  const activeDasha = useMemo(
    () => getCurrentActiveDasha(processedData),
    [processedData]
  );

  return (
    <div className="flex h-full flex-col bg-background">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b bg-muted/30 px-4 py-3">
        <h2 className="line-clamp-1 text-base font-semibold md:text-lg">
          {t(`dasha.${dashaType}`)} Dasha Periods
        </h2>
        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-xl bg-muted p-1">
            <Button
              size="sm"
              variant={viewMode === "overview" ? "default" : "ghost"}
              className="rounded-lg"
              onClick={() => setViewMode("overview")}
            >
              Overview
            </Button>
            <Button
              size="sm"
              variant={viewMode === "detailed" ? "default" : "ghost"}
              className="rounded-lg"
              onClick={() => setViewMode("detailed")}
            >
              Detailed
            </Button>
          </div>

          <ChangeDashaModal
            value={dashaType}
            onChange={(v) => setDashaType(v)}
            trigger={
              <Button variant="secondary" size="icon" className="rounded-xl">
                <RefreshCw className="h-4 w-4" />
                <span className="sr-only">Change Dasha</span>
              </Button>
            }
          />
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex flex-1 items-center justify-center gap-3">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="text-sm">Please wait…</span>
        </div>
      ) : viewMode === "overview" ? (
        <Overview
          processedData={processedData}
          activeDasha={activeDasha ?? undefined}
        />
      ) : (
        <Detailed
          processedData={processedData}
          expandedItems={expandedItems}
          onToggle={toggleExpansion}
        />
      )}
    </div>
  );
}

/** Overview **/
function Overview({
  processedData,
  activeDasha,
}: {
  processedData: ProcessedDashaItem[];
  activeDasha?: ProcessedDashaItem;
}) {
  return (
    <ScrollArea className="h-[calc(100vh-9rem)] px-4 py-4">
      {activeDasha && (
        <Card className="mb-4 overflow-hidden rounded-2xl bg-pink-600 text-pink-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-center text-base">
              Current Active Period
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center gap-4 pb-4">
            <span
              className="inline-block h-5 w-5 rounded-full"
              style={{ backgroundColor: getPlanetColor(activeDasha.title) }}
            />
            <div>
              <div className="text-lg font-bold leading-none">
                {activeDasha.title}
              </div>
              <div className="text-sm opacity-90">
                {safeFormatDate(activeDasha.startDate)} –{" "}
                {safeFormatDate(activeDasha.endDate)}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="rounded-2xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-center text-lg">Dasha Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-5">
            {processedData.map((item, idx) => (
              <div key={item.id} className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <span
                    className="mb-2 inline-block h-4 w-4 rounded-full"
                    style={{ backgroundColor: getPlanetColor(item.title) }}
                  />
                  {idx < processedData.length - 1 && (
                    <span className="h-12 w-[2px] bg-muted" />
                  )}
                </div>
                <div className="flex-1 pb-2">
                  <div className="text-base font-semibold leading-none">
                    {item.title}
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    {item.duration}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {safeFormatDate(item.startDate)} –{" "}
                    {safeFormatDate(item.endDate)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </ScrollArea>
  );
}

/** Detailed **/
function Detailed({
  processedData,
  expandedItems,
  onToggle,
}: {
  processedData: ProcessedDashaItem[];
  expandedItems: Set<string>;
  onToggle: (id: string) => void;
}) {
  return (
    <ScrollArea className="h-[calc(100vh-9rem)] px-4 py-4">
      <div className="space-y-3">
        {processedData.map((item) => (
          <DashaCard
            key={item.id}
            item={item}
            expandedItems={expandedItems}
            onToggle={onToggle}
          />
        ))}
      </div>
    </ScrollArea>
  );
}

function DashaCard({
  item,
  expandedItems,
  onToggle,
}: {
  item: ProcessedDashaItem;
  expandedItems: Set<string>;
  onToggle: (id: string) => void;
}) {
  const isExpanded = expandedItems.has(item.id);

  const now = new Date();
  const isActive = useMemo(() => {
    const start = parseISO(item.startDate);
    const end = parseISO(item.endDate);
    return isValid(start) && isValid(end) && now >= start && now <= end;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item.startDate, item.endDate]);

  return (
    <Card
      className={
        "overflow-hidden rounded-2xl border-l-4 " +
        (isActive ? "border-l-green-500 bg-green-50" : "border-l-muted")
      }
      style={{ marginLeft: item.level * 16 }}
    >
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex flex-1 items-center gap-3">
          <span
            className="inline-block h-3 w-3 rounded-full"
            style={{ backgroundColor: getPlanetColor(item.title) }}
          />
          <div className="min-w-0">
            <div
              className={
                "truncate text-sm font-semibold " +
                (isActive ? "text-green-800" : "")
              }
            >
              {item.title}
              {item.parentPlanet && (
                <span className="ml-1 text-sm font-normal text-muted-foreground">
                  in {item.parentPlanet}
                </span>
              )}
            </div>
            <div className="mt-0.5 text-xs text-muted-foreground">
              {item.duration}
            </div>
          </div>
        </div>
        {item.hasSubPeriods && (
          <Button variant="ghost" size="icon" onClick={() => onToggle(item.id)}>
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>

      <Separator />

      <CardContent className="px-4 py-3">
        <div className="grid grid-cols-2 gap-4 text-center md:max-w-xs">
          <div>
            <div className="text-xs text-muted-foreground">Start</div>
            <div className="text-sm font-medium">
              {safeFormatDate(item.startDate)}
            </div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">End</div>
            <div className="text-sm font-medium">
              {safeFormatDate(item.endDate)}
            </div>
          </div>
        </div>

        {isActive && (
          <div className="mt-3 rounded-lg bg-green-100 px-3 py-2 text-center text-xs font-semibold text-green-800">
            ● Currently Active
          </div>
        )}

        {isExpanded && item.subPeriods && (
          <div className="mt-3 space-y-3">
            {item.subPeriods.map((sub) => (
              <DashaCard
                key={sub.id}
                item={sub}
                expandedItems={expandedItems}
                onToggle={onToggle}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
