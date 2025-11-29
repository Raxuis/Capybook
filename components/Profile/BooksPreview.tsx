'use client';

import React, { memo, useMemo } from 'react';
import { Book } from "@/types/profile";
import { Book as BookIcon, Eye } from "lucide-react";
import {motion} from "motion/react";

interface BooksPreviewProps {
  books: Book[];
  onViewAll: () => void;
}

const BooksPreview = memo<BooksPreviewProps>(({ books, onViewAll }) => {
  const previewBooks = useMemo(() => books.slice(0, 3), [books]);
  const hasMore = books.length > 3;

  return (
    <div className="mb-6">
      <div className="mb-4 flex items-center justify-between border-b border-border pb-2">
        <h2 className="text-lg font-semibold text-foreground sm:text-xl">Livres récents</h2>
        <button
          onClick={onViewAll}
          className="flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors"
        >
          Voir tous
          <Eye size={16} />
        </button>
      </div>
      <div className="space-y-4">
        {previewBooks.map((bookData, index) => (
          <motion.div
            key={bookData.id}
            initial={{opacity: 0, x: -20}}
            animate={{opacity: 1, x: 0}}
            transition={{duration: 0.3, delay: index * 0.1}}
            whileHover={{x: 4}}
            className="flex flex-wrap items-center rounded-lg border border-border bg-card p-3 shadow-sm transition-all hover:shadow-md sm:flex-nowrap sm:p-4"
          >
            <div className="mr-3 rounded-lg bg-primary/10 p-2 sm:mr-4 sm:p-3">
              <BookIcon size={20} className="text-primary" />
            </div>
            <div className="min-w-0 grow">
              <h3 className="truncate font-semibold text-foreground">{bookData.Book.title}</h3>
              <p className="truncate text-xs text-muted-foreground sm:text-sm">
                {bookData.Book.authors.join(", ")}
                {bookData.Book.numberOfPages && ` · ${bookData.Book.numberOfPages} pages`}
              </p>
            </div>
            <div className="ml-auto mt-2 w-full text-right sm:mt-0 sm:w-auto">
              {bookData.finishedAt ? (
                <span className="inline-flex items-center rounded-full bg-green-500/10 px-2.5 py-0.5 text-xs font-medium text-green-700 dark:text-green-400">
                  Lu le {new Date(bookData.finishedAt).toLocaleDateString('fr-FR')}
                </span>
              ) : (
                <span className="inline-flex items-center rounded-full bg-yellow-500/10 px-2.5 py-0.5 text-xs font-medium text-yellow-700 dark:text-yellow-400">
                  En cours
                </span>
              )}
            </div>
          </motion.div>
        ))}
        {hasMore && (
          <motion.button
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            transition={{duration: 0.3, delay: previewBooks.length * 0.1}}
            whileHover={{scale: 1.02}}
            onClick={onViewAll}
            className="flex w-full items-center justify-center border-t border-border bg-muted/30 py-3 text-center text-primary transition-colors hover:bg-muted/50"
          >
            <Eye size={16} className="mr-2" />
            Voir plus de livres
          </motion.button>
        )}
      </div>
    </div>
  );
});

BooksPreview.displayName = 'BooksPreview';

export default BooksPreview;
