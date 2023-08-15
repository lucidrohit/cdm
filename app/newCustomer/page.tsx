"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { ErrorMessage } from "@hookform/error-message";
import { customerZodSchema } from "@/models/customer";

const CustomerPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(customerZodSchema),
  });
  const router = useRouter();

  const onSubmit = async (formData: any) => {

    toast.loading("Creating new customer...", { id: "new-customer" });
    try {
      const updateCustomer = await fetch(`/api/customers`, {
        method: "POST",
        body: JSON.stringify(formData),
      });

      if (!updateCustomer.ok) {
        const errorMessage = await updateCustomer.text();
        throw new Error(errorMessage);
      }

      const data = await updateCustomer.json();
      reset(data);
      toast.success("Customer added successfully!", {
        id: "new-customer",
      });
      router.push("/");
    } catch (err: any) {
      const error = JSON.parse(err.message);
      toast.error(error.message, { id: "new-customer" });
    }
  };

  return (
    <div className="mt-15 max-w-5xl m-auto">
      <h1 className="text-4xl font-bold my-10">Create new customer</h1>
      <div className="border p-5 rounded-lg">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="py-2">
            <p className="text-lg font-semibold pb-3">Name</p>
            <Input
              title="name"
              placeholder="Name"
              id="name"
              {...register("name", { required: true })}
            />
            <p className="py-2 text-red-500">
              <ErrorMessage errors={errors} name="name" />
            </p>
          </div>

          <div className="py-2">
            <p className="text-lg font-semibold pb-3">Email</p>
            <Input
              title="email"
              placeholder="Email"
              id="email"
              {...register("email", { required: true })}
            />
            <p className="py-2 text-red-500">
              <ErrorMessage errors={errors} name="email" />
            </p>
          </div>
          <div className="py-2">
            <p className="text-lg font-semibold pb-3">Phone</p>
            <Input
              title="phone"
              placeholder="Phone"
              id="phone"
              {...register("phone", { required: true })}
            />
            <p className="py-2 text-red-500">
              <ErrorMessage errors={errors} name="phone" />
            </p>
          </div>

          <div className="flex justify-end gap-3 mt-10">
            <Link href="/">
              <Button type="button" variant="outline">
                Back
              </Button>
            </Link>
            <Button variant="default" type="submit">
              Create
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerPage;
