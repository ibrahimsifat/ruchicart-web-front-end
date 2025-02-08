"use client";

import { Card, CardContent } from "@/components/ui/card";
import type { Product } from "@/types/product";
import {
  GoogleMap,
  InfoWindow,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface ProductMapProps {
  products: Product[];
  currentLocation: { lat: number; lng: number } | null;
  zoom?: number;
}

const mapOptions: google.maps.MapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  streetViewControl: true,
  fullscreenControl: true,
};

export function ProductMap({
  products,
  currentLocation,
  zoom = 12,
}: ProductMapProps) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: ["places"],
  });

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  if (!isLoaded) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerClassName="h-full w-full"
      center={currentLocation || { lat: 0, lng: 0 }}
      zoom={zoom}
      options={mapOptions}
    >
      {currentLocation && (
        <Marker
          position={currentLocation}
          icon={{
            url: "/user-location-marker.svg",
            scaledSize: new google.maps.Size(30, 30),
          }}
        />
      )}

      {products.map((product) => (
        <Marker
          key={product.id}
          position={{ lat: product.latitude, lng: product.longitude }}
          onClick={() => setSelectedProduct(product)}
        />
      ))}

      {selectedProduct && (
        <InfoWindow
          position={{
            lat: selectedProduct.latitude,
            lng: selectedProduct.longitude,
          }}
          onCloseClick={() => setSelectedProduct(null)}
        >
          <Card className="p-2 min-w-[200px]">
            <CardContent>
              <div className="flex items-center space-x-4">
                <Image
                  src={selectedProduct.image || "/placeholder.svg"}
                  alt={selectedProduct.name}
                  width={60}
                  height={60}
                  className="rounded-md"
                />
                <div>
                  <h3 className="font-semibold">{selectedProduct.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    ${selectedProduct.price.toFixed(2)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </InfoWindow>
      )}
    </GoogleMap>
  );
}
