"use client";

import { useEffect, useState, useCallback } from "react";
import { Label } from "@/components/atoms/label";
import { Button } from "@/components/atoms/button";
import { LoadingFallback } from "@/components/molecules/loading-fallback";
import { useUser } from "@/components/providers/user-provider";
import { EditShopSheet } from "@/components/organisms/edit-shop-sheet";

interface Shop {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function ManageShopsPage() {
  const { user } = useUser();
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [open, setOpen] = useState(false);

  const fetchShops = useCallback(async () => {
    if (!user || user.role !== "CEO") return;

    try {
      setLoading(true);
      const res = await fetch("/api/shops", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch shops");

      const data: Shop[] = await res.json();

      const filtered = data.filter(
        (shop) => shop.id !== user.shopId
      );

      setShops(filtered);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchShops();
  }, [fetchShops]);

  if (!user) return <LoadingFallback message="Loading user..." />;
  if (loading) return <LoadingFallback message="Loading shops..." />;

  const handleEditClick = (shop: Shop) => {
    setSelectedShop(shop);
    setOpen(true);
  };

  const handleUpdateShop = async (updatedShop: Shop) => {
    setShops((prev) =>
      prev.map((s) => (s.id === updatedShop.id ? updatedShop : s))
    );

    await fetchShops();
  };

  return (
    <div className="flex flex-col">
      <Label className="text-4xl font-bold mb-2">Manage Shops</Label>
      <Label className="text-lg mb-8">
        View and edit shop account data below.
      </Label>

      <div className="flex flex-col gap-y-3">
        {shops.map((shop) => (
          <div
            key={shop.id}
            className="flex max-w-1/3 items-center justify-between bg-[#292929] rounded-lg p-4 border border-[#3a3a3a]"
          >
            <div className="flex flex-col">
              <Label className="text-lg text-[#f0f0f0]">{shop.name}</Label>
              <Label className="text-sm text-[#b7b7b7]">{shop.email}</Label>
              <Label className="text-sm text-[#8f8f8f]">Role: {shop.role}</Label>
            </div>

            <Button
              onClick={() => handleEditClick(shop)}
              className="transition text-[#f0f0f0] delay-50 duration-200 ease-in-out hover:-translate-y-0 hover:scale-105 hover:bg-[#414141]"
            >
              Edit
            </Button>
          </div>
        ))}
      </div>

      <EditShopSheet
        open={open}
        onOpenChange={setOpen}
        shop={selectedShop}
        onUpdate={handleUpdateShop}
      />
    </div>
  );
}
