"use client";
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Lightbulb, Loader2, Pencil, Copy } from "lucide-react";
import { TiptapEditor } from "@/components/ui/editor";
import getGenerativeAIResponse from "@/scripts/aistudio";
import { Company } from "@prisma/client";

interface CompanyOverviewFormProps {
  initialData: Company;
  companyId: string;
}

const formSchema = z.object({
  overview: z.string().min(1),
});

export const CompanyOverviewForm = ({ initialData, companyId }: CompanyOverviewFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [rolename, setRolename] = useState("");
  const [skills, setSkills] = useState("");
  const [isPrompting, setIsPrompting] = useState(false);
  const [aiValue, setAiValue] = useState("");

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      overview: initialData?.overview || "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const toggleEditing = () => setIsEditing((prev) => !prev);

  const handlePromptGeneration = async () => {
    try {
      setIsPrompting(true);
      const prompt = `Generate a detailed and engaging company overview for ${rolename} to be put on  job portal (under 1000 words) based on the following details,
      also generate some content for "Why Join Us" section discussing about perks in company, the work culture in company and the opportunities for growth, what employee can expect from the company. Try to make it company specific by looking at the company details.
Use valid HTML with the following rules:

- DO NOT include "html" or markdown formatting.
- DO NOT use '#' or '**' or any markdown syntax.
- Wrap all section titles like "Responsibilities" in <strong> tags.
- Use <p> for paragraphs.
- Use <ul><li> for responsibilities, skills, perks, etc.
- Ensure clear separation between sections using <p> tags.
- Output only raw HTML (no comments or explanations).`;



      const data = await getGenerativeAIResponse(prompt);
      const cleaned = data
        .replace(/^```html|```$/g, "") // Remove markdown code blocks
        .replace(/^'|'$/g, "") // Remove leading/trailing single quotes
        .replace(/[\*\#]/g, "") // Remove stray markdown symbols
        .trim();


      setAiValue(cleaned);

      // Set it to form editor as well
      form.setValue("overview", cleaned, {
        shouldValidate: true,
        shouldDirty: true,
      });

      setIsPrompting(false);
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong.");
      setIsPrompting(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(aiValue);
    toast.success("Copied to clipboard");
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/companies/${companyId}`, values);
      toast.success("Updated successfully!");
      toggleEditing();
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="mt-6 border bg-neutral-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
       Company Overview
        <Button onClick={toggleEditing} variant="ghost">
          {isEditing ? (
            "Cancel"
          ) : (
            <>
              <Pencil className="w-4 h-4 mr-2" />
              Edit
            </>
          )}
        </Button>
      </div>

      {!isEditing && (
        <div
          className="text-neutral-500 prose mt-2"
          dangerouslySetInnerHTML={{ __html: initialData?.overview || "" }}
        />
      )}

      {isEditing && (
        <>
          {/* Prompt Inputs */}
          <div className="flex items-center gap-2 my-3">
            <input 
              type="text"
              placeholder="Enter Company Name for AI to generate overview else type manually"
              value={rolename}
              onChange={(e) => setRolename(e.target.value)}
              className="w-full p-2 rounded-md"
            />
            <Button onClick={handlePromptGeneration} disabled={isPrompting}>
              {isPrompting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Lightbulb className="w-4 h-4" />
              )}
            </Button>
          </div>

          {/* AI Preview
          {aiValue && (
            <div className="w-full h-96 overflow-y-scroll rounded-md bg-white p-4 relative prose mt-4 border">
              <div dangerouslySetInnerHTML={{ __html: aiValue }} />
              <Button
                onClick={handleCopy}
                className="absolute top-3 right-3 z-10"
                variant="outline"
                size="icon"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          )} */}

          {/* Editor */}
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 mt-4"
            >
              <FormField
                control={form.control}
                name="overview"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <TiptapEditor
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-center gap-x-2">
                <Button type="submit" disabled={!isValid || isSubmitting}>
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
