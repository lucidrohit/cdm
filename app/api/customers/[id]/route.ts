import connectMongoDB from "@/lib/mongodb";
import { Customer, validateCustomer } from "@/models/customer";
import { NextRequest, NextResponse } from "next/server";

interface Params {
  id: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Params }
) {
  const { id } = params;
  try {
    await connectMongoDB();
    const customer = await Customer.findById(id);
    if (!customer) {
      return NextResponse.json(
        { message: "Customer not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(customer);
  } catch (err: any) {
    if (err.name === "CastError")
      return NextResponse.json(
        { message: "Invalid Customer ID" },
        { status: 400 }
      );
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Params }
) {
  const { id } = params;
  const customerDetails = await request.json();
  try {
    await connectMongoDB();
    const customer = await Customer.findById(id);
    if (!customer) {
      return NextResponse.json(
        { message: "Customer not found" },
        { status: 404 }
      );
    }

    const updatedCustomerFields = {
      name: customerDetails.name ? customerDetails.name : customer.name,
      phone: customerDetails.phone ? customerDetails.phone : customer.phone,
    };

    const { success } = validateCustomer({
      ...updatedCustomerFields,
      email: customer.email,
    });

    if (!success) {
      return NextResponse.json(
        { message: "Invalid Customer Details" },
        { status: 400 }
      );
    }

    const updatedCustomer = await Customer.findByIdAndUpdate(
      id,
      updatedCustomerFields,
      {
        new: true,
      }
    );

    return NextResponse.json(updatedCustomer);
  } catch (err: any) {
    if(err.name === "CastError") return NextResponse.json({ message: "Invalid Customer ID" }, { status: 400 });
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Params }
) {
  const { id } = params;

  try {
    await connectMongoDB();
    const customer = await Customer.findById(id);

    if (!customer) {
      return NextResponse.json(
        { message: "Customer not found" },
        { status: 404 }
      );
    }

    await Customer.findByIdAndDelete(id);

    return NextResponse.json({ message: "Customer removed" });
  } catch (err: any) {
    if (err.name === "CastError") return NextResponse.json({ message: "Invalid Customer ID" }, { status: 400 });
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
