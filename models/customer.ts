import mongoose, { Schema } from "mongoose";
import { z } from "zod";

const customerSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 50,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
      minlength: 10,
      maxlength: 10,
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 255,
      trim: true,
      lowercase: true,
      unique: true,
    },
  },
  { timestamps: true }
);

const customerZodSchema = z.object({
  name: z.string().min(3).max(50).nonempty(),
  phone: z.string().min(10).max(10).nonempty(),
  email: z.string().email().nonempty(),
});

type CustomerType = z.infer<typeof customerZodSchema>;

function validateCustomer(customer: CustomerType) {
  return customerZodSchema.safeParse(customer);
}

const Customer =  mongoose.models?.Customer || mongoose.model("Customer", customerSchema);

export { validateCustomer, Customer,customerZodSchema };
export type { CustomerType };

