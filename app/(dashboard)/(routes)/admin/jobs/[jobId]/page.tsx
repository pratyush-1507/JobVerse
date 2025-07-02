import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { ArrowLeft, Cat, Icon } from "lucide-react";
import { db } from "@/lib/db";
import { Banner } from "@/components/ui/banner";
import { IconBadge } from "@/components/ui/icon-badge";
import { LayoutDashboard } from "lucide-react";
import { JobPublishAction } from "./_components/job-publish-actions";
import { TitleForm } from "./_components/title-form";
import { CategoryForm } from "./_components/category-form";
import { ShortDescription } from "./_components/short-description";
import { ShiftTimingForm } from "./_components/shift-timing-mode";
import { Salary } from "./_components/salary-form";
import { WorkModeForm } from "./_components/work-mode-form";
import { ExperienceForm } from "./_components/work-experience-form";
import { JobDescription } from "./_components/job-description";
const JobDetailsPage = async ({ params }: { params: { jobId: string } }) => {
    
    //verify if jobId is valid with mongoDB
    const validObjectIdRegex = /^[a-fA-F0-9]{24}$/; //0-9 a-f A-F, 24 characters long
    if(!validObjectIdRegex.test(params.jobId)) {
        return redirect("/admin/jobs");
    }
    const {userId} = await auth();
    if(!userId) {
        return redirect("/");
    }
    const job = await db.job.findUnique({
        where: {
            id: params.jobId,
            userId: userId,
        },
    });

    const categories = await db.category.findMany({
        orderBy: {
            name: "asc",
        },
    });

    if(!job) {
        return redirect("/admin/jobs");
    }
    const requiredFields = [
        job.title,
        job.description,
        job.short_description,
        job.categoryId

    ]
    const totalFields = requiredFields.length;
    const completedFields = requiredFields.filter(Boolean).length;
    const completiontext = `(${completedFields}/ ${totalFields} )`;
    const isComplete = requiredFields.every(Boolean);
    return (
      <div className="p-6">
        <Link href="/admin/jobs">
          <div className="flex items-center gap-3 text-sm text-neutral-500">
            <ArrowLeft className="w-4 h-4" />
          </div>
          Back
        </Link>
        {/* title */}
        <div className="flex items-center justify-between my-4">
          <div className="flex flex-col gap-y-2">
            <h1 className="text-2xl font-medium">Job Setup</h1>
            <span className="text-sm text-neutral-500">
              Complete all Fields {completiontext}
            </span>
          </div>
          {/* action */}
          <JobPublishAction
            jobId={job.id}
            isPublished={job.isPublished}
            disabled={!isComplete}
          />
        </div>
        {/* warning before publishing job */}
        {!job.isPublished && (
          <Banner
            variant="warning"
            label="Your job is not published yet. Please complete all fields to publish it."
          />
        )}

        {/* job details  and container layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          {/* left part */}
          <div>
            {/* title */}
            <div className="flex items-center gap-x-2">
              <IconBadge icon={LayoutDashboard} />
              <h2 className="tex-xl text-neutral-700">Fill your Job Details</h2>
            </div>
            {/*title form*/}
            <TitleForm initialData={job} jobId={job.id} />

            {/* category form */}
            <CategoryForm
              initialData={job}
              jobId={job.id}
              options={categories.map((category) => ({
                label: category.name,
                value: category.id,
              }))}
            />
            {/* short description */}
            <ShortDescription initialData={job} jobId={job.id} />

            {/* shift timing*/}
            <ShiftTimingForm initialData={job} jobId={job.id} />
            <WorkModeForm initialData={job} jobId={job.id} />
            <ExperienceForm initialData={job} jobId={job.id} />
          </div>
          {/* right part */}
          <div>
            <div className="h-12"></div>
            {/* job description */}
            <JobDescription initialData={job} jobId={job.id} />
          </div>
        </div>
      </div>
    );
};
export default JobDetailsPage;