import {Badge} from "@/components/ui/badge";
import {Skeleton} from "@/components/ui/skeleton";
import {FileText, Globe} from "lucide-react";
import {formatList} from "@/lib/helpers/format";
import {BookInfoProps} from "@/types/bookModal";

export const BookInfo = ({book, isLoading}: BookInfoProps) => {
    return (
        <div className="space-y-5 md:col-span-2">
            {/* Auteurs */}
            {book.authors && book.authors.length > 0 && (
                <div className="space-y-1.5">
                    <h3 className="text-xs font-medium uppercase tracking-wide text-slate-500">Auteur(s)</h3>
                    <p className="text-sm leading-relaxed text-slate-700">{formatList(book.authors)}</p>
                </div>
            )}

            {/* Nombre de pages */}
            {book.numberOfPages && (
                <div className="space-y-1.5">
                    <h3 className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-slate-500">
                        <FileText className="size-3.5"/>
                        Nombre de page{book.numberOfPages > 1 ? "s" : ""}
                    </h3>
                    <p className="text-sm text-slate-700">{book.numberOfPages} pages</p>
                </div>
            )}

            {/* Genres/Sujets */}
            {isLoading ? (
                <div className="space-y-2">
                    <Skeleton className="h-3 w-24"/>
                    <div className="flex flex-wrap gap-1.5">
                        {[...Array(3)].map((_, i) => (
                            <Skeleton key={i} className="h-5 w-16 rounded-full"/>
                        ))}
                    </div>
                </div>
            ) : book.subjects && book.subjects.length === 0 ? (
                <div className="space-y-1.5">
                    <h3 className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-slate-500">
                        <Globe className="size-3.5"/>
                        Genres
                    </h3>
                    <p className="text-sm text-slate-500">Aucun genre disponible</p>
                </div>
            ) : book.subjects && book.subjects.length > 0 ? (
                <div className="space-y-2">
                    <h3 className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-slate-500">
                        <Globe className="size-3.5"/>
                        Genres
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                        {book.subjects.slice(0, 6).map((subject, idx) => (
                            <Badge
                                key={idx}
                                variant="secondary"
                                className="border border-slate-200/60 bg-slate-50 text-xs font-medium text-slate-700 hover:bg-slate-100"
                            >
                                {subject.length > 15 ? subject.substring(0, 15) + '...' : subject}
                            </Badge>
                        ))}
                    </div>
                </div>
            ) : null}
        </div>
    );
};
