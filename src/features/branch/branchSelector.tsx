import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { api } from "@/lib/api/api";
import { useBranchStore } from "@/store/branchStore";
import { CartItem, useCart } from "@/store/cartStore";
import { useLocationStore } from "@/store/locationStore";
import { BaseBranch } from "@/types/branch";
import { Clock, MapPin, Phone } from "lucide-react";
import { useEffect, useState } from "react";

interface BranchSelectorProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BranchSelector({ isOpen, onClose }: BranchSelectorProps) {
  const [branches, setBranches] = useState([]);
  const { currentLocation } = useLocationStore();
  const { currentBranch, setCurrentBranch } = useBranchStore();
  const { items } = useCart();
  const branchProducts = items.map((item: CartItem) => {
    return {
      product_id: item.id,
      quantity: item.quantity,
      variations: item.variant || [],
    };
  });

  useEffect(() => {
    if (isOpen && currentLocation) {
      fetchBranches();
    }
  }, [isOpen, currentLocation]);

  const fetchBranches = async () => {
    try {
      const response = await api.get(
        `/branch/list?lat=${currentLocation?.lat}&lng=${currentLocation?.lng}`
      );
      const data = await response.data;
      console.log(data);
      setBranches(data);
    } catch (error) {
      console.error("Error fetching branches:", error);
    }
  };

  const handleBranchSelect = async (branch: BaseBranch) => {
    try {
      const response = await api.post("/products/change-branch", {
        from_branch_id: currentBranch?.id,
        to_branch_id: branch.id,
        products: branchProducts,
        product_ids: items.map((product: CartItem) => product.id),
      });
      const data = await response.data;

      // Handle the response data as needed
      setCurrentBranch(branch);
      onClose();
    } catch (error) {
      console.error("Error changing branch:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Select a Branch</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {branches.map((branch: BaseBranch) => (
            <Card key={branch.id} className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{branch.name}</h3>
                  <p className="text-sm text-muted-foreground flex items-center mt-1">
                    <MapPin className="h-4 w-4 mr-1" />
                    {branch.address}
                  </p>
                  <p className="text-sm text-muted-foreground flex items-center mt-1">
                    <Phone className="h-4 w-4 mr-1" />
                    {branch.phone}
                  </p>
                  <p className="text-sm text-muted-foreground flex items-center mt-1">
                    <Clock className="h-4 w-4 mr-1" />
                    {branch.preparation_time} mins prep time
                  </p>
                </div>
                <Button onClick={() => handleBranchSelect(branch)}>
                  Select
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
