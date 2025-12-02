import Image, {type StaticImageData} from "next/image";
import {cn} from "@/lib/utils";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import {Link} from "next-view-transitions";
import {dockRoutes} from "@/constants/dock";

export function Dock() {
    return (
        <div
            className="fixed bottom-5 left-1/2 z-50 w-full max-w-screen-sm -translate-x-1/2 transform-gpu px-4 pt-4"
            style={{
                bottom: `max(1.25rem, env(safe-area-inset-bottom))`,
            }}
        >
            <div className="relative w-full">
                <div
                    className="pointer-events-none absolute inset-x-0 bottom-0 z-10 min-h-[72px] rounded-3xl border border-gray-200/60 bg-gray-200/60 shadow-sm max-sm:min-h-[52px] dark:border-gray-600/60 dark:bg-gray-800/60"/>
                <div
                    className="flex w-full flex-wrap items-end justify-center gap-x-0 overflow-visible rounded-3xl">
                    {
                        dockRoutes.map((route) => (
                            <AppIcon
                                key={route.index}
                                imageSrc={route.imageSrc}
                                tooltip={route.tooltip}
                                link={route.link}
                                withoutBackground={route.withoutBackground}
                            />
                        ))
                    }
                </div>
            </div>
        </div>
    );
}

export default Dock;

function AppIcon({
                     imageSrc,
                     withoutBackground,
                     tooltip,
                     link
                 }: Readonly<{
    imageSrc: string | StaticImageData;
    withoutBackground?: boolean;
    tooltip: string;
    link: string;
}>) {
    return (
        <TooltipProvider>
            <Link href={link}>
                <Tooltip>
                    <TooltipTrigger>
                        <div className="group z-20 grid w-fit cursor-pointer place-items-center p-2 pb-0 max-sm:p-1">
                            <div
                                className={cn(
                                    "pointer-events-none z-20 inline size-14 max-sm:size-10 transform-gpu overflow-hidden rounded-2xl max-sm:rounded-xl bg-white shadow-inner transition-all duration-200 group-hover:size-[4rem] max-sm:group-hover:size-12 group-hover:shadow-sm dark:bg-gray-800",
                                    withoutBackground ? "p-2 max-sm:p-1" : "",
                                )}
                            >
                                <Image
                                    alt="dock"
                                    className={cn(
                                        "size-full",
                                        withoutBackground ? "object-contain" : "object-cover",
                                    )}
                                    height={256}
                                    src={imageSrc}
                                    width={256}
                                />
                            </div>
                        </div>
                    </TooltipTrigger>
                    <TooltipContent
                        className="text-muted-foreground dark:text-muted rounded-lg bg-white p-2 text-sm shadow-lg dark:bg-gray-800">
                        {tooltip}
                    </TooltipContent>
                </Tooltip>
            </Link>
        </TooltipProvider>
    );
}
