import Image from "next/image";
import {BookCoverProps} from "@/types/bookModal";
import {BookCoverPlaceholder} from "@/components/common/BookCoverPlaceholder";

export const BookCover = ({book}: BookCoverProps) => {
    const bookCoverUrl = book.cover
        ? book.cover
        : book.cover_i
            ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
            : null;

    return (
        <div className="relative mx-auto aspect-[2/3] max-h-96 w-full overflow-hidden rounded-lg border border-slate-200 bg-slate-50 sm:max-w-[200px]">
            {bookCoverUrl ? (
                <Image
                    src={bookCoverUrl}
                    alt={book.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 200px"
                    loading="lazy"
                />
            ) : (
                <BookCoverPlaceholder
                    title={book.title}
                    authors={book.authors}
                    variant="default"
                />
            )}
        </div>
    );
};
