import React, {ReactNode} from 'react';
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import {cn} from "@/lib/utils";

type Props = {
    children: ReactNode;
    tooltipContent: string;
    triggerClassName?: string;
    contentClassName?: string;
    asChild?: boolean;
}

const SimplifiedTooltip = ({children, tooltipContent, triggerClassName, contentClassName, asChild}: Props) => {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger className={triggerClassName} asChild={asChild}>
                    {children}
                </TooltipTrigger>
                <TooltipContent className={cn("text-sm text-destructive-foreground", contentClassName)}>
                    {tooltipContent}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};

export default SimplifiedTooltip;
