import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { DataTable } from "@/components/ui/datatable";
import { columns, JobsColumns } from "./_components/columns";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import {format} from "date-fns";

const JobsPageOverview = async () => {

    const {userId} = await auth();
    if(!userId) {
        return redirect("/");
    }
    const jobs = await db.job.findMany({
        where:{
            userId
        },
        include:{
            category : true,
            company: true,
            
        },
        orderBy: {
            createdAt: "desc"
        },
    });
    const formattedJobs : JobsColumns[] = jobs.map((job) => ({
        id: job.id,
        title: job.title,
        company: job.company ? job.company.name : "No Company",
        category: job.category? job.category.name : "Uncategorized",
        createdAt: job.createdAt ? format(job.createdAt, "MMMM do, yyyy") : "",
        isPublished: job.isPublished,
    }));

    return(<div className="p-6">
        <div className="flex items-end justify-end">
            <Link href = {"/admin/create"}>
            <Button><Plus className="w-5 h-5 mr-1"/>Add New</Button>
            </Link>
        </div>
        {/* datatable for job displaying */}
        <div className="mt-6">
            <DataTable columns={columns} data={formattedJobs} searchKey="title" />
        </div>
        
    </div>);
}
export default JobsPageOverview;