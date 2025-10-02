"use client"

import * as React from "react"
import { ChevronDownIcon } from "lucide-react"

import { Button } from "@/components/atoms/button"
import { Calendar } from "@/components/atoms/calendar"
import { Label } from "@/components/atoms/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/atoms/popover"

export function DatePicker() {
  const [open, setOpen] = React.useState(false)
  const [date, setDate] = React.useState<Date | undefined>(undefined)

  return (
    <div className="flex flex-col gap-3">
      <Label htmlFor="date" className="px-1">
        Date of birth
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            className="w-48 text-[#f0f0f0] justify-between font-normal hover:bg-[#414141]"
          >
            {date ? date.toLocaleDateString("de-DE", {day:"2-digit", month:"2-digit", year:"numeric"}) : "Select date"}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0 shadow-none bg-[#545454] border border-black" align="start">
          <Calendar
            mode="single"
            selected={date}
            captionLayout="dropdown"
            onSelect={(date) => {
              setDate(date)
              setOpen(false)
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
