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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/atoms/table";
import { ScrollArea } from "@/components/atoms/scroll-area"; 

export function GetTableDialog() {
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [records, setRecords] = useState<DailyRecord[] | null>(null);

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setRecords(null);
      setFromDate(null);
      setToDate(null);
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

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <form>
        <DialogTrigger asChild>
          <Button className="disabled:opacity-50 w-50 transition text-[#f0f0f0] delay-150 duration-300 ease-in-out hover:-translate-y-0 hover:scale-110 hover:bg-[#414141]">
            Show table
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[1000px] border-black bg-[#292929] text-[#f0f0f0]">
          <DialogHeader>
            <DialogTitle>Daily Records Table</DialogTitle>
            <DialogDescription className="text-[#f0f0f0]">
              Select a date range to view multiple records
            </DialogDescription>
          </DialogHeader>

          <div className="flex gap-4 mt-2">
            <DatePicker title="From date" value={fromDate} onChange={setFromDate} />
            <DatePicker title="To date" value={toDate} onChange={setToDate} />
          </div>

          <div className="mt-4">
            {loading && <p>Loading...</p>}
            {!loading && records && records.length > 0 && (
              <ScrollArea className="h-[30vh] w-full rounded-lg border border-[#3f3e3e]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-[#f0f0f0]">Record date</TableHead>
                      <TableHead className="text-[#f0f0f0]">Main stock value</TableHead>
                      <TableHead className="text-[#f0f0f0]">Order stock value</TableHead>
                      <TableHead className="text-[#f0f0f0]">Revenue main stock (with margin)</TableHead>
                      <TableHead className="text-[#f0f0f0]">Revenue main stock (without margin)</TableHead>
                      <TableHead className="text-[#f0f0f0]">Revenue order stock (with margin)</TableHead>
                      <TableHead className="text-[#f0f0f0]">Revenue order stock (without margin)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {records.map((r) => (
                      <TableRow key={r.id}>
                        <TableCell>{r.recordDate}</TableCell>
                        <TableCell>{r.mainStockValue.toFixed(2)}</TableCell>
                        <TableCell>{r.orderStockValue.toFixed(2)}</TableCell>
                        <TableCell>{r.revenueMainWithMargin.toFixed(2)}</TableCell>
                        <TableCell>{r.revenueMainWithoutMargin.toFixed(2)}</TableCell>
                        <TableCell>{r.revenueOrderWithMargin.toFixed(2)}</TableCell>
                        <TableCell>{r.revenueOrderWithoutMargin.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
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
