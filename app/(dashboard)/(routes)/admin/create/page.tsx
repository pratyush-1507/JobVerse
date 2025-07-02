"use client";
import {z} from "zod";
import React, {useState} from "react";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {useForm} from "react-hook-form"
import {Input} from "@/components/ui/input";
import axios from "axios";
import {zodResolver} from "@hookform/resolvers/zod";
import {useRouter} from "next/navigation";
import {toast} from "react-hot-toast";
import {Form,FormField, FormControl, FormItem, FormLabel, FormDescription} from "@/components/ui/form";

const formSchema = z.object({
    title: z.string().min(1, {message:"Job Title can't be empty"}),});

const JobCreatePage = () => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver : zodResolver(formSchema),
        defaultValues: {
            title: "",
        },
    });
    const {isSubmitting, isValid} = form.formState;
    const router = useRouter();
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try{
          const response = await axios.post("/api/jobs",values);
          router.push(`/admin/jobs/${response.data.id}`);
          toast.success("Job created successfully!");
        }catch (error) {
          console.log((error as Error)?.message);
        }
    };
    return (
      <div className="max-w-5xl mx-auto p-6 h-full flex flex-col justify-start md:justify-center">
        <div className="">
          <h1 className="text-2xl">Name Your Job</h1>
          <p className="text-sm text-neutral-500">
            What would you like to name your job? Don&apos;t worry,you can
            change it later.
          </p>
        </div>
        {/* form */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-9 mt-8"
          >
            {/* form field */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Title</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="e.g. Software Engineer"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Role of this job</FormDescription>
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
export default JobCreatePage;