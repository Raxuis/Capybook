import {Badge} from "@/components/ui/badge";
import {Skeleton} from "@/components/ui/skeleton";
import {FileText, Globe} from "lucide-react";
import {formatList} from "@/utils/format";
import {BookInfoProps} from "@/types/bookModal";

export const BookInfo = ({book, isLoading}: BookInfoProps) => {
    return (
        <div className="space-y-4 md:col-span-2">
            {/* Auteurs */}
            {book.authors && book.authors.length > 0 && (
                <div>
                    <h3 className="mb-1 text-sm font-medium text-gray-500">Auteur(s)</h3>
                    <p className="flex-wrap break-words">{formatList(book.authors)}</p>
                </div>
            )}

            {/* Nombre de pages */}
            {book.numberOfPages && (
                <div>
                    <h3 className="mb-1 flex items-center text-sm font-medium text-gray-500">
                        <FileText className="mr-1 size-4"/>
                        Nombre de page <span>{book.numberOfPages > 1 && "s"}</span>
                    </h3>
                    <p>{book.numberOfPages} pages</p>
                </div>
            )}

            {/* Genres/Sujets */}
            {isLoading ? (
                <Skeleton className="mb-1 h-4 w-full"/>
            ) : book.subjects && book.subjects.length === 0 ? (
                <p className="text-sm text-gray-500">Aucun genre disponible</p>
            ) : book.subjects && book.subjects.length > 0 ? (
                <div>
                    <h3 className="mb-1 flex items-center text-sm font-medium text-gray-500">
                        <Globe className="mr-1 size-4"/>
                        Genres(s)
                    </h3>
                    <div className="mt-1 flex w-full flex-wrap gap-1">
                        {book.subjects.slice(0, 5).map((subject, idx) => (
                            <Badge
                                key={idx}
                                variant="secondary"
                                className="max-w-24 truncate text-xs"
                            >
                                {subject.length > 10 ? subject.substring(0, 10) + '...' : subject}
                            </Badge>
                        ))}
                    </div>
                </div>
            ) : null}
        </div>
    );
};