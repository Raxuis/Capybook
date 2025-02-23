'use client';

import React from 'react';
import {useUser} from "@/hooks/useUser";
import DashboardBadge from "@/app/dashboard/DashboardBadge";
import {Book, Star} from "lucide-react";

interface DashboardContentProps {
    userId?: string;
}

export default function DashboardContent({userId}: DashboardContentProps) {
    const {user, isLoading, isError} = useUser(userId);

    if (isLoading) return <div>Chargement...</div>;
    if (isError) return <div>Erreur lors du chargement des données...</div>;
    if (!user) return <div>Utilisateur non trouvé</div>;

    return (
        <div>
            <h1>Bonjour {user.username}</h1>

            <div className="flex gap-4 pt-4">
                <DashboardBadge type="userBook" className="w-1/4">
                    {
                        user.UserBook.length === 0 ? (
                            <>
                                <Book size={12} className="inline-block mr-2"/>
                                <span>Votre bibliothèque est vide</span>
                            </>
                        ) : (
                            <>
                                <Book size={12} className="inline-block mr-2"/>
                                <span>Vous avez {user.UserBook.length} livres dans votre bibliothèque</span>
                            </>
                        )
                    }
                </DashboardBadge>

                <DashboardBadge type="bookReview" className="w-1/4">
                    {
                        user.BookReview.length === 0 ? (
                            <>
                                <Star size={12} className="inline-block mr-2"/>
                                <span>Vous n&#39;avez pas encore écrit d&#39;avis</span>
                            </>
                        ) : (
                            <>
                                <Star size={12} className="inline-block mr-2"/>
                                <span>Vous avez écrit {user.BookReview.length} avis</span>
                            </>
                        )
                    }
                </DashboardBadge>
            </div>

            {
                user.UserBook.length !== 0 && (
                    <div>
                        <h2>Votre bibliothèque</h2>
                        <ul>
                            {user.UserBook.map(userBook => (
                                <li key={userBook.id}>
                                    {userBook.Book.title} - {userBook.Book.author}
                                </li>
                            ))}
                        </ul>
                    </div>
                )
            }

            {
                user.BookReview.length !== 0 && (
                    <div>
                        <h2>Vos avis</h2>
                        <div>
                            {user.BookReview.map(review => (
                                <div key={review.id}>
                                    <h3>{review.Book.title}</h3>
                                    <p>Note: {review.rating}/5</p>
                                    {review.review && <p>{review.review}</p>}
                                </div>
                            ))}
                        </div>
                    </div>
                )
            }
        </div>
    );
}