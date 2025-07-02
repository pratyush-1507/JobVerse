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
import { Editor } from "@/components/ui/editor";


interface ShortDescriptionProps {
  initialData: Job;
  jobId: string;
}
const formSchema = z.object({
  description: z.string().min(1),
});

export const JobDescription = ({
  initialData,
  jobId
}: ShortDescriptionProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [rolename,setRolename] = useState("");
  const [skills, setSkills] = useState("");
  const[isPrompting, setIsPrompting] = useState(false);

  // to get ai generated text in format
  const[aiValue,setaiValue] = useState(null);

  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        description: initialData.description || "",
    },
  });
  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.patch(`/api/jobs/${jobId}`, values);
      toast.success("Description updated successfully!");
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
            const customPrompt = `Generate a formal job requirement document for the position of ${rolename}. The job description should clearly mention roles and responsibilities,key features,and other details like work experience,salary etc. The required skills should include proeficiency in ${skills}. Add more details if you want.`

            await getGenerativeAIResponse(customPrompt).then((data)=>{
              data = data.replace(/^'|'$/g,"");
              let cleanedText = data.replace(/[\*\#]/g,"");
              console.log(cleanedText);
              // form.setValue("description", cleanedText);
              setaiValue(cleanedText);
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
        Job Description
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
        <p className="text-neutral-500">{initialData?.description}</p>
      )}
      {/* display input while editing */}
      {isEditing && (
        <>
          <div className="flex items-center gap-2 my-2">
            <input
              type="text"
              placeholder="e.g Software Developer"
              value={rolename}
              onChange={(e) => setRolename(e.target.value)}
              className="w-full p-2 rounded-md"
            />
            <input
              type="text"
              placeholder="Requirements"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              className="w-full p-2 rounded-md"
            />
            {isPrompting ? (
              <>
                <Button>
                  <Loader2 className="w-4 h-4 animate-spin" />
                </Button>
              </>
            ) : (
              <>
                <Button onClick={handlePromptGeneration}>
                  <Lightbulb className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>
          <p className="text-xs text-muted-foreground text-right">
            Enter requirements seperated by a comma
          </p>
            {aiValue && (<div className="w-full h-96 max-h-96 rounded-md bg-white overflow-y-scroll p-3 relative mt-4 text-muted-foreground">
              {aiValue}
            </div>)}


          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 mt-4"
            >
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      {/* from react-quill */}
                      <Editor {...field}/>
                      
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
