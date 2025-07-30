import React, { memo, useMemo } from 'react';
import { Book } from "@/types/profile";
import { Book as BookIcon, Eye } from "lucide-react";

interface BooksPreviewProps {
  books: Book[];
  onViewAll: () => void;
}

const BooksPreview = memo<BooksPreviewProps>(({ books, onViewAll }) => {
  const previewBooks = useMemo(() => books.slice(0, 3), [books]);
  const hasMore = books.length > 3;

  return (
    <div className="mb-6">
      <div className="mb-4 flex items-center justify-between border-b pb-2">
        <h2 className="text-lg font-semibold sm:text-xl">Livres récents</h2>
        <button
          onClick={onViewAll}
          className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
        >
          Voir tous
          <Eye size={16} />
        </button>
      </div>
      <div className="space-y-4">
        {previewBooks.map(bookData => (
          <div key={bookData.id} className="flex flex-wrap items-center py-3 sm:flex-nowrap">
            <div className="mr-3 rounded-lg bg-blue-100 p-2 sm:mr-4 sm:p-3">
              <BookIcon size={20} className="text-blue-600" />
            </div>
            <div className="min-w-0 grow">
              <h3 className="truncate font-semibold">{bookData.Book.title}</h3>
              <p className="truncate text-xs text-gray-600 sm:text-sm">
                {bookData.Book.authors.join(", ")}
                {bookData.Book.numberOfPages && ` · ${bookData.Book.numberOfPages} pages`}
              </p>
            </div>
            <div className="ml-auto mt-2 w-full text-right sm:mt-0 sm:w-auto">
              {bookData.finishedAt ? (
                <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                  Lu le {new Date(bookData.finishedAt).toLocaleDateString('fr-FR')}
                </span>
              ) : (
                <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                  En cours
                </span>
              )}
            </div>
          </div>
        ))}
        {hasMore && (
          <button
            onClick={onViewAll}
            className="flex w-full items-center justify-center border-t border-gray-100 py-3 text-center text-blue-600 hover:text-blue-800"
          >
            <Eye size={16} className="mr-2" />
            Voir plus de livres
          </button>
        )}
      </div>
    </div>
  );
});

BooksPreview.displayName = 'BooksPreview';

export default BooksPreview;
