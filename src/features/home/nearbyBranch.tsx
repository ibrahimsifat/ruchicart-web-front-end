"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import CustomImage from "@/components/ui/customImage";
import { SectionHeader } from "@/components/ui/section-header";
import { CartIconRef } from "@/features/layout/navbar";
import { useBranch } from "@/lib/hooks/queries/Branch/useBranch";
import { ImageType } from "@/types/image";
import { ChevronDown, Clock, Mail, MapPin, Phone } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";

export function NearbyBranch() {
  const { data: branches, isLoading, error } = useBranch();
  const t = useTranslations("home");
  return (
    <CartIconRef.Provider value={null}>
      <section className="py-12">
        <SectionHeader
          title={t("restaurantsNearYou")}
          description={t("discoverGreatPlacesToEatAroundYou")}
        />
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5">
            <div className="relative h-48 mb-4 rounded-lg overflow-hidden">
              <Image
                src="/placeholder.svg"
                alt="Map"
                fill
                className="object-cover"
              />
            </div>
            <h3 className="text-xl font-semibold mb-2">{t("findNearby")}</h3>
            <p className="text-muted-foreground mb-4">
              {t("exploreRestaurantsAndCafesNearYourLocation")}
            </p>
            <Button className="w-full">
              <MapPin className="mr-2 h-4 w-4" />
              {t("setLocation")}
            </Button>
          </Card>

          <div className="md:col-span-2 space-y-6">
            <div className="grid gap-4">
              {branches?.map((branch) => (
                <Card key={branch.id} className="overflow-hidden duration-300">
                  <div className="flex flex-col sm:flex-row">
                    <div className="relative w-full sm:w-2/5 h-48 sm:h-auto">
                      <CustomImage
                        src={branch.image || "/placeholder-branch.jpg"}
                        alt={branch.name}
                        type={ImageType.BRANCH}
                        fill
                      />
                      <div className="absolute top-2 left-2 flex flex-col gap-2">
                        <Badge className="text-xs font-semibold">
                          {branch.status}
                        </Badge>
                        <Badge
                          variant="secondary"
                          className="text-xs font-semibold capitalize"
                        >
                          {branch?.branch_promotion_status == 1
                            ? "Recommended"
                            : "New"}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex-1 p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-semibold mb-1">
                            {branch.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {branch.address}
                          </p>
                        </div>
                        <Avatar className="h-12 w-12 border-2 border-primary">
                          <AvatarImage src={branch.image} alt={branch.name} />
                          <AvatarFallback>
                            {branch.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="flex items-center">
                          <Phone className="h-5 w-5 mr-3 text-primary" />
                          <span className="text-sm">{branch.phone}</span>
                        </div>
                        <div className="flex items-center">
                          <Mail className="h-5 w-5 mr-3 text-primary" />
                          <span className="text-sm">{branch.email}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-5 w-5 mr-3 text-primary" />
                          <span className="text-sm">
                            {branch.preparation_time} mins prep time
                          </span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-5 w-5 mr-3 text-primary" />
                          <span className="text-sm">
                            {branch.coverage} km coverage
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <Button
                          variant="default"
                          size="sm"
                          className="w-full sm:w-auto"
                        >
                          {t("switchToThisBranch")}
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            <div className="flex justify-center">
              <Button variant="default" className="w-full sm:w-auto">
                {t("allBranches")}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </CartIconRef.Provider>
  );
}
