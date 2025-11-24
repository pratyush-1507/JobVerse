"use client";
import { z } from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { Job } from "@prisma/client";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Lightbulb, Loader2, Pencil, X } from "lucide-react";
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
import { set } from "date-fns";


interface TagsFormProps {
  initialData: Job;
  jobId: string;
}
const formSchema = z.object({
  tags: z.array(z.string()).min(1),
});

export const TagsForm = ({
  initialData,
  jobId
}: TagsFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [prompt, setPrompt] = useState("");
  const[isPrompting, setIsPrompting] = useState(false);
  const [jobTags, setJobTags] = useState<string[]>(initialData.tags);

  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
  });
  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.patch(`/api/jobs/${jobId}`, values);
      toast.success("Job Tags updated successfully!");
      toggleEditing();
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong.Please try again.");
    }
  };
  const toggleEditing = () => setIsEditing((current) => !current);

//  GENERATING PROMPT FOR GOOGLE AI FOR SHORT DESCRIPTION
    const handlePromptGeneration = async () => {
      try {
        setIsPrompting(true);
        const customPrompt = `Generate an array of top 10 keywords related to the job profession "${prompt}". These keywords should encompass various aspects of the profession, including skills, responsibilities, tools, and technologies commonly associated with it. Aim for a diverse set of keywords that accurately represent the breadth of the profession. Your output should be a list/array of keywords. Just return me the array alone.`;
        await getGenerativeAIResponse(customPrompt).then((data) => {
          if (Array.isArray(JSON.parse(data))) {
            setJobTags((prevTags) => [...prevTags, ...JSON.parse(data)]);
          }
        });

        setIsPrompting(false);
      } catch (error) {
        console.log(error);
        toast.error("Something went wrong.");
        setIsPrompting(false);
      }
    };
    const handleTagRemove = (index: number) => {}



  return (
    <div className="mt-6 border bg-neutral-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Job Tags
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
      {!isEditing && <p className="text-neutral-500"></p>}
      {/* display input while editing */}
      {isEditing && (
        <>
          <div className="flex items-center gap-2 my-2">
            <input
              type="text"
              placeholder="e.g Software Developer"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
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
            Job name is enough to generate the tags
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            {jobTags.length > 0 ? (
              jobTags.map((tag, index) => (
                <div
                  key={index}
                  className="text-xs flex items-center gap-1 whitespace-nowrap py-1 px-2 rounded-md bg-purple-100"
                >
                  {tag}{" "}
                  {isEditing && (
                    <Button
                      variant={"ghost"}
                      className="p-0 h-auto"
                      onClick={() => handleTagRemove(index)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              ))
            ) : (
              <p>No Tags</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};
