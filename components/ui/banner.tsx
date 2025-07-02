import {cva, type VariantProps} from "class-variance-authority"
import {cn} from "@/lib/utils"
import {AlertTriangle, CheckCircle} from "lucide-react"

const bannerVariants = cva("border tex-center p-4 text-sm flex items-center w-full rounded-md shadow-md",{
    variants: {
    variant: {
        warning: "bg-yellow-100 border-yellow-400 text-yellow-800",
        success: "bg-emerald-100 border-emerald-400 text-emerald-800",
            },
        },

    defaultVariants: {
        variant: "warning",
    },
}
);

const iconMap = {
    warning: AlertTriangle,
    success: CheckCircle,
};

interface BannerProps extends VariantProps<typeof bannerVariants> {
    label:string;
}
export const Banner = ({variant,label}:BannerProps) =>{
    const Icon = iconMap[variant || "warning"];
    return (
        <div className={cn(bannerVariants({variant}))}>
            <Icon className="w-5 h-5 mr-2" />
            {label}
            </div>
            )

}