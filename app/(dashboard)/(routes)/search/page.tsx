import { getJobs } from "@/actions/get-jobs";
import { SearchContainer } from "@/components/search-container";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

interface SearchProps {
    searchParams: {
        title : string;
        categoryId: string;
        createdAtFilter: string;
        shiftTiming: string;
        workMode: string;
        yearsOfExperience: string;

    }
}

const SearchPage = async ({searchParams}: SearchProps) => {

    const categories = await db.category.findMany({
        orderBy:{
            name: "asc"
        },
    });
    const {userId} = await auth();
    const jobs = await getJobs({...searchParams});


    return (
        <>
        <div className="px-6 pt-6 block md:hidden md:mb-0">
            <SearchContainer/>
        </div>
        <div className="p-6">
            {/* categories */}
            {/* applied filter */}
            {/* page content */}
        </div>

        </>
    )
};
export default SearchPage;