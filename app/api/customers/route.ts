import connectMongoDB from "@/lib/mongodb";
import { Customer, CustomerType, validateCustomer } from "@/models/customer"; // Removed the redundant import of User
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await connectMongoDB();
    const customers = await Customer.find();
    return NextResponse.json(customers);
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const customer: CustomerType = await request.json();
  const { success } = validateCustomer(customer);
  if (!success) {
    return NextResponse.json(
      { message: "Invalid customer data" },
      { status: 400 }
    );
  }

  try {
    await connectMongoDB();
    const newCustomer = new Customer(customer);
    await newCustomer.save();
    return NextResponse.json(newCustomer);
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
