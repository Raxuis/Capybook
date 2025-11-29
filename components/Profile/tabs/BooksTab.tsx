'use client';

import React, {memo} from 'react';
import {Book as BookIcon} from "lucide-react";
import {Book} from "@/types/profile";
import {motion} from "motion/react";

interface BooksTabProps {
    books: Book[];
}

const BooksTab = memo<BooksTabProps>(({books}) => {
    if (!books.length) {
        return (
            <div className="py-12 text-center">
                <div className="mb-4 text-4xl">📚</div>
                <h3 className="text-xl font-semibold text-foreground">Aucun livre pour le moment</h3>
                <p className="mt-2 text-muted-foreground">Commencez à ajouter des livres à votre bibliothèque.</p>
            </div>
        );
    }
    return (
        <div className="divide-y divide-border">
            {books.map((bookData, index) => (
                <motion.div
                    key={bookData.id}
                    initial={{opacity: 0, x: -20}}
                    animate={{opacity: 1, x: 0}}
                    transition={{duration: 0.3, delay: index * 0.05}}
                    whileHover={{x: 4}}
                    className="flex flex-wrap items-center rounded-lg border border-border bg-card p-3 shadow-sm transition-all hover:shadow-md sm:flex-nowrap sm:py-4 sm:px-4"
                >
                    <div className="mr-3 rounded-lg bg-primary/10 p-2 sm:mr-4 sm:p-3">
                        <BookIcon size={20} className="text-primary"/>
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
                            <span
                                className="inline-flex items-center rounded-full bg-green-500/10 px-2.5 py-0.5 text-xs font-medium text-green-700 dark:text-green-400">
                Lu le {new Date(bookData.finishedAt).toLocaleDateString('fr-FR')}
              </span>
                        ) : (
                            <span
                                className="inline-flex items-center rounded-full bg-yellow-500/10 px-2.5 py-0.5 text-xs font-medium text-yellow-700 dark:text-yellow-400">
                En cours
              </span>
                        )}
                    </div>
                </motion.div>
            ))}
        </div>
    );
});

BooksTab.displayName = 'BooksTab';

export default BooksTab;
