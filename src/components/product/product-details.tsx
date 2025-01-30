"use client"

import { useState } from "react"
import Image from "next/image"
import { Heart, Minus, Plus, Star, Clock, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface ProductDetailsProps {
  product: {
    id: string
    name: string
    description: string
    image: string
    rating: number
    restaurant: string
    price: number
    originalPrice: number
    options: Array<{ name: string; price: number }>
    nutritionInfo: {
      calories: string
      protein: string
      carbs: string
      fat: string
    }
    ingredients: string[]
  }
}

const productImages = ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg", "/placeholder.svg"]

export function ProductDetails({ product }: ProductDetailsProps) {
  const [selectedOption, setSelectedOption] = useState(product.options[0].name)
  const [quantity, setQuantity] = useState(1)
  const [isFavorite, setIsFavorite] = useState(false)
  const [currentImage, setCurrentImage] = useState(0)

  const selectedPrice = product.options.find((opt) => opt.name === selectedOption)?.price || product.price
  const totalPrice = selectedPrice * quantity

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => Math.max(1, prev + delta))
  }

  return (
    <div className="grid md:grid-cols-2 gap-8">
      {/* Product Image Slider */}
      <div className="space-y-4">
        <div className="relative aspect-square rounded-xl overflow-hidden">
          <Image
            src={product.image || productImages[currentImage]}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 hover:scale-110"
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 bg-white/80 hover:bg-white rounded-full"
            onClick={() => setIsFavorite(!isFavorite)}
          >
            <Heart className={cn("h-5 w-5", isFavorite ? "fill-red-500 text-red-500" : "")} />
          </Button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 px-4 py-2 bg-black/50 rounded-full">
            {productImages.map((_, index) => (
              <button
                key={index}
                className={cn(
                  "w-2 h-2 rounded-full transition-colors",
                  currentImage === index ? "bg-white" : "bg-white/50",
                )}
                onClick={() => setCurrentImage(index)}
              />
            ))}
          </div>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {productImages.map((img, index) => (
            <div
              key={index}
              className={cn(
                "relative aspect-square rounded-lg overflow-hidden cursor-pointer border-2",
                currentImage === index ? "border-primary" : "border-transparent",
              )}
              onClick={() => setCurrentImage(index)}
            >
              <Image
                src={img || "/placeholder.svg"}
                alt={`${product.name} ${index + 1}`}
                fill
                className="object-cover hover:scale-110 transition-transform duration-300"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Product Info */}
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <div className="flex items-center gap-1">
              <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
              <span className="font-medium">{product.rating}</span>
            </div>
          </div>
          <p className="text-muted-foreground">{product.restaurant}</p>
        </div>

        <div className="space-y-4">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold">${product.price.toFixed(2)}</span>
            {product.originalPrice > product.price && (
              <span className="text-muted-foreground line-through">${product.originalPrice.toFixed(2)}</span>
            )}
          </div>

          <div className="space-y-2">
            <Label>Capacity</Label>
            <RadioGroup value={selectedOption} onValueChange={setSelectedOption} className="grid grid-cols-3 gap-4">
              {product.options.map((option) => (
                <Label
                  key={option.name}
                  className={cn(
                    "flex items-center justify-between rounded-lg border-2 p-4 cursor-pointer",
                    selectedOption === option.name && "border-primary",
                  )}
                >
                  <RadioGroupItem value={option.name} className="sr-only" />
                  <span className="font-medium">{option.name}</span>
                  <span className="text-sm text-muted-foreground">+${option.price.toFixed(2)}</span>
                </Label>
              ))}
            </RadioGroup>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center border rounded-lg">
              <Button variant="ghost" size="icon" className="rounded-none" onClick={() => handleQuantityChange(-1)}>
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-12 text-center">{quantity}</span>
              <Button variant="ghost" size="icon" className="rounded-none" onClick={() => handleQuantityChange(1)}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <Button size="lg" className="flex-1">
              Add to cart - ${totalPrice.toFixed(2)}
            </Button>
          </div>
        </div>

        <Tabs defaultValue="description" className="mt-8">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
            <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="mt-4">
            <p className="text-muted-foreground">{product.description}</p>
          </TabsContent>
          <TabsContent value="ingredients" className="mt-4">
            <div className="grid grid-cols-2 gap-2">
              {product.ingredients.map((ingredient) => (
                <Badge key={ingredient} variant="secondary">
                  {ingredient}
                </Badge>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="nutrition" className="mt-4">
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(product.nutritionInfo).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between p-2 rounded-lg bg-secondary">
                  <span className="capitalize">{key}</span>
                  <span className="font-medium">{value}</span>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

