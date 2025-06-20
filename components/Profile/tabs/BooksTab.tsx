import React, {memo} from 'react';
import {Book as BookIcon} from "lucide-react";
import {Book} from "@/types/profile";

interface BooksTabProps {
    books: Book[];
}

const BooksTab = memo<BooksTabProps>(({books}) => {
    if (!books.length) {
        return (
            <div className="text-center py-12">
                <div className="text-4xl mb-4">📚</div>
                <h3 className="text-xl font-semibold">Aucun livre pour le moment</h3>
                <p className="text-gray-500 mt-2">Commencez à ajouter des livres à votre bibliothèque.</p>
            </div>
        );
    }
    return (
        <div className="divide-y">
            {books.map(bookData => (
                <div key={bookData.id} className="py-3 sm:py-4 flex items-center flex-wrap sm:flex-nowrap">
                    <div className="bg-blue-100 p-2 sm:p-3 rounded-lg mr-3 sm:mr-4">
                        <BookIcon size={20} className="text-blue-600"/>
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
                            <span
                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Lu le {new Date(bookData.finishedAt).toLocaleDateString('fr-FR')}
              </span>
                        ) : (
                            <span
                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
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
