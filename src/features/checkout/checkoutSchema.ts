import { z } from 'zod';

export const CheckoutFormSchema = z
  .object({
    customerName: z.string().trim().min(2, 'Name must have at least 2 characters'),
    deliveryType: z.enum(['delivery', 'takeaway']),
    paymentMethod: z.enum(['cash', 'transfer']),
    deliveryAddress: z.string().optional(),
    postalCode: z.string().optional(),
    orderNotes: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.deliveryType === 'delivery') {
        return Boolean(data.deliveryAddress && data.deliveryAddress.trim().length >= 3);
      }
      return true;
    },
    {
      message: 'Delivery address is required for home delivery',
      path: ['deliveryAddress'],
    }
  );

export type CheckoutFormData = z.infer<typeof CheckoutFormSchema>;
