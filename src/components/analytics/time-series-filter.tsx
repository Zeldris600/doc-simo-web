"use client";

import { Calendar, SlidersHorizontal, ChevronDown } from "@/lib/icons";
import { Button } from "@/components/ui/button";
import { TimeSeriesGranularity } from "@/services/analytics.service";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TimeSeriesFilterProps {
  granularity: TimeSeriesGranularity;
  onGranularityChange: (g: TimeSeriesGranularity) => void;
  dateRange: { from: string; to: string };
  onDateRangeChange: (range: { from: string; to: string }) => void;
}

export function TimeSeriesFilter({ 
  granularity, 
  onGranularityChange, 
  dateRange, 
  onDateRangeChange 
}: TimeSeriesFilterProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Date Range Simulation */}
      <div className="flex items-center gap-2 bg-gray-100/50 p-1 rounded-xl">
        <div className="flex items-center gap-2 px-3">
           <Calendar className="h-3.5 w-3.5 text-gray-400" />
           <input 
             type="date" 
             value={dateRange.from} 
             onChange={(e) => onDateRangeChange({ ...dateRange, from: e.target.value })}
             className="bg-transparent text-[10px] font-medium border-none focus:ring-0 w-24 p-0"
           />
           <span className="text-gray-300">-</span>
           <input 
             type="date" 
             value={dateRange.to} 
             onChange={(e) => onDateRangeChange({ ...dateRange, to: e.target.value })}
             className="bg-transparent text-[10px] font-medium border-none focus:ring-0 w-24 p-0"
           />
        </div>
      </div>

      <Tabs value={granularity} onValueChange={(v) => onGranularityChange(v as TimeSeriesGranularity)}>
        <TabsList className="bg-gray-100/50 p-1 rounded-xl h-9">
          {["day", "week", "month", "year"].map((g) => (
            <TabsTrigger 
              key={g} 
              value={g}
              className="rounded-lg text-[10px] font-medium px-3 py-1 data-[state=active]:bg-white data-[state=active]:shadow-[0_8px_30px_rgba(0,0,0,0.02)] capitalize"
            >
              {g}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
}
