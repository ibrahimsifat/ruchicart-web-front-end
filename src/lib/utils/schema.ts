import * as z from "zod";

export const formSchema = z.object({
  order_amount: z.number(),
  payment_method: z.string().min(1, "Please select a payment method"),
  order_type: z.enum(["delivery", "take_away"]),
  delivery_address_id: z.number().optional(),
  branch_id: z.number().optional(),
  delivery_time: z.string(),
  delivery_date: z.string(),
  distance: z.number(),
  is_partial: z.number(),
  delivery_tip: z.number().optional(),
  stripe_payment_intent_id: z.string().optional(),
  cart: z.array(
    z.object({
      product_id: z.string(),
      quantity: z.number(),
      variant: z.array(
        z.object({
          name: z.string(),
          values: z.array(
            z.object({
              label: z.array(z.string()),
              optionPrice: z.number(),
            })
          ),
        })
      ),
      add_on_ids: z.array(z.number()),
      add_on_qtys: z.array(z.number()),
    })
  ),
  change_amount: z.string().optional(),
  wallet_amount: z.number().optional(),
});
