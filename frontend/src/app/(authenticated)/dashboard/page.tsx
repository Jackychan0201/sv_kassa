"use client";

import { Label } from "@/components/atoms/label";
import { useUser } from "@/components/providers/user-provider";

import { useEffect, useState } from "react";
import { getRecordByDate } from "@/lib/api";
import { DailyRecord } from "@/lib/types";
import { CloseDaySheet } from "@/components/organisms/close-day-sheet";
import { EditDayDialog } from "@/components/molecules/edit-day-dialog";
import { LoadingFallback } from "@/components/molecules/loading-fallback";
import { SetReminderDialog } from "@/components/molecules/set-reminder-dialog";

export default function DashboardPage() {
  const today = new Date();
  const formattedDate = `${(today.getDate() < 10 ? "0" : "")}${today.getDate()}.${
    today.getMonth() + 1 < 10 ? "0" : ""
  }${today.getMonth() + 1}.${today.getFullYear()}`;

  const [record, setRecord] = useState<DailyRecord[] | null>(null);

  const loadRecord = async () => {
    try {
      const data = await getRecordByDate(formattedDate);
      setRecord(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadRecord();
  }, []);

  let recordData: (number | null)[] = [];
  if (!record) {
    return <LoadingFallback message="Loading..."/>;
  }
  if (record.length === 0) {
    recordData = [null, null, null, null, null, null];
  } else {
    recordData = [
      record[0].mainStockValue.toFixed(2) as unknown as number,
      record[0].orderStockValue.toFixed(2) as unknown as number,
      record[0].revenueMainWithMargin.toFixed(2) as unknown as number,
      record[0].revenueMainWithoutMargin.toFixed(2) as unknown as number,
      record[0].revenueOrderWithMargin.toFixed(2) as unknown as number,
      record[0].revenueOrderWithoutMargin.toFixed(2) as unknown as number,
    ];
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
        <Label className={"text-xl " + (recordData[0] !== null ? "text-[#009908]" : "text-[#960000]")}>
          {recordData[0] !== null ? "Day is closed sucessfully!" : "Day is not closed!"}
        </Label>
      </div>
      <div className="flex flex-row mt-10 gap-x-5">
        <CloseDaySheet
          disabled={recordData[0] !== null}
          formattedDate={formattedDate}
          onSaved={loadRecord}
        />
        <EditDayDialog onSaved={loadRecord}/>
        <SetReminderDialog />
      </div>
    </div>
  );
}

