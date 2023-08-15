"use client";

import React, { useEffect, useState } from "react";

import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Pencil, Trash2, MoreHorizontal } from "lucide-react";
import DeleteModal from "@/components/DeleteModal";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

export type Customer = {
  _id: any;
  name: string;
  email: string;
  phone: string;
};

const columns: ColumnDef<Customer>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => row.getValue("name"),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => row.getValue("email"),
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => row.getValue("phone"),
  },
];

function CustomersPage() {
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const router = useRouter();

  const { data, isError, isLoading,refetch } = useQuery({
    queryKey: ["customers"],
    queryFn: () => fetch("/api/customers").then((res) => res.json()),
  });

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error</div>;

  const handleDeleteClick = (customer: Customer) => {
    setSelectedCustomer(customer);
    setDeleteModalVisible(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedCustomer) {
      toast.loading("Deleting...", {id: "delete-customer"});
      try {
        const deletedUser = await fetch(
          `/api/customers/${selectedCustomer._id}`,
          {
            method: "DELETE",
          }
        );
        if (!deletedUser.ok) {
          const errorMessage = await deletedUser.text();
          throw new Error(errorMessage);
        }
        toast.success("Customer deleted", {id: "delete-customer"});
        refetch();
      } catch (err: any) {
        const errorMessage = JSON.parse(err.message);
        toast.error("Error deleting customer", {id: "delete-customer"});
      }
    }
    setDeleteModalVisible(false);
    setSelectedCustomer(null);
  };

  return (
    <div className="w-full mt-10">
      <h1 className="text-4xl font-bold my-5">All Customers</h1>
      <div className="flex justify-end mb-5">
        <Button
          onClick={() => router.push("/newCustomer")}
        >
          Add Customer
        </Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.map((row) => (
              <TableRow key={row.id}>
                <TableCell>
                  {row.getVisibleCells()[0].renderValue() as String}
                </TableCell>
                <TableCell>
                  {row.getVisibleCells()[1].renderValue() as String}
                </TableCell>
                <TableCell>
                  {row.getVisibleCells()[2].renderValue() as String}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent className="divide-y divide-gray-100">
                      <DropdownMenuItem
                        className=" inline-flex w-full"
                        onClick={() =>
                          router.push(`/customers/${row.original._id}`)
                        }
                      >
                        <Pencil className="w-4" />{" "}
                        <span className="ml-2">Edit</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className=" inline-flex w-full text-red-500 hover:bg-red-500 hover:text-white"
                        onClick={() => handleDeleteClick(row.original)}
                      >
                        <Trash2 className="w-4" />{" "}
                        <span className="ml-2">Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <DeleteModal
        open={isDeleteModalVisible}
        handleOpenChange={() => setDeleteModalVisible(false)}
        handleConfirmDelete={handleConfirmDelete}
      />
    </div>
  );
}

export default CustomersPage;
