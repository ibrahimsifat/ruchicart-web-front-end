"use client"

import { CreditCard, Plus } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface PaymentMethodsProps {
  value: string
  onChange: (value: string) => void
}

const paymentMethods = [
  {
    id: "card",
    name: "Credit/Debit Card",
    icon: "/placeholder.svg",
    lastDigits: "•••• 4242",
  },
  {
    id: "paypal",
    name: "PayPal",
    icon: "/placeholder.svg",
    email: "john.doe@example.com",
  },
  {
    id: "apple-pay",
    name: "Apple Pay",
    icon: "/placeholder.svg",
  },
]

export function PaymentMethods({ value, onChange }: PaymentMethodsProps) {
  return (
    <Card className="relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/50 to-primary" />
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-primary" />
          Payment Methods
        </CardTitle>
        <Button variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add New Card
        </Button>
      </CardHeader>
      <CardContent>
        <RadioGroup value={value} onValueChange={onChange} className="grid gap-4">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className="relative flex items-center space-x-4 rounded-lg border p-4 cursor-pointer hover:bg-accent transition-colors"
              onClick={() => onChange(method.id)}
            >
              <RadioGroupItem value={method.id} id={method.id} className="absolute right-4" />
              <div className="h-12 w-12 rounded-lg border bg-card p-2 flex items-center justify-center">
                <Image
                  src={method.icon || "/placeholder.svg"}
                  alt={method.name}
                  width={32}
                  height={32}
                  className="object-contain"
                />
              </div>
              <div className="flex-1">
                <Label htmlFor={method.id} className="text-base font-medium">
                  {method.name}
                </Label>
                {method.lastDigits && <p className="text-sm text-muted-foreground">{method.lastDigits}</p>}
                {method.email && <p className="text-sm text-muted-foreground">{method.email}</p>}
              </div>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  )
}

