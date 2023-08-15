"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { Metadata, ResolvingMetadata } from "next";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

type Props = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

const CustomerPage = () => {
  const params = useParams();
  const { id } = params;

  const { data, isError, isLoading, error } = useQuery({
    queryKey: ["customers", id],
    queryFn: () => fetch(`/api/customers/${id}`).then((res) => res.json()),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      _id: data?._id || "",
      name: data?.name || "",
      email: data?.email || "",
      phone: data?.phone || "",
    },
  });

  useEffect(() => {
    reset({
      _id: data?._id || "",
      name: data?.name || "",
      email: data?.email || "",
      phone: data?.phone || "",
    });
  }, [data, reset]);

  const onSubmit = async (formData: any) => {
    toast.loading("Updating customer...", { id: "update-customer" });
    try {
      const updateCustomer = await fetch(`/api/customers/${id}`, {
        method: "PUT",
        body: JSON.stringify(formData),
      });

      if (!updateCustomer.ok) {
        const errorMessage = await updateCustomer.text();
        throw new Error(errorMessage);
      }

      const data = await updateCustomer.json();
      reset(data);
      toast.success("Customer updated successfully!", {
        id: "update-customer",
      });
    } catch (err: any) {
      const error = JSON.parse(err.message);
      toast.error(error.message, { id: "update-customer" });
    }
  };

  console.log(data)
  if (isError || data?.message) return <div>Error...</div>;

  return (
    <div className="mt-15 max-w-5xl m-auto">
      <h1 className="text-4xl font-bold my-10">Update Customer Details</h1>
      <div className="border p-5 rounded-lg">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="py-5">
            <p className="text-lg font-semibold pb-3">Name</p>
            <Input
              title="name"
              placeholder="Name"
              id="name"
              {...register("name", { required: true })}
            />
          </div>
          <div className="py-5">
            <p className="text-lg font-semibold pb-3">Email</p>
            <Input
              title="email"
              disabled
              placeholder="Email"
              id="email"
              {...register("email")}
            />
          </div>
          <div className="py-5">
            <p className="text-lg font-semibold pb-3">Phone</p>
            <Input
              title="phone"
              placeholder="Phone"
              id="phone"
              {...register("phone", { required: true })}
            />
          </div>

          <div className="flex justify-end gap-3 mt-10">
            <Button type="button" variant="outline" onClick={() => reset()}>
              Cancel
            </Button>
            <Button variant="default" type="submit">
              Save
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerPage;
