"use client"

import { useState, useEffect } from "react"
import { Search, X, Loader2, AlertTriangle } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface AddressModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (address: any) => void
  initialAddress?: any
}

export function AddressModal({ isOpen, onClose, onSave, initialAddress }: AddressModalProps) {
  const [addressType, setAddressType] = useState(initialAddress?.type || "home")
  const [searchQuery, setSearchQuery] = useState(initialAddress?.fullAddress || "")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (initialAddress) {
      setAddressType(initialAddress.type || "home")
      setSearchQuery(initialAddress.fullAddress || "")
      // Load other fields as needed
    }
  }, [initialAddress])

  const handleAddressSearch = () => {
    setIsLoading(true)
    setError(null)
    // Simulating an API call
    setTimeout(() => {
      setIsLoading(false)
      // If you have an actual API, handle potential errors here
      // setError("Error message")
    }, 1500)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl p-0">
        <DialogHeader className="p-6 pb-4 bg-gradient-to-r from-primary/10 to-primary/5 border-b">
          <div className="flex justify-between items-center">
            <DialogTitle className="text-2xl font-semibold text-primary">
              {initialAddress ? "Edit" : "Add"} Delivery Address
            </DialogTitle>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-primary hover:text-primary/80">
              <X className="h-5 w-5" />
            </Button>
          </div>
        </DialogHeader>
        <div className="grid md:grid-cols-5 gap-8 p-6">
          {/* Map Section */}
          <div className="md:col-span-3 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search location..."
                className="pl-10 pr-12 py-6 text-lg rounded-full shadow-sm border-2 border-primary/20 focus:border-primary transition-all duration-300"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleAddressSearch()}
              />
              <Button
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full"
                onClick={handleAddressSearch}
              >
                Search
              </Button>
            </div>
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden border-2 border-primary/20 shadow-md">
              {isLoading ? (
                <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
                  <div className="flex flex-col items-center">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                    <p className="mt-2 text-sm text-muted-foreground">Loading map...</p>
                  </div>
                </div>
              ) : error ? (
                <div className="absolute inset-0 flex items-center justify-center bg-destructive/10 text-destructive">
                  <div className="flex flex-col items-center">
                    <AlertTriangle className="h-10 w-10 mb-2" />
                    <p>Error loading map</p>
                    <Button variant="outline" size="sm" onClick={handleAddressSearch} className="mt-2">
                      Retry
                    </Button>
                  </div>
                </div>
              ) : (
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3618.727010735933!2d91.837871!3d24.907291!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjTCsDU0JzI2LjIiTiA5McKwNTAnMTYuMyJF!5e0!3m2!1sen!2sbd!4v1620120000000!5m2!1sen!2sbd"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              )}
            </div>
          </div>

          {/* Form Section */}
          <div className="md:col-span-2 space-y-6 bg-card p-6 rounded-lg shadow-sm border border-border">
            <div className="space-y-2">
              <Label className="text-lg font-medium">Label As</Label>
              <RadioGroup defaultValue={addressType} onValueChange={setAddressType} className="flex gap-4">
                {["home", "office", "other"].map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <RadioGroupItem value={type} id={type} />
                    <Label htmlFor={type} className="cursor-pointer capitalize">
                      {type}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label className="text-lg font-medium">Address</Label>
              <Input value={searchQuery} readOnly className="bg-muted" />
            </div>

            <div className="space-y-2">
              <Label className="text-lg font-medium">Contact Person Name *</Label>
              <Input placeholder="Enter contact person name" className="border-2 focus:border-primary" />
            </div>

            <div className="space-y-2">
              <Label className="text-lg font-medium">Phone</Label>
              <div className="flex gap-2">
                <Select defaultValue="+1">
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="+1">🇺🇸 +1</SelectItem>
                    <SelectItem value="+44">🇬🇧 +44</SelectItem>
                    <SelectItem value="+91">🇮🇳 +91</SelectItem>
                  </SelectContent>
                </Select>
                <Input type="tel" placeholder="Enter phone number" className="flex-1 border-2 focus:border-primary" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-lg font-medium">House</Label>
                <Input placeholder="House number" className="border-2 focus:border-primary" />
              </div>
              <div className="space-y-2">
                <Label className="text-lg font-medium">Floor</Label>
                <Input placeholder="Floor number" className="border-2 focus:border-primary" />
              </div>
            </div>

            <Button
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              size="lg"
              onClick={() => {
                onSave({
                  type: addressType,
                  fullAddress: searchQuery,
                  // Add other form values
                })
              }}
            >
              Save Address
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

