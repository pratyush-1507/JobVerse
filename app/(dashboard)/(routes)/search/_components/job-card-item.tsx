"use client"

import { Company, Job } from "@prisma/client";

interface JobCardItemProps{
    job:Job;
    userId: string | null;
}
import{
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import{motion} from"framer-motion";
import { Box } from "@/components/ui/box";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { BookmarkCheck, Link, Loader, Loader2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";


const JobCardItem = ({job, userId} : JobCardItemProps) =>{

    const typeJob = job as Job & {
        company : Company | null;
    }
    const company = typeJob.company;
    const [isBookmarkLoading, setIsBookmarkLoading] = useState(false);
    const SavedUsersIcon = BookmarkCheck

    return <motion.div layout>
        <Card>
            <div className="w-full h-full p-4 flex flex-col items-start justify-start gap-y-4">
                {/* saved user */}

                
                {/* <Box>
                    <p className="text-sm text-muted-foreground">{formatDistanceToNow(new Date(job.createdAt),{
                        addSuffix:true,
                    })}</p>
                    <Button variant = {"ghost"} size = {"icon"}>
                        {isBookmarkLoading ? <Loader2 className="w-4 h-4 animated-spin"/> : <SavedUsersIcon className={cn("w-4 h-4")}/>}
                    </Button>
                </Box> */}

                {/* company details */}
                <Box className="items-center justify-start gap-x-4">
                    <div className="w-12 h-12 min-w-12 min-h-12 border p-2 rounded-md relative flex items-center justify-center overflow-hidden">
                        {company?.logo &&(
                            <Image alt={company?.name} src = {company?.logo} width={40} height = {40}/>

                        )}
                    </div>
                        <div className="w-full">
                            <p className="text-stone-700 font-semibold text-base w-full truncate"> {job.title}</p>
                            <Link href={`/company/${company?.id}`} className="text-sm text-muted-foreground hover:underline">
                        </div>

                </Box>
            </div>
        </Card>
    </motion.div>
};
export default JobCardItem;