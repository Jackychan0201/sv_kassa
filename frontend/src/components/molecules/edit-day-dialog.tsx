"use client";

import { useState, useEffect } from "react";
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/atoms/popover";
import { Command, CommandGroup, CommandItem } from "@/components/atoms/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { useUser } from "../providers/user-provider";
import { getAllShops } from "@/lib/api";
import { Shop } from "@/lib/types";

interface EditDayDialogProps {
  onSaved?: () => void;
}

export function EditDayDialog({ onSaved }: EditDayDialogProps) {
  const { user } = useUser();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [shops, setShops] = useState<Shop[]>([]);
  const [comboOpen, setComboOpen] = useState(false);
  const [openSheet, setOpenSheet] = useState(false);
  const [open, setOpen] = useState(false);

  // Load all shops (CEO only) or current shop (SHOP user)
  useEffect(() => {
    const loadShops = async () => {
      if (!user) return;
      if (user.role === "CEO") {
        try {
          const allShops = await getAllShops();
          setShops(allShops.filter((s) => s.role === "SHOP"));
        } catch (err) {
          console.error("Failed to load shops", err);
        }
      } else if (user.role === "SHOP" && user.shopId) {
        setShops([{ id: user.shopId, name: user.name || "My Shop", role: "SHOP" }]);
      }
    };
    loadShops();
  }, [user]);

  // Handle dialog open/close
  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    // Only reset when fully closing and not opening the sheet
    if (!isOpen && !openSheet) {
      setSelectedDate(null);
      setSelectedShop(null);
    }
  };

  // Handle Go button
  const handleGo = () => {
    if (!selectedDate) {
      toast.error("Please select a date first");
      return;
    }
    if (!selectedShop) {
      toast.error("Please select a shop first");
      return;
    }
    setOpen(false);      // Close dialog
    setOpenSheet(true);  // Open sheet
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <form>
          <DialogTrigger asChild>
            <Button className="disabled:opacity-50 w-50 transition text-[#f0f0f0] delay-150 duration-300 ease-in-out hover:-translate-y-0 hover:scale-110 hover:bg-[#414141]">
              Edit data
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[425px] border-black bg-[#292929] text-[#f0f0f0]">
            <DialogHeader>
              <DialogTitle>Edit data</DialogTitle>
              <DialogDescription className="text-[#f0f0f0]">
                Pick a date and shop to edit
              </DialogDescription>
            </DialogHeader>

            <DatePicker title="Date" value={selectedDate} onChange={setSelectedDate} />

            {selectedDate && shops.length > 0 && (
              <div className="mt-4">
                <p className="text-sm mb-1 text-[#f0f0f0]">Select shop</p>
                <Popover open={comboOpen} onOpenChange={setComboOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className="w-48 justify-between bg-[#171717] border-0 text-[#f0f0f0] hover:bg-[#414141] hover:text-[#f0f0f0]"
                    >
                      {selectedShop ? selectedShop.name : "Select shop"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-48 p-0 bg-[#202020] border-1 border-black text-[#f0f0f0]">
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
            )}

            <DialogFooter>
              <DialogClose asChild>
                <Button className="w-30 transition text-[#f0f0f0] delay-150 duration-300 ease-in-out hover:-translate-y-0 hover:scale-105 hover:bg-[#363636]">
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="button"
                onClick={handleGo}
                className="w-20 transition bg-[#595959] text-[#f0f0f0] delay-150 duration-300 ease-in-out hover:-translate-y-0 hover:scale-105 hover:bg-[#646464]"
              >
                Go
              </Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog>

      {openSheet && selectedDate && selectedShop && (
        <EditDaySheet
          formattedDate={`${selectedDate.getDate().toString().padStart(2,"0")}.${
            (selectedDate.getMonth()+1).toString().padStart(2,"0")
          }.${selectedDate.getFullYear()}`}
          open={openSheet}
          onClose={() => {
            setOpenSheet(false);
            setSelectedDate(null);
            setSelectedShop(null);
          }}
          shopId={selectedShop.id}
          onSaved={onSaved}
        />
      )}
    </>
  );
}
