import { Button } from "@/components/atoms/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/atoms/dialog"
import { Input } from "@/components/atoms/input"
import { Label } from "@/components/atoms/label"
import { DatePicker } from "./date-picker"

export function EditDayDialog() {
  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
            <Button className="w-50 transition text-[#f0f0f0] delay-150 duration-300 ease-in-out hover:-translate-y-0 hover:scale-110 hover:bg-[#414141]">Edit data</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] border-black bg-[#292929] text-[#f0f0f0]">
          <DialogHeader>
            <DialogTitle>Edit data</DialogTitle>
            <DialogDescription className="text-[#f0f0f0]">
                Edit the data for the closed day. Please choose the date.
            </DialogDescription>
          </DialogHeader>
            <DatePicker />
          <DialogFooter>
            <DialogClose asChild>
              <Button className="w-30 transition text-[#f0f0f0] delay-150 duration-300 ease-in-out hover:-translate-y-0 hover:scale-105 hover:bg-[#363636]">Cancel</Button>
            </DialogClose>
            <Button className="w-20 transition bg-[#595959] text-[#f0f0f0] delay-150 duration-300 ease-in-out hover:-translate-y-0 hover:scale-105 hover:bg-[#646464]">Go</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}
