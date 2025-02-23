import { cn } from "@/lib/utils";
import { Book } from "@/hooks/useBooks";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { FcLikePlaceholder, FcLike } from "react-icons/fc";
import SimplifiedTooltip from "@/components/SimplifiedTooltip";

type BookCardProps = {
  book: Book;
  className?: string;
  toggleLibrary: (book: Book) => void;
  toggleWishlist: (book: Book) => void;
  isInLibrary: boolean;
  isInWishlist: boolean;
};

export default function BookCard({
  book,
  className,
  toggleLibrary,
  toggleWishlist,
  isInLibrary,
  isInWishlist,
}: BookCardProps) {
  return (
    <div
      className={cn(
        "relative flex gap-8 p-8 w-full items-center justify-start rounded-2xl border border-transparent bg-neutral-100 backdrop-blur-[10px] transition duration-150 ease-in-out hover:scale-105 hover:border-neutral-500/20 dark:bg-neutral-800 group",
        className,
      )}
    >
      {book.cover_i && (
        <div className="rounded-sm">
          <img
            src={`https://covers.openlibrary.org/b/id/${book.cover_i}-S.jpg`}
            alt={book.title}
            className="h-full w-full object-cover"
          />
        </div>
      )}
      <div className="flex flex-col gap-2 w-full text-neutral-700 dark:text-neutral-300">
        <div className="flex items-center justify-between">
          <p className="font-bold text-lg w-3/4">{book.title}</p>
          <div className="flex flex-col gap-1 items-end">
            <span className="text-sm text-neutral-400 dark:text-neutral-500">
              {book.first_publish_year}
            </span>
            <div className="flex gap-2 items-center">
              <SimplifiedTooltip tooltipContent={isInLibrary ? "Retirer de la bibliothèque" : "Ajouter à ma bibliothèque"} asChild>
                <button onClick={() => toggleLibrary(book)}>
                  <Plus
                    size={24}
                    className={cn(
                      "duration-200",
                      isInLibrary ? "text-amber-500" : "text-amber-500/50"
                    )}
                  />
                </button>
              </SimplifiedTooltip>
              <SimplifiedTooltip tooltipContent={
                isInWishlist ? "Retirer de la liste de souhaits" : "Ajouter à ma liste de souhaits"
              } asChild>
                <button onClick={() => toggleWishlist(book)}>
                  {isInWishlist ? (
                    <FcLike size={24} className="duration-200" />
                  ) : (
                    <FcLikePlaceholder size={24} className="duration-200" />
                  )}
                </button>
              </SimplifiedTooltip>
            </div>
          </div>
        </div>
        <div className="flex justify-between">
          <div className="flex flex-col gap-1">
            <p className="text-xs">Langues disponibles :</p>
            <div className="flex gap-1">
              {book.language &&
                book.language.map((lang) => (
                  <Badge key={lang} className="text-[10px]">
                    {lang}
                  </Badge>
                ))}
            </div>
          </div>
          <div className="flex flex-col gap-1 items-end">
            <p className="text-xs">Auteur :</p>
            <div className="flex gap-1">
              {book.author_name &&
                book.author_name.map((author) => (
                  <Badge key={author} className="text-[10px]">
                    {author}
                  </Badge>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
