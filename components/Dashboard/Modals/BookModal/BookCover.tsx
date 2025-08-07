import {BookOpen} from "lucide-react";
import Image from "next/image";
import {BookCoverProps} from "@/types/bookModal";

export const BookCover = ({book}: BookCoverProps) => {
    return (
        <div
            className="relative mx-auto aspect-[2/3] max-h-96 w-full overflow-hidden rounded-md bg-gray-100 sm:max-w-[200px]">
            {book.cover ? (
                <Image
                    src={book.cover}
                    alt={book.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 200px"
                    loading="lazy"
                />
            ) : (
                <div className="flex size-full items-center justify-center">
                    <BookOpen className="size-16 text-gray-300"/>
                </div>
            )}
        </div>
    );
};