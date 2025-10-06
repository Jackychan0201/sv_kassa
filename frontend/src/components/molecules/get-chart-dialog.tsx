"use client";

import { useState } from "react";
import { Button } from "@/components/atoms/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/atoms/dialog";
import { DatePicker } from "./date-picker"; 
import { toast } from "sonner";
import { getRecordsByRange } from "@/lib/api";
import { DailyRecord } from "@/lib/types";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/molecules/chart";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/atoms/popover";
import { Command, CommandGroup, CommandItem } from "@/components/atoms/command";
import { Check, ChevronsUpDown } from "lucide-react";

// Define chart themes (what user can pick)
const chartOptions = [
  { key: "mainStockValue", label: "Main stock value" },
  { key: "orderStockValue", label: "Order stock value" },
  { key: "revenueMainWithMargin", label: "Revenue main stock (with margin)" },
  { key: "revenueMainWithoutMargin", label: "Revenue main stock (without margin)" },
  { key: "revenueOrderWithMargin", label: "Revenue order stock (with margin)" },
  { key: "revenueOrderWithoutMargin", label: "Revenue order stock (without margin)" },
];

export function GetChartDialog() {
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [records, setRecords] = useState<DailyRecord[] | null>(null);
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
  const [comboOpen, setComboOpen] = useState(false);

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setRecords(null);
      setFromDate(null);
      setToDate(null);
      setSelectedMetric(null);
    }
  };

  const formatDate = (date: Date) =>
    `${date.getDate().toString().padStart(2, "0")}.${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}.${date.getFullYear()}`;

  const handleFetch = async () => {
    if (!fromDate || !toDate) {
      toast.error("Please select both From and To dates");
      return;
    }
    if (!selectedMetric) {
      toast.error("Please select a chart metric");
      return;
    }

    setLoading(true);

    try {
      const data = await getRecordsByRange(formatDate(fromDate), formatDate(toDate));
      setRecords(data);
    } catch (err: any) {
      toast.error(err.message || "Failed to fetch records");
    } finally {
      setLoading(false);
    }
  };

  const selectedOption = chartOptions.find((opt) => opt.key === selectedMetric);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <form>
        <DialogTrigger asChild>
          <Button className="disabled:opacity-50 w-50 transition text-[#f0f0f0] delay-150 duration-300 ease-in-out hover:-translate-y-0 hover:scale-110 hover:bg-[#414141]">
            Show chart
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[1000px] border-black bg-[#292929] text-[#f0f0f0]">
          <DialogHeader>
            <DialogTitle>Daily Records Chart</DialogTitle>
            <DialogDescription className="text-[#f0f0f0]">
              Select a date range and a metric to display chart
            </DialogDescription>
          </DialogHeader>

          {/* Date pickers */}
          <div className="flex gap-4 mt-2">
              <DatePicker title="From date" value={fromDate} onChange={setFromDate} />
              <DatePicker title="To date" value={toDate} onChange={setToDate} />
          </div>

          {/* Combobox */}
            <div className="mt-4">
            <p className="text-sm mb-1">Select metric</p>
            <Popover open={comboOpen} onOpenChange={setComboOpen}>
                <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    className="w-48 justify-between bg-[#171717] border-0 text-[#f0f0f0] hover:bg-[#414141] hover:text-[#f0f0f0]"
                >
                    {selectedOption ? selectedOption.label : "Select metric"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0 bg-[#545454] text-[#f0f0f0]">
                    <Command className="bg-[#545454]">
                        <CommandGroup className="bg-[#545454]">
                        {chartOptions.map((opt) => (
                            <CommandItem
                            key={opt.key}
                            onSelect={() => {
                                setSelectedMetric(opt.key);
                                setComboOpen(false);
                            }}
                            className="
                                bg-[#545454] text-[#f0f0f0] cursor-pointer
                                data-[highlighted]:bg-[#292929] 
                                data-[highlighted]:text-[#f0f0f0]
                            "
                            >
                            <Check
                                className={`mr-2 h-4 w-4 ${
                                selectedMetric === opt.key ? "opacity-100" : "opacity-0"
                                }`}
                            />
                            {opt.label}
                            </CommandItem>
                        ))}
                        </CommandGroup>
                    </Command>
                </PopoverContent>


            </Popover>
            </div>


          {/* Chart */}
            <div className="mt-6">
            {loading && <p>Loading...</p>}
            {!loading && records && records.length > 0 && selectedMetric && (
                <ChartContainer
                className="h-[40vh] w-full"
                config={{
                    [selectedMetric]: {
                    label: selectedOption?.label || "Value",
                    color: "#8884d8",
                    },
                }}
                >
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={records}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="recordDate" />
                    <YAxis />
                    <ChartTooltip 
                    content={
                        <ChartTooltipContent hideIndicator={true}/>
                    } 
                    />
                    <Line
                        type="monotone"
                        dataKey={selectedMetric}
                        stroke="#8884d8"
                        strokeWidth={2}
                        dot={{ r: 3 }}
                    />
                    </LineChart>
                </ResponsiveContainer>
                </ChartContainer>
            )}
            {!loading && records && records.length === 0 && (
                <p className="text-[#b7b7b7] mt-4">No records found in this range.</p>
            )}
            </div>


          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button className="w-30 transition text-[#f0f0f0] delay-150 duration-300 ease-in-out hover:-translate-y-0 hover:scale-105 hover:bg-[#363636]">
                Close
              </Button>
            </DialogClose>
            <Button
              type="button"
              onClick={handleFetch}
              className="w-20 transition bg-[#595959] text-[#f0f0f0] delay-150 duration-300 ease-in-out hover:-translate-y-0 hover:scale-105 hover:bg-[#646464]"
            >
              Go
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
