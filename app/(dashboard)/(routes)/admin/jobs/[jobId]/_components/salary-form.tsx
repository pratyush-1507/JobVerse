"use client";
import { z } from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { Job } from "@prisma/client";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Combobox } from "@/components/ui/combo-box";

interface SalaryProps {
  initialData: Job,
  jobId: string
}
const formSchema = z.object({
  salary: z.string().min(1),
});

export const Salary = ({
  initialData,
  jobId,
  
}: SalaryProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      salary: initialData.hourlyRate || "",
    },
  });
  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.patch(`/api/jobs/${jobId}`, values);
      toast.success("Job salary updated successfully!");
      toggleEditing();
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong.Please try again.");
    }
  };
  const toggleEditing = () => setIsEditing((current) => !current);


  return (
    <div className="mt-6 border bg-neutral-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Job Category
        <Button onClick={toggleEditing} variant={"ghost"}>
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="w-4 h-4 mr-2" />
              Edit
            </>
          )}
        </Button>
      </div>
      {/* displaying the salary if user is not editing the form */}
      {!isEditing && (
        <p
  className="text-sm mt-2">
  {initialData.hourlyRate ? `${initialData.hourlyRate} LPA` : "Not mentioned"}
</p>
      )}
      {/* display input while editing */}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="salary"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                    placeholder="Enter the salary"
                    disabled={isSubmitting}
                    {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button disabled={!isValid || isSubmitting} type="submit">
                {" "}
                Save
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};
