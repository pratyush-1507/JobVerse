"use client";
import { z } from "zod";
import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import {
  Form,
  FormField,
  FormControl,
  FormItem,
  FormLabel,
  FormDescription,
} from "@/components/ui/form";

const formSchema = z.object({
  name: z.string().min(1, { message: "Company name is required!" }),
});

const CompanyCreatePage = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });
  const { isSubmitting, isValid } = form.formState;
  const router = useRouter();
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.post("/api/companies", values);
      router.push(`/admin/companies/${response.data.id}`);
      toast.success("Company Registered!");
    } catch (error) {
      console.log((error as Error)?.message);
      toast.error((error as Error)?.message);
    }
  };
  return (
    <div className="max-w-5xl mx-auto p-6 h-full flex flex-col justify-start md:justify-center">
      <div className="">
        <h1 className="text-2xl">Hello There!</h1>
        <p className="text-sm text-neutral-500">
          Enter the company name you've been working for
        </p>
      </div>
      {/* form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-9 mt-8">
          {/* form field */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Name</FormLabel>
                <FormControl>
                  <Input
                    disabled={isSubmitting}
                    placeholder="e.g. Facebook, Apple, Amazon, Netflix, Google..."
                    {...field}
                  />
                </FormControl>
                {/* <FormMessage/> */}
              </FormItem>
            )}
          />
          <div className="flex items-center gap-x-2">
            <Link href={"/"}>
              <Button type="button" variant={"ghost"}>
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={!isValid || isSubmitting}>
              Continue
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
export default CompanyCreatePage;
