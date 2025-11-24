"use client";

import { cn } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import{
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { ArrowUpDown, Eye, Link, MoreHorizontal, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import NextLink from "next/link";

export type JobsColumns = {
  id: string;
  title: string;
  company: string;
  category: string;
  createdAt: string;
  isPublished: boolean;
};

export const columns: ColumnDef<JobsColumns>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "isPublished",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Published
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const { isPublished } = row.original;
      return (
        <div
          className={cn(
            "border px-3 py-1 text-sm rounded-full w-fit font-medium",
            isPublished
              ? "border-emerald-500 bg-emerald-100 text-emerald-800"
              : "border-red-500 bg-red-100 text-red-800"
          )}
        >
          {isPublished ? "Published" : "Unpublished"}
        </div>
      );
    },
  },
  {
    accessorKey: "category",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Category
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "company",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Company
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const { id } = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem asChild>
              <NextLink
                href={`/admin/jobs/${id}`}
                className="flex items-center gap-2 w-full"
              >
                <Pencil className="w-4 h-4" />
                <span>Edit</span>
              </NextLink>
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <NextLink
                href={`/admin/jobs/${id}/applicants`}
                className="flex items-center gap-2 w-full"
              >
                <Eye className="w-4 h-4" />
                <span>View Applicants</span>
              </NextLink>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
