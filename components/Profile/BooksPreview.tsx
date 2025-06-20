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
      <div className="flex justify-between items-center mb-4 border-b pb-2">
        <h2 className="text-lg sm:text-xl font-semibold">Livres récents</h2>
        <button
          onClick={onViewAll}
          className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
        >
          Voir tous
          <Eye size={16} />
        </button>
      </div>
      <div className="space-y-4">
        {previewBooks.map(bookData => (
          <div key={bookData.id} className="py-3 flex items-center flex-wrap sm:flex-nowrap">
            <div className="bg-blue-100 p-2 sm:p-3 rounded-lg mr-3 sm:mr-4">
              <BookIcon size={20} className="text-blue-600" />
            </div>
            <div className="flex-grow min-w-0">
              <h3 className="font-semibold truncate">{bookData.Book.title}</h3>
              <p className="text-xs sm:text-sm text-gray-600 truncate">
                {bookData.Book.authors.join(", ")}
                {bookData.Book.numberOfPages && ` · ${bookData.Book.numberOfPages} pages`}
              </p>
            </div>
            <div className="ml-auto mt-2 sm:mt-0 w-full sm:w-auto text-right">
              {bookData.finishedAt ? (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Lu le {new Date(bookData.finishedAt).toLocaleDateString('fr-FR')}
                </span>
              ) : (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  En cours
                </span>
              )}
            </div>
          </div>
        ))}
        {hasMore && (
          <button
            onClick={onViewAll}
            className="w-full py-3 text-center text-blue-600 hover:text-blue-800 border-t border-gray-100 flex items-center justify-center"
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
