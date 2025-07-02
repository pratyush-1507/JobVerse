"use client";
import { z } from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { Job } from "@prisma/client";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Lightbulb, Loader2, Pencil } from "lucide-react";
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Textarea } from "@/components/ui/textarea";
import getGenerativeAIResponse from "@/scripts/aistudio";


interface ShortDescriptionProps {
  initialData: Job;
  jobId: string;
}
const formSchema = z.object({
  short_description: z.string().min(1),
});

export const ShortDescription = ({
  initialData,
  jobId
}: ShortDescriptionProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [prompt, setPrompt] = useState("");
  const[isPrompting, setIsPrompting] = useState(false);

  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        short_description: initialData.short_description || "",
    },
  });
  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.patch(`/api/jobs/${jobId}`, values);
      toast.success("Short description updated successfully!");
      toggleEditing();
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong.Please try again.");
    }
  };
  const toggleEditing = () => setIsEditing((current) => !current);

//  GENERATING PROMPT FOR GOOGLE AI FOR SHORT DESCRIPTION
    const handlePromptGeneration = async () => {
        try{
            setIsPrompting(true);
            const customPrompt = `Could you geneate a concise job description for a ${prompt} position? Please keep it short and to the point.`;
            await getGenerativeAIResponse(customPrompt).then((data) => {
                form.setValue("short_description", data);
                setIsPrompting(false);
            });
        }catch(error){
            console.log(error);
            toast.error("Something went wrong.");

        }
    }


  return (
    <div className="mt-6 border bg-neutral-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Short Description
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
      {/* displaying the categoryId if user is not editing the form */}
      {!isEditing && (
        <p className="text-neutral-500">{initialData?.short_description}</p>
      )}
      {/* display input while editing */}
      {isEditing && (
        <>
          <div className="flex items-center gap-2 my-2">
            <input type="text" placeholder="e.g Software Developer" value={prompt}
            onChange= {(e) => setPrompt(e.target.value)}
            className="w-full p-2 rounded-md"/>
            {isPrompting?(<>
            <Button>
                <Loader2 className="w-4 h-4 animate-spin" />
            </Button>
            </>):(
                <>
                <Button onClick={handlePromptGeneration} >
                    <Lightbulb className="w-4 h-4"/>
                </Button>
                </>
            )
            }
          </div>
          <p className="text-xs text-muted-foreground text-right">Job name is enough to generate the tags</p>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 mt-4"
            >
              <FormField
                control={form.control}
                name="short_description"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                        {/* from shadcn */}
                        <Textarea disabled = {isSubmitting} placeholder= "Short Description"
                        {...field}/>
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
        </>
      )}
    </div>
  );
};
