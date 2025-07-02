import {cva, type VariantProps} from "class-variance-authority";
import {cn} from "@/lib/utils";
import {LucideIcon} from "lucide-react";

const backgroundVariant = cva("rounded-full flex items-center justify-center",
    {    
    variants: {
        variant:{
            default: "bg-purple-100",
            success: "bg-emrald-100",
        },
        size: {
            default: "p-2",
            sm: "p-1",
        },
    },
    defaultVariants: {
        variant: "default",
        size: "default",
    },
    
});

const iconVariant = cva("",{
    variants: {
        variant:{
            default: "text-purple-500",
            success: "text-emerald-500",
        },
        size: {
            default: "w-8 h-8",
            sm: "w-4 h-4",
        },
    },
    defaultVariants: {
        variant: "default",
        size: "default",
    },
});
type BackgroundVariantProps = VariantProps<typeof backgroundVariant>;
type IconVariantProps = VariantProps<typeof iconVariant>;
interface IconBadgeProps extends BackgroundVariantProps, IconVariantProps {
    icon: LucideIcon;
}

export const IconBadge = ({icon:Icon,variant,size}:IconBadgeProps) => {
  return (
    <div className={cn(backgroundVariant({variant,size}))}>
        <Icon className={cn(iconVariant({variant,size}))} />
    </div>
  )
}
