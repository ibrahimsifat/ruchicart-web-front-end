import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { MapPin, ShoppingBag } from "lucide-react";
import { memo } from "react";

export const OrderTypeSelector = memo(
  ({ control, t }: { control: any; t: any }) => (
    <FormField
      control={control}
      name="order_type"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-base">{t("deliveryOptions")}</FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              className="grid grid-cols-2 gap-4"
            >
              <DeliveryOption t={t} />
              <TakeAwayOption t={t} />
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
);

const DeliveryOption = memo(({ t }: { t: any }) => (
  <FormItem className="relative">
    <FormControl>
      <RadioGroupItem value="delivery" id="delivery" className="peer sr-only" />
    </FormControl>
    <Label
      htmlFor="delivery"
      className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
    >
      <MapPin className="mb-2 h-6 w-6" />
      {t("homeDelivery")}
    </Label>
  </FormItem>
));

const TakeAwayOption = memo(({ t }: { t: any }) => (
  <FormItem className="relative">
    <FormControl>
      <RadioGroupItem
        value="take_away"
        id="take_away"
        className="peer sr-only"
      />
    </FormControl>
    <Label
      htmlFor="take_away"
      className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
    >
      <ShoppingBag className="mb-2 h-6 w-6" />
      {t("takeAway")}
    </Label>
  </FormItem>
));
