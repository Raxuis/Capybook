'use client';

import {useUser} from "@/hooks/useUser";
import DashboardBadge from "@/components/Dashboard/DashboardBadge";
import {Book, Star} from "lucide-react";

interface DashboardContentProps {
    userId?: string;
}

export default function DashboardContent({userId}: DashboardContentProps) {
    const {user, isError, isValidating, isLoading} = useUser(userId);
    if (isLoading || isValidating) return <div>Chargement...</div>;
    if (isError) return <div>Erreur lors du chargement des données...</div>;
    if (!user) return <div>No user</div>;


    return (
        <div>
            <h1>Bonjour {user.username}</h1>

            <div className="flex gap-4 pt-4">
                <DashboardBadge type="userBook" className="flex justify-center items-center">
                    {
                        user.UserBook.length === 0 ? (
                            <>
                                <Book size={12} className="inline-block mr-2"/>
                                <span>Votre bibliothèque est vide</span>
                            </>
                        ) : (
                            <>
                                <Book size={12} className="inline-block mr-2"/>
                                <span>Vous avez {user.UserBook.length} livre{user.UserBook.length !== 1 && (
                                    <span>
                    s
                  </span>
                                )} dans votre bibliothèque</span>
                            </>
                        )
                    }
                </DashboardBadge>

                <DashboardBadge type="bookReview" className="flex justify-center items-center">
                    {
                        user.BookReview.length === 0 ? (
                            <>
                                <Star size={12} className="inline-block mr-2"/>
                                <span>Vous n&#39;avez pas encore écrit d&#39;avis</span>
                            </>
                        ) : (
                            <>
                                <Star size={12} className="inline-block mr-2"/>
                                <span>Vous avez écrit {user.BookReview.length} avi {user.BookReview.length !== 1 && (
                                    <span>
                    s
                  </span>
                                )}</span>
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
                                    {userBook.Book.title}
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
