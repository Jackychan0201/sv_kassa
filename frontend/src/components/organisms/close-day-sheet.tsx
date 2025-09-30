"use client";

import { Button } from "@/components/atoms/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/atoms/sheet";
import { Input } from "../atoms/input";
import { Label } from "../atoms/label";

interface CloseDaySheetProps {
  disabled: boolean;
  formattedDate: string;
}

export function CloseDaySheet({ disabled, formattedDate }: CloseDaySheetProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          disabled={disabled}
          className="disabled:opacity-50 w-50 transition text-[#f0f0f0] delay-150 duration-300 ease-in-out hover:-translate-y-0 hover:scale-110 hover:bg-[#414141]"
        >
          Close the day
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="h-full flex flex-col bg-[#292929] border-black">
        <SheetHeader>
          <SheetTitle className="text-xl text-[#f0f0f0]">Close the day</SheetTitle>
          <SheetDescription className="text-lg text-[#b7b7b7]">
            Close the day for {formattedDate}
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-4">
          <div>
          <Label htmlFor="mainStockValue" className="text-md text-[#f0f0f0] ml-6">
            Main stock value:
          </Label>
          <Input id="mainStockValue" className="w-[90%] mx-auto border-[#3f3e3e]" placeholder="e.g. 12345.00"/>
          </div>
          <div>
          <Label htmlFor="orderStockValue" className="text-md text-[#f0f0f0] ml-6">
            Order stock value:
          </Label>
          <Input id="orderStockValue" className="w-[90%] mx-auto border-[#3f3e3e]" placeholder="e.g. 5333.43"/>
          </div>
          <div>
          <Label htmlFor="mainRevenueWithMargin" className="text-md text-[#f0f0f0] ml-6">
            Revenue main stock (with margin):
          </Label>
          <Input id="mainRevenueWithMargin" className="w-[90%] mx-auto border-[#3f3e3e]" placeholder="e.g. 66332.92"/>
          </div>
          <div>
          <Label htmlFor="mainRevenueWithoutMargin" className="text-md text-[#f0f0f0] ml-6">
             Revenue main stock (without margin):
          </Label>
          <Input id="mainRevenueWithoutMargin" className="w-[90%] mx-auto border-[#3f3e3e]" placeholder="e.g. 244.50"/>
          </div>
          <div>
          <Label htmlFor="orderRevenueWithMargin" className="text-md text-[#f0f0f0] ml-6">
            Revenue order stock (with margin):
          </Label>
          <Input id="orderRevenueWithMargin" className="w-[90%] mx-auto border-[#3f3e3e]" placeholder="e.g. 789.11"/>
          </div>
          <div>
          <Label htmlFor="orderRevenueWithoutMargin" className="text-md text-[#f0f0f0] ml-6">
            Revenue order stock (without margin):
          </Label>
          <Input id="orderRevenueWithoutMargin" className="w-[90%] mx-auto border-[#3f3e3e]" placeholder="e.g. 422.49"/>
          </div>

        </div>

        <div className="mt-auto mb-4 flex flex-col w-[90%] mx-auto gap-2">
          <Button className="transition text-[#f0f0f0] delay-50 duration-200 ease-in-out hover:-translate-y-0 hover:scale-105 hover:bg-[#414141]">
            Save data
          </Button>
          <Button className="transition text-[#f0f0f0] delay-50 duration-200 ease-in-out hover:-translate-y-0 hover:scale-105 hover:bg-[#414141]">
            Reset
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
