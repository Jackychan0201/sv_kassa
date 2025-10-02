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
import { EditDaySheet } from "../organisms/edit-day-sheet";
import { toast } from "sonner";

interface EditDayDialogProps {
  onSaved?: () => void;
}

export function EditDayDialog({ onSaved }: EditDayDialogProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [openSheet, setOpenSheet] = useState(false);
  const [open, setOpen] = useState(false);

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
  };

  const handleGo = () => {
    if (!selectedDate) {
      toast.error("Please select a date first");
      return;
    }
    handleOpenChange(false);
    setOpenSheet(true);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <form>
          <DialogTrigger asChild>
            <Button className="disabled:opacity-50 w-50 transition text-[#f0f0f0] delay-150 duration-300 ease-in-out hover:-translate-y-0 hover:scale-110 hover:bg-[#414141]">Edit data</Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[425px] border-black bg-[#292929] text-[#f0f0f0]">
            <DialogHeader>
              <DialogTitle>Edit data</DialogTitle>
              <DialogDescription className="text-[#f0f0f0]">Pick a date to edit</DialogDescription>
            </DialogHeader>

            <DatePicker value={selectedDate} onChange={setSelectedDate} />

            <DialogFooter>
              <DialogClose asChild>
                <Button className="w-30 transition text-[#f0f0f0] delay-150 duration-300 ease-in-out hover:-translate-y-0 hover:scale-105 hover:bg-[#363636]">
                    Cancel
                </Button>
              </DialogClose>
                <Button type="button" onClick={handleGo} className="w-20 transition bg-[#595959] text-[#f0f0f0] delay-150 duration-300 ease-in-out hover:-translate-y-0 hover:scale-105 hover:bg-[#646464]">
                    Go
                </Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog>

      {openSheet && selectedDate && (
        <EditDaySheet
          formattedDate={`${selectedDate.getDate().toString().padStart(2,"0")}.${
            (selectedDate.getMonth()+1).toString().padStart(2,"0")
          }.${selectedDate.getFullYear()}`}
          open={openSheet}
          onClose={() => setOpenSheet(false)}
          onSaved={onSaved}
        />
      )}
    </>
  );
}
