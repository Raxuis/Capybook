import React, {memo} from 'react';
import {Book as BookIcon} from "lucide-react";
import {Book} from "@/types/profile";

interface BooksTabProps {
    books: Book[];
}

const BooksTab = memo<BooksTabProps>(({books}) => {
    if (!books.length) {
        return (
            <div className="py-12 text-center">
                <div className="mb-4 text-4xl">📚</div>
                <h3 className="text-xl font-semibold">Aucun livre pour le moment</h3>
                <p className="mt-2 text-gray-500">Commencez à ajouter des livres à votre bibliothèque.</p>
            </div>
        );
    }
    return (
        <div className="divide-y">
            {books.map(bookData => (
                <div key={bookData.id} className="flex flex-wrap items-center py-3 sm:flex-nowrap sm:py-4">
                    <div className="mr-3 rounded-lg bg-blue-100 p-2 sm:mr-4 sm:p-3">
                        <BookIcon size={20} className="text-blue-600"/>
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
                            <span
                                className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                Lu le {new Date(bookData.finishedAt).toLocaleDateString('fr-FR')}
              </span>
                        ) : (
                            <span
                                className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                En cours
              </span>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
});

BooksTab.displayName = 'BooksTab';

export default BooksTab;
