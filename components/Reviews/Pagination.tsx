import Link from "next/link";
import {ChevronLeft, ChevronRight} from "lucide-react";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";

type PaginationProps = {
    currentPage: number;
    totalPages: number;
    basePath: string;
};

export function Pagination({currentPage, totalPages, basePath}: PaginationProps) {
    const pages = Array.from({length: totalPages}, (_, i) => i + 1);
    const maxVisiblePages = 5;
    let visiblePages = pages;

    if (totalPages > maxVisiblePages) {
        const start = Math.max(1, currentPage - 2);
        const end = Math.min(totalPages, start + maxVisiblePages - 1);
        visiblePages = pages.slice(start - 1, end);
    }

    // Helper function to construct URL with existing query parameters
    const constructUrl = (page: number) => {
        const url = new URL(basePath, window.location.origin);
        url.searchParams.set('page', page.toString());
        return url.pathname + url.search;
    };

    return (
        <nav className="flex items-center justify-center gap-1.5 pt-4">
            {currentPage > 1 && (
                <Link href={constructUrl(currentPage - 1)}>
                    <Button
                        variant="outline"
                        size="icon"
                        className="border-slate-200 hover:bg-slate-50"
                    >
                        <ChevronLeft className="size-4"/>
                        <span className="sr-only">Page précédente</span>
                    </Button>
                </Link>
            )}

            {visiblePages[0] > 1 && (
                <>
                    <Link href={constructUrl(1)}>
                        <Button
                            variant="outline"
                            size="sm"
                            className="border-slate-200 hover:bg-slate-50 min-w-[2.5rem]"
                        >
                            1
                        </Button>
                    </Link>
                    {visiblePages[0] > 2 && (
                        <span className="px-2 text-slate-400">...</span>
                    )}
                </>
            )}

            {visiblePages.map((page) => (
                <Link key={page} href={constructUrl(page)}>
                    <Button
                        variant={page === currentPage ? "default" : "outline"}
                        size="sm"
                        className={cn(
                            "min-w-[2.5rem] border-slate-200",
                            page === currentPage
                                ? "pointer-events-none bg-slate-900 text-white hover:bg-slate-900"
                                : "hover:bg-slate-50"
                        )}
                    >
                        {page}
                    </Button>
                </Link>
            ))}

            {visiblePages[visiblePages.length - 1] < totalPages && (
                <>
                    {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
                        <span className="px-2 text-slate-400">...</span>
                    )}
                    <Link href={constructUrl(totalPages)}>
                        <Button
                            variant="outline"
                            size="sm"
                            className="border-slate-200 hover:bg-slate-50 min-w-[2.5rem]"
                        >
                            {totalPages}
                        </Button>
                    </Link>
                </>
            )}

            {currentPage < totalPages && (
                <Link href={constructUrl(currentPage + 1)}>
                    <Button
                        variant="outline"
                        size="icon"
                        className="border-slate-200 hover:bg-slate-50"
                    >
                        <ChevronRight className="size-4"/>
                        <span className="sr-only">Page suivante</span>
                    </Button>
                </Link>
            )}
        </nav>
    );
}
