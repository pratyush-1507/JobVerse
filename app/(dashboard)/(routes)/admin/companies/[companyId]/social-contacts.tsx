"use client"
import { z } from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {Form} from "@/components/ui/form";
import { useRouter} from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Globe, Linkedin, Mail, MapPin, Pencil, Pin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Company } from "@prisma/client";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface CompanySocialContactsFormProps {
    initialData: Company
    companyId: string;
}
const formSchema = z.object({
  mail: z.string().min(1, { message: "Mail is required" }),
  website: z.string().min(1, { message: "Website is required" }),
  linkedIn: z.string().min(1, { message: "LinkedIn is required" }),
  address_line_1: z.string().min(1, { message: "Address line 1 is required" }),
  address_line_2: z.string().min(1, { message: "Address line 2 is required" }),
  city: z.string().min(1, { message: "City is required" }),
  state: z.string().min(1, { message: "State is required" }),
  zipcode: z.string().min(1, { message: "Zipcode is required" }),
});

export const CompanySocialContactsForm = ({ initialData, companyId }: CompanySocialContactsFormProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const router = useRouter();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            mail: initialData?.mail || "",
            website: initialData?.website || "",
            linkedIn: initialData?.linkedIn || "",
            address_line_1: initialData?.address_line_1 || "",
            address_line_2: initialData?.address_line_2 || "",
            city: initialData?.city || "",
            state: initialData?.state || "",
            zipcode: initialData?.zipcode || "",
        }
    });
    const {isSubmitting,isValid} = form.formState;
    
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try{
            const response = await axios.patch(`/api/companies/${companyId}`, values);
            toast.success("Company description updated!");
            toggleEditing();
            router.refresh();
        }
        catch (error) {
            toast.error("Something went wrong.Please try again.");
        }
    };
    const toggleEditing = () => setIsEditing((current) => !current);

    return (
      <div className="mt-6 border bg-neutral-100 rounded-md p-4">
        <div className="font-medium flex items-center justify-between">
          Social Contacts
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
        {/* displaying the description if user is not editing the form */}
        {!isEditing && <>
        <div className="grid grid-cols-3 gap-2">
            <div className="col-span-3">
                {initialData.mail && (
                    <div className="text-neutral-500 flex items-center w-full">
                        <Mail className="w-4 h-4 mr-2" />
                        {initialData.mail}
                    </div>
                )}
                {initialData.website && (
                    <div className="text-neutral-500 flex items-center w-full">
                        <Globe className="w-4 h-4 mr-2" />
                        {initialData.website}
                    </div>
                )}
                {initialData.linkedIn && (
                    <div className="text-neutral-500 flex items-center w-full">
                        <Linkedin className="w-4 h-4 mr-2" />
                        {initialData.linkedIn}
                    </div>
                )}
                </div>
            <div className="col-span-3">
                {initialData.address_line_1 && (
                    <div className="text-neutral-500 flex items-start w-full">
                        <MapPin className="w-4 h-4 mt-1" />
                        <div>
                            <p className="text-sm text-muted-foreground">{initialData.address_line_1}, {initialData.address_line_2}</p>
                            <p className="text-sm text-muted-foreground">{initialData.city}, {initialData.state} -{" "} {initialData.zipcode}</p>
                        </div>
                    </div>
                )}
               
                
            </div>
        </div>
        </>}
        {/* display input while editing */}
        {isEditing && (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 mt-4"
            >
              <FormField
                control={form.control}
                name="mail"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        disabled={isSubmitting}
                        placeholder="abc@maildomain.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        disabled={isSubmitting}
                        placeholder="https://example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="linkedIn"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        disabled={isSubmitting}
                        placeholder="https://linkedin.com/in/yourprofile"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address_line_1"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        disabled={isSubmitting}
                        placeholder="Address line 1"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
                <FormField
                    control={form.control}
                    name="address_line_2"
                    render={({ field }) => (
                    <FormItem>
                        <FormControl>
                        <Input
                            disabled={isSubmitting}
                            placeholder="Address line 2"
                            {...field}
                        />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <div className="grid grid-cols-3 gap-2">
                <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                    <FormItem>
                        <FormControl>
                        <Input
                            disabled={isSubmitting}
                            placeholder="City"
                            {...field}
                        />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                    <FormItem>
                        <FormControl>
                        <Input
                            disabled={isSubmitting}
                            placeholder="State"
                            {...field}
                        />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="zipcode"
                    render={({ field }) => (
                    <FormItem>
                        <FormControl>
                        <Input
                            disabled={isSubmitting}
                            placeholder="Zipcode"
                            {...field}
                        />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                </div>
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