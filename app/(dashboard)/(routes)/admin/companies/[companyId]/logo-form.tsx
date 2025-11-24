"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import ImageUpload from "@/components/ui/ImageUpload";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Company } from "@prisma/client";
import axios from "axios";
import { ImageIcon, Pencil } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { z } from "zod";

interface CompanyLogoFormProps {
  initialData: Company;
  companyId: string;
}

const formSchema = z.object({
  logo: z.string().min(1, "Logo is required"),
  logoPublicId: z.string().optional(),
});

export const CompanyLogoForm = ({
  initialData,
  companyId,
}: CompanyLogoFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      logo: initialData?.logo || "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/companies/${companyId}`, values);
      toast.success("Logo updated successfully");
      setIsEditing(false);
      router.refresh();
    } catch (error) {
      console.error("Logo update error:", error);
      toast.error("Failed to update logo");
    }
  };

  const toggleEditing = () => setIsEditing((current) => !current);

  return (
    <div className="mt-6 border bg-neutral-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Company Logo
        <Button onClick={toggleEditing} variant="ghost">
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

      {!isEditing && (
        <div className="mt-2">
          {!initialData.logo ? (
            <div className="flex items-center justify-center h-60 bg-neutral-200 rounded-md">
              <ImageIcon className="w-10 h-10 text-neutral-500" />
              <span className="ml-2 text-neutral-500">No logo uploaded</span>
            </div>
          ) : (
            <div className="relative w-full h-60 mt-2">
              <Image
                alt="Company Logo"
                fill
                className="object-contain rounded-md" // Changed from object-cover
                src={initialData.logo}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          )}
        </div>
      )}

      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="logo"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <ImageUpload
                      value={field.value}
                      disabled={isSubmitting}
                      onChange={(url, publicId) => {
                        field.onChange(url);
                        // If you want to store publicId:
                        // form.setValue("logoPublicId", publicId);
                      }}
                      onRemove={() => {
                        field.onChange("");
                        // form.setValue("logoPublicId", "");
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button disabled={!isValid || isSubmitting} type="submit">
                {isSubmitting ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};
