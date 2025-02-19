import Image, {type StaticImageData} from "next/image";
import {cn} from "@/lib/utils";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import Link from "next/link";

export function Dock() {
    return (
        <div className="-translate-x-1/2 fixed bottom-5 left-1/2 mx-auto max-w-full transform-gpu pt-4">
            <div className="relative">
                <div
                    className="pointer-events-none absolute right-0 bottom-0 left-0 z-10 h-[72px] max-w-full rounded-3xl border border-gray-200/60 bg-gray-200/60 shadow-sm dark:border-gray-600/60 dark:bg-gray-800/60"/>
                <div className="flex items-end overflow-x-auto rounded-3xl pl-2">
                    <AppIcon imgSrc={"/home.png"}
                             withoutBackground={true}
                             tooltip="Home"
                             link="/"
                    />
                    <AppIcon imgSrc={"/progress.png"}
                             withoutBackground={true}
                             tooltip="Your Reading Progress"
                             link="/progress"
                    />
                    <AppIcon
                        imgSrc={"/list.png"}
                        tooltip="The Book Shelf"
                        link="/book-shelf"
                    />
                </div>
            </div>
        </div>
    );
}

export default Dock;

function AppIcon({
                     imgSrc,
                     withoutBackground,
                     tooltip,
                     link
                 }: Readonly<{
    imgSrc: string | StaticImageData;
    withoutBackground?: boolean;
    tooltip: string;
    link: string;
}>) {
    return (
        <TooltipProvider>
            <Link href={link}>
                <Tooltip>
                    <TooltipTrigger>
                        <div className="group z-20 grid w-fit cursor-pointer place-items-center p-2 pl-0">
                            <div
                                className={cn(
                                    "pointer-events-none z-20 inline size-14 transform-gpu overflow-hidden rounded-2xl bg-white shadow-inner transition-all duration-200 group-hover:size-[4rem] group-hover:shadow-sm dark:bg-gray-800",
                                    withoutBackground ? "p-2" : "",
                                )}
                            >
                                <Image
                                    alt="dock"
                                    className={cn(
                                        "size-full",
                                        withoutBackground ? "object-contain" : "object-cover",
                                    )}
                                    height={256}
                                    src={imgSrc}
                                    width={256}
                                />
                            </div>
                        </div>
                    </TooltipTrigger>
                    <TooltipContent
                        className="text-muted-foreground dark:text-muted p-2 rounded-lg shadow-lg bg-white dark:bg-gray-800 text-sm font-inter">
                        {tooltip}
                    </TooltipContent>
                </Tooltip>
            </Link>
        </TooltipProvider>
    );
}
