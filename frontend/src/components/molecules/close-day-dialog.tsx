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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/atoms/popover";
import { Command, CommandGroup, CommandItem } from "@/components/atoms/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { toast } from "sonner";
import { Shop } from "@/lib/types";

interface CloseDayDialogProps {
  shops: Shop[];
  disabled?: boolean;
  onClosed?: () => void;
}

export function CloseDayDialog({ shops, disabled, onClosed }: CloseDayDialogProps) {
  const [open, setOpen] = useState(false);
  const [comboOpen, setComboOpen] = useState(false);
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCloseDay = async () => {
    if (!selectedShop) {
      toast.error("Please select a shop");
      return;
    }

    try {
      setLoading(true);
      toast.success(`Closed day for ${selectedShop.name}`);
      onClosed?.();
      setOpen(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to close day");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          disabled={disabled}
          className="disabled:opacity-50 w-50 transition text-[#f0f0f0] delay-150 duration-300 ease-in-out hover:-translate-y-0 hover:scale-110 hover:bg-[#414141]"
        >
          Close day
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px] border-black bg-[#292929] text-[#f0f0f0]">
        <DialogHeader>
          <DialogTitle>Close Shop Day</DialogTitle>
          <DialogDescription className="text-[#d0d0d0]">
            Select a shop to close its day.
          </DialogDescription>
        </DialogHeader>

        {/* Combobox */}
        <div className="mt-4">
          <p className="text-sm mb-1">Select shop</p>
          <Popover open={comboOpen} onOpenChange={setComboOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                className="w-[300px] justify-between bg-[#3a3a3a] text-[#f0f0f0] hover:bg-[#414141]"
              >
                {selectedShop ? selectedShop.name : "Select shop"}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-[300px] p-0 bg-[#545454] text-[#f0f0f0]">
              <Command className="bg-[#545454]">
                <CommandGroup className="bg-[#545454]">
                  {shops.map((shop) => (
                    <CommandItem
                      key={shop.id}
                      onSelect={() => {
                        setSelectedShop(shop);
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
                          selectedShop?.id === shop.id ? "opacity-100" : "opacity-0"
                        }`}
                      />
                      {shop.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        <DialogFooter className="mt-6">
          <DialogClose asChild>
            <Button className="w-24 transition text-[#f0f0f0] delay-150 duration-300 ease-in-out hover:-translate-y-0 hover:scale-105 hover:bg-[#363636]">
              Cancel
            </Button>
          </DialogClose>

          <Button
            onClick={handleCloseDay}
            disabled={loading}
            className="w-28 transition bg-[#595959] text-[#f0f0f0] delay-150 duration-300 ease-in-out hover:-translate-y-0 hover:scale-105 hover:bg-[#646464]"
          >
            {loading ? "Closing..." : "Close day"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
