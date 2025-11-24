import { auth } from "@clerk/nextjs/server";
import { ArrowLeft, LayoutDashboard, Network } from "lucide-react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { IconBadge } from "@/components/ui/icon-badge";
import { Banner } from "@/components/ui/banner";
import { CompanyName } from "./name-form";
import { CompanyDescriptionForm } from "./description-form";
import { CompanyLogoForm } from "./logo-form";
import { CompanySocialContactsForm } from "./social-contacts";
import { CompanyOverviewForm } from "./company-overview";

const CompanyEditPage = async ({
  params,
}: {
  params: Promise<{ companyId: string }>;
}) => {
  const { companyId } = await params;

  const validObjectIdRegex = /^[a-fA-F0-9]{24}$/;
  if (!validObjectIdRegex.test(companyId)) {
    return redirect("/admin/jobs");
  }

  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }

  const company = await db.company.findUnique({
    where: {
      id: companyId,
      userId,
    },
  });

  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  if (!company) {
    return redirect("/admin/companies");
  }
  const requiredFields = [
    company.name,
    company.description,
    company.logo,
    company.coverImage,
    company.mail,
    company.website,
    company.linkedIn,
    company.address_line_1,
    company.city,
    company.state,
    company.overview,
    company.whyJoinUs,
  ];
  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const completiontext = `(${completedFields}/ ${totalFields} )`;
  const isComplete = requiredFields.every(Boolean);

  return (
    <div className="p-6">
      <Link href="/admin/companies">
        <div className="flex items-center gap-3 text-sm text-neutral-500">
          <ArrowLeft className="w-4 h-4" />
        </div>
        Back
      </Link>
      {/* title */}
      <div className="flex items-center justify-between my-4">
        <div className="flex flex-col gap-y-2">
          <h1 className="text-2xl font-medium">Company Details</h1>
          <span className="text-sm text-neutral-500">
            Complete all Fields {completiontext}
          </span>
        </div>
      </div>

      {/* company details  and container layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
        {/* left part */}
        <div>
          {/* title */}
          <div className="flex items-center gap-x-2">
            <IconBadge icon={LayoutDashboard} />
            <h2 className="tex-xl text-neutral-700">Fill your Job Details</h2>
          </div>
          <CompanyName initialData={company} companyId={company.id} />
          <CompanyDescriptionForm
            initialData={company}
            companyId={company.id}
          />
          {/* logo form */}
            <CompanyLogoForm initialData={company} companyId={company.id} />
            {/* cover image form */}
        </div>
        {/* right part */}
        <div className="space y-6">
          <div className="flex items-center gap-x-2">
            <IconBadge icon = {Network}/>
            <h2 className="text-xl"> Social Contacts</h2>
          </div>
          {/* socials form */}
          <CompanySocialContactsForm initialData={company} companyId={company.id} />
          {/* cover image form */} 
          <CompanyOverviewForm initialData={company} companyId={company.id} />
        </div>
      </div>
    </div>
  );
};
export default CompanyEditPage;
