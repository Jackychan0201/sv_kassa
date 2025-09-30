"use client";

import { Button } from "@/components/atoms/button";
import { Label } from "@/components/atoms/label";
import { useUser } from "@/components/providers/user-provider";

import { useEffect, useState } from "react";
import { getTodaysRecord } from "@/lib/api";
import { DailyRecord } from "@/lib/types";
import { CloseDaySheet } from "@/components/organisms/close-day-sheet";

export default function DashboardPage() {
  const user = useUser();
  const today = new Date(Date.now());
  const formattedDate = `${(today.getDate() < 10) ? 0 : ``}${today.getDate()}.${(today.getMonth() + 1 < 10) ? 0 : ``}${today.getMonth() + 1}.${today.getFullYear()}`;

  const [record, setRecord] = useState<DailyRecord[] | null>(null);  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  let recordData = [];

  useEffect(() => {
    getTodaysRecord(formattedDate).then(setRecord).catch(console.error);
  }, []);

  if (!record || record.length === 0) {
    recordData = [null, null, null, null, null, null];
  }
  else{
    recordData = [record[0].mainStockValue, record[0].orderStockValue, record[0].revenueMainWithMargin, record[0].revenueMainWithoutMargin, record[0].revenueOrderWithMargin, record[0].revenueOrderWithoutMargin];
  }

  return (
    <div>
      <div className="flex flex-col">
        <Label className="text-3xl font-bold">Dashboard</Label>
        <Label className="text-lg">Today is: {formattedDate}</Label>
      </div>
      <div className="flex flex-col mt-10 gap-y-7">
        <Label className="text-xl">Main stock value({formattedDate}): {recordData[0]}</Label>
        <Label className="text-xl">Order stock value({formattedDate}): {recordData[1]}</Label>
        <Label className="text-xl">Revenue main stock(no margin)({formattedDate}): {recordData[2]}</Label>
        <Label className="text-xl">Revenue main stock(with margin)({formattedDate}): {recordData[3]}</Label>
        <Label className="text-xl">Revenue order stock(no margin)({formattedDate}): {recordData[4]}</Label>
        <Label className="text-xl">Revenue order stock(with margin)({formattedDate}): {recordData[5]}</Label>
        <Label className={"text-xl " + (recordData[0] !==null ? 'text-[#009908]' : 'text-[#960000]')}>{(recordData[0] !== null) ? "Day is closed sucessfully!" : "Day is not closed!"}</Label>
      </div>
      <div className="flex flex-row mt-10 gap-x-5">
        <CloseDaySheet disabled={recordData[0] !== null} formattedDate={formattedDate}/>
        <Button className="w-50 transition text-[#f0f0f0] delay-150 duration-300 ease-in-out hover:-translate-y-0 hover:scale-110 hover:bg-[#414141]">Edit data</Button>
        <Button className="w-50 transition text-[#f0f0f0] delay-150 duration-300 ease-in-out hover:-translate-y-0 hover:scale-110 hover:bg-[#414141]">Set a reminder</Button>
      </div>
    </div>
  );
}
