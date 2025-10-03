import { Label } from "@/components/atoms/label";
import { GetChartDialog } from "@/components/molecules/get-chart-dialog";
import { GetTableDialog } from "@/components/molecules/get-table-dialog";

export default function StatisticsPage() {
  return (
   <div>
      <div className="flex flex-col">
        <Label className="text-3xl font-bold">Statistics</Label>
        <Label className="text-lg">Get advanced statistics about the shop</Label>
      </div>
      <div className="flex flex-row mt-10 gap-x-5">
        <GetTableDialog/>
        <GetChartDialog/>
      </div>
    </div>
  );
}
