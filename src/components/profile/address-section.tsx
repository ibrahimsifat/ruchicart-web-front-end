import { MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export function AddressSection() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>My Addresses</CardTitle>
        <Button variant="outline" size="sm" className="gap-2">
          <MapPin className="h-4 w-4" />
          Add Address
        </Button>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <div className="h-24 w-24 mb-4">
          <img src="/placeholder.svg" alt="No address" className="w-full h-full object-contain" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No Address Found!</h3>
        <p className="text-sm text-muted-foreground">Please add your address for better experience!</p>
      </CardContent>
    </Card>
  )
}

