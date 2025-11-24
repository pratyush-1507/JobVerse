"use client"
import { z } from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {Form} from "@/components/ui/form";
import { useRouter} from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { Input } from "@/components/ui/input";
import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Company } from "@prisma/client";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface CompanyDescriptionFormProps {
    initialData: Company
    companyId: string;
}
const formSchema = z.object({
    description: z.string().min(1, { message: "Company description can't be empty" }),
});

export const CompanyDescriptionForm = ({ initialData, companyId }: CompanyDescriptionFormProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const router = useRouter();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            description: initialData?.description || ""
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

    return (<div className="mt-6 border bg-neutral-100 rounded-md p-4">
        <div className="font-medium flex items-center justify-between">
            Company Description
            <Button onClick= {toggleEditing} variant = {"ghost"}>
            {isEditing? (<>Cancel</>):
            (
            <>
            <Pencil className="w-4 h-4 mr-2" />
            Edit
            </>)}
            </Button>
        </div>
        {/* displaying the description if user is not editing the form */}
        {!isEditing && <p className={cn("text-sm mt-2",!initialData.description && "text-neutral-500 italic")}>{initialData.description || "No Description"}</p>}
        {/* display input while editing */}
        {isEditing && (
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                   <FormField
                   control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Textarea
                                disabled={isSubmitting}
                                placeholder="e.g. Enter company description here"
                                {...field}
                                />
                            </FormControl> 
                            <FormMessage/>
                        </FormItem>
                    )}
                   />
                   <div className="flex items-center gap-x-2">
                    <Button disabled = {!isValid || isSubmitting} type="submit"> Save</Button>
                    
                   </div>
                </form>
            </Form>
        )}

    </div>
    );
};