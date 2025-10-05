"use client";

import { useEffect, useState } from "react";
import { Label } from "@/components/atoms/label";
import { GetChartDialog } from "@/components/molecules/get-chart-dialog";
import { GetTableDialog } from "@/components/molecules/get-table-dialog";
import { LoadingFallback } from "@/components/molecules/loading-fallback";
import { DailyRecord } from "@/lib/types";
import { getRecordsByRange } from "@/lib/api";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/atoms/accordion";

export default function StatisticsPage() {
  const [dailyRecords, setDailyRecords] = useState<DailyRecord[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  function formatDate(date: Date) {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  }

  useEffect(() => {
    async function loadRecords() {
      try {
        const toDate = new Date();
        const fromDate = new Date();
        fromDate.setDate(toDate.getDate() - 29);

        const fromDateStr = formatDate(fromDate);
        const toDateStr = formatDate(toDate);

        const records = await getRecordsByRange(fromDateStr, toDateStr);
        setDailyRecords(records);
      } catch (err: any) {
        setError(err.message || "Failed to load records");
      }
    }
    loadRecords();
  }, []);

  if (error) {
    return <Label className="text-red-500">Error: {error}</Label>;
  }

  if (!dailyRecords) {
    return <LoadingFallback message="Loading..." />;
  }

  if (dailyRecords.length === 0) {
    return <Label>No records found in the selected date range.</Label>;
  }

  // --- KPI Calculations ---
  const calculateGMROI = (records: DailyRecord[]) => {
    const validRecords = records.filter(r => r.mainStockValue + r.orderStockValue > 0);
    if (!validRecords.length) return 0;

    const avgStockValue =
      validRecords.reduce((acc, r) => acc + r.mainStockValue + r.orderStockValue, 0) /
      validRecords.length;

    const totalRevenueWithMargin = validRecords.reduce(
      (acc, r) => acc + r.revenueMainWithMargin + r.revenueOrderWithMargin,
      0
    );
    const totalRevenueWithoutMargin = validRecords.reduce(
      (acc, r) => acc + r.revenueMainWithoutMargin + r.revenueOrderWithoutMargin,
      0
    );

    return avgStockValue ? (totalRevenueWithMargin - totalRevenueWithoutMargin) / avgStockValue : 0;
  };

  const calculateDailyRevenueGrowth = (records: DailyRecord[], window = 7) => {
    if (records.length < 2) return 0;

    const growthRates: number[] = [];
    for (let i = window; i < records.length; i++) {
      const todayRevenue = records[i].revenueMainWithMargin + records[i].revenueOrderWithMargin;
      const prevRevenueSum = records
        .slice(i - window, i)
        .reduce((acc, r) => acc + r.revenueMainWithMargin + r.revenueOrderWithMargin, 0);
      const prevRevenueAvg = prevRevenueSum / window;
      if (prevRevenueAvg > 0) {
        growthRates.push(((todayRevenue - prevRevenueAvg) / prevRevenueAvg) * 100);
      }
    }

    return growthRates.length
      ? growthRates.reduce((acc, v) => acc + v, 0) / growthRates.length
      : 0;
  };

  const calculateInventoryTurnover = (records: DailyRecord[]) => {
    const validRecords = records.filter(r => r.mainStockValue + r.orderStockValue > 0);
    if (!validRecords.length) return 0;

    const avgStockValue =
      validRecords.reduce((acc, r) => acc + r.mainStockValue + r.orderStockValue, 0) /
      validRecords.length;

    const dailyRevenueWithoutMargin =
      validRecords.reduce(
        (acc, r) => acc + r.revenueMainWithoutMargin + r.revenueOrderWithoutMargin,
        0
      ) / validRecords.length;

    return avgStockValue ? (dailyRevenueWithoutMargin / avgStockValue) * 365 : 0;
  };

  const calculateOverallMarginPercentage = (records: DailyRecord[]) => {
    const totalRevenueWithMargin = records.reduce(
      (acc, r) => acc + r.revenueMainWithMargin + r.revenueOrderWithMargin,
      0
    );
    const totalRevenueWithoutMargin = records.reduce(
      (acc, r) => acc + r.revenueMainWithoutMargin + r.revenueOrderWithoutMargin,
      0
    );

    return totalRevenueWithMargin
      ? ((totalRevenueWithMargin - totalRevenueWithoutMargin) / totalRevenueWithMargin) * 100
      : 0;
  };

  const gmroi = calculateGMROI(dailyRecords);
  const dailyRevenueGrowth = calculateDailyRevenueGrowth(dailyRecords, 7);
  const inventoryTurnover = calculateInventoryTurnover(dailyRecords);
  const overallMargin = calculateOverallMarginPercentage(dailyRecords);

  // --- Advice ---
  const adviceList: string[] = [];

  // --- GMROI Advice (Highest Priority) ---
  if (gmroi < 1.0) {
    adviceList.push(
      `GMROI: Critical (Current: ${gmroi.toFixed(2)}). Losing money on inventory. Review supply costs and slow-moving stock.`
    );
  } else if (gmroi >= 1.0 && gmroi < 2.0) {
    adviceList.push(
      `GMROI: Warning (Current: ${gmroi.toFixed(2)}). Consider markdown strategies and SKU rationalization.`
    );
  } else if (gmroi >= 2.0 && gmroi < 3.0) {
    adviceList.push(
      `GMROI: Good (Current: ${gmroi.toFixed(2)}). Maintain current strategies and scale successful practices.`
    );
  } else {
    adviceList.push(
      `GMROI: Excellent (Current: ${gmroi.toFixed(2)}). Maintain and scale successful practices.`
    );
  }

  // --- Daily Revenue Growth Advice ---
  if (dailyRevenueGrowth > 20 || dailyRevenueGrowth < -20) {
    adviceList.push(
      `Daily Revenue Growth: Volatile (Current: ${dailyRevenueGrowth.toFixed(2)}%).`
    );
  } else if (dailyRevenueGrowth >= 5) {
    adviceList.push(
      `Daily Revenue Growth: Excellent (Current: ${dailyRevenueGrowth.toFixed(2)}%). Keep momentum steady.`
    );
  } else if (dailyRevenueGrowth >= 2) {
    adviceList.push(
      `Daily Revenue Growth: Good (Current: ${dailyRevenueGrowth.toFixed(2)}%). Maintain steady growth.`
    );
  } else if (dailyRevenueGrowth >= -2) {
    adviceList.push(
      `Daily Revenue Growth: Stable (Current: ${dailyRevenueGrowth.toFixed(2)}%). Baseline performance maintained.`
    );
  } else if (dailyRevenueGrowth >= -5) {
    adviceList.push(
      `Daily Revenue Growth: Warning (Current: ${dailyRevenueGrowth.toFixed(2)}%). Monitor sales trends closely.`
    );
  }

  // --- Inventory Turnover Advice ---
  if (inventoryTurnover > 12) {
    adviceList.push(
      `Inventory Turnover: High (Current: ${inventoryTurnover.toFixed(2)}). Ensure stock levels prevent stockouts.`
    );
  } else if (inventoryTurnover >= 8) {
    adviceList.push(
      `Inventory Turnover: Excellent (Current: ${inventoryTurnover.toFixed(2)}). Efficient stock movement.`
    );
  } else if (inventoryTurnover >= 5) {
    adviceList.push(
      `Inventory Turnover: Good (Current: ${inventoryTurnover.toFixed(2)}). Maintain current sales velocity.`
    );
  } else if (inventoryTurnover >= 3) {
    adviceList.push(
      `Inventory Turnover: Average (Current: ${inventoryTurnover.toFixed(2)}). Consider optimizing stock levels.`
    );
  } else {
    adviceList.push(
      `Inventory Turnover: Poor (Current: ${inventoryTurnover.toFixed(2)}). Review inventory and sales strategies.`
    );
  }

  // --- Overall Margin Percentage Advice ---
  if (overallMargin < 25) {
    adviceList.push(
      `Overall Margin: Warning (Current: ${overallMargin.toFixed(2)}%). Check pricing, discounts, and cost of goods.`
    );
  } else if (overallMargin >= 25 && overallMargin < 30.9) {
    adviceList.push(
      `Overall Margin: Industry Average (Current: ${overallMargin.toFixed(2)}%). Maintain competitive pricing.`
    );
  } else if (overallMargin >= 30.9 && overallMargin < 50) {
    adviceList.push(
      `Overall Margin: Good (Current: ${overallMargin.toFixed(2)}%). Keep pricing and margins steady.`
    );
  } else {
    adviceList.push(
      `Overall Margin: Excellent (Current: ${overallMargin.toFixed(2)}%). Strong profitability achieved.`
    );
  }

  // --- Additional stats calculations ---
  const calcStats = (values: number[]) => ({
    max: Math.max(...values),
    min: Math.min(...values),
    avg: values.reduce((a, b) => a + b, 0) / values.length,
  });

  const mainRevenueWithMargin = dailyRecords.map(r => r.revenueMainWithMargin);
  const mainRevenueWithoutMargin = dailyRecords.map(r => r.revenueMainWithoutMargin);
  const mainMargin = dailyRecords.map(r => r.revenueMainWithMargin - r.revenueMainWithoutMargin);
  console.log(mainMargin);
  const mainStockValues = dailyRecords.map(r => r.mainStockValue);

  const orderRevenueWithMargin = dailyRecords.map(r => r.revenueOrderWithMargin);
  const orderRevenueWithoutMargin = dailyRecords.map(r => r.revenueOrderWithoutMargin);
  const orderMargin = dailyRecords.map(r => r.revenueOrderWithMargin - r.revenueOrderWithoutMargin);
  const orderStockValues = dailyRecords.map(r => r.orderStockValue);

  const mainStats = {
    revenueWithMargin: calcStats(mainRevenueWithMargin),
    revenueWithoutMargin: calcStats(mainRevenueWithoutMargin),
    margin: calcStats(mainMargin),
    avgStock: calcStats(mainStockValues),
  };

  const orderStats = {
    revenueWithMargin: calcStats(orderRevenueWithMargin),
    revenueWithoutMargin: calcStats(orderRevenueWithoutMargin),
    margin: calcStats(orderMargin),
    avgStock: calcStats(orderStockValues),
  };

  return (
    <div className="flex flex-col">
        <Label className="text-3xl font-bold mb-1">Statistics</Label>
        <Label className="text-lg text-[#f0f0f0] mb-6">Get advanced statistics about the shop</Label>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left column: Accordion + KPIs */}
          <div className="flex-1 flex flex-col gap-4">
            {/* Wrap accordion in fixed-height container */}
            <div className="w-full max-w-xl flex-1 overflow-y-auto">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="main">
                  <AccordionTrigger className="text-lg w-full text-left">Main Storage Stats</AccordionTrigger>
                  <AccordionContent className="flex flex-col gap-1 w-full">
                    <Label className="text-md">
                      Revenue With Margin - Max: {mainStats.revenueWithMargin.max.toFixed(2)}, Min: {mainStats.revenueWithMargin.min.toFixed(2)}, Avg: {mainStats.revenueWithMargin.avg.toFixed(2)}
                    </Label>
                    <Label className="text-md">
                      Revenue Without Margin - Max: {mainStats.revenueWithoutMargin.max.toFixed(2)}, Min: {mainStats.revenueWithoutMargin.min.toFixed(2)}, Avg: {mainStats.revenueWithoutMargin.avg.toFixed(2)}
                    </Label>
                    <Label className="text-md">
                      Margin - Max: {mainStats.margin.max.toFixed(2)}, Min: {mainStats.margin.min.toFixed(2)}, Avg: {mainStats.margin.avg.toFixed(2)}
                    </Label>
                    <Label className="text-md">Average Stock Value: {mainStats.avgStock.avg.toFixed(2)}</Label>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="order">
                  <AccordionTrigger className="text-lg w-full text-left">Order Storage Stats</AccordionTrigger>
                  <AccordionContent className="flex flex-col gap-1 w-full">
                    <Label className="text-md">
                      Revenue With Margin - Max: {orderStats.revenueWithMargin.max.toFixed(2)}, Min: {orderStats.revenueWithMargin.min.toFixed(2)}, Avg: {orderStats.revenueWithMargin.avg.toFixed(2)}
                    </Label>
                    <Label className="text-md">
                      Revenue Without Margin - Max: {orderStats.revenueWithoutMargin.max.toFixed(2)}, Min: {orderStats.revenueWithoutMargin.min.toFixed(2)}, Avg: {orderStats.revenueWithoutMargin.avg.toFixed(2)}
                    </Label>
                    <Label className="text-md">
                      Margin - Max: {orderStats.margin.max.toFixed(2)}, Min: {orderStats.margin.min.toFixed(2)}, Avg: {orderStats.margin.avg.toFixed(2)}
                    </Label>
                    <Label className="text-md">Average Stock Value: {orderStats.avgStock.avg.toFixed(2)}</Label>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            {/* KPI Stats */}
            <div className="flex flex-col gap-y-4 mt-4">
              <Label className="text-xl">GMROI: {gmroi.toFixed(2)}</Label>
              <Label className="text-xl">Daily Revenue Growth (7-day avg): {dailyRevenueGrowth.toFixed(2)}%</Label>
              <Label className="text-xl">Inventory Turnover Rate: {inventoryTurnover.toFixed(2)} times/year</Label>
              <Label className="text-xl">Overall Margin Percentage: {overallMargin.toFixed(2)}%</Label>
            </div>

            <div className="flex flex-row mt-6 gap-x-5">
              <GetTableDialog />
              <GetChartDialog />
            </div>
          </div>

          {/* Right column: Advice */}
          <div className="flex-1 mt-4 lg:mt-0">
            <div className="p-4 rounded-md bg-[#292929] flex flex-col justify-start h-70">
              <Label className="font-semibold text-xl text-[#f0f0f0] mb-2">Advice</Label>
              <div className="flex flex-col gap-1">
                {adviceList.map((item, idx) => (
                  <Label key={idx} className="text-md text-gray-300 block">
                    {item}
                  </Label>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>


  );
}
