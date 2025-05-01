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

    return (
        <nav className="flex items-center justify-center space-x-2">
            {currentPage > 1 && (
                <Link href={`${basePath}?page=${currentPage - 1}`}>
                    <Button variant="outline" size="icon">
                        <ChevronLeft className="h-4 w-4"/>
                        <span className="sr-only">Page précédente</span>
                    </Button>
                </Link>
            )}

            {visiblePages[0] > 1 && (
                <>
                    <Link href={`${basePath}?page=1`}>
                        <Button variant="outline" size="sm">
                            1
                        </Button>
                    </Link>
                    {visiblePages[0] > 2 && <span className="px-2">...</span>}
                </>
            )}

            {visiblePages.map((page) => (
                <Link key={page} href={`${basePath}?page=${page}`}>
                    <Button
                        variant={page === currentPage ? "default" : "outline"}
                        size="sm"
                        className={cn(
                            "min-w-[2.5rem]",
                            page === currentPage && "pointer-events-none"
                        )}
                    >
                        {page}
                    </Button>
                </Link>
            ))}

            {visiblePages[visiblePages.length - 1] < totalPages && (
                <>
                    {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
                        <span className="px-2">...</span>
                    )}
                    <Link href={`${basePath}?page=${totalPages}`}>
                        <Button variant="outline" size="sm">
                            {totalPages}
                        </Button>
                    </Link>
                </>
            )}

            {currentPage < totalPages && (
                <Link href={`${basePath}?page=${currentPage + 1}`}>
                    <Button variant="outline" size="icon">
                        <ChevronRight className="h-4 w-4"/>
                        <span className="sr-only">Page suivante</span>
                    </Button>
                </Link>
            )}
        </nav>
    );
}
