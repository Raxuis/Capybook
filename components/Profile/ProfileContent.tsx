"use client";
import React, {useState} from 'react';
import {useRouter} from "nextjs-toploader/app";
import useSWR from "swr";
import {formatUsername} from "@/utils/format";
import {fetcher} from "@/utils/fetcher";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Book, Star, PenTool, Calendar, Award, User, ChevronRight, Eye, ChartBarIcon} from "lucide-react";

type ProfileData = {
    user: {
        id: string;
        username: string;
        name: string | null;
        image: string | null;
        createdAt: string;
    };
    isOwner: boolean;
    stats?: {
        totalBooksRead: number;
        totalReviews: number;
    };
    badges?: Array<{
        id: string;
        name: string;
        description: string;
        icon: string;
        category: string;
        earnedAt: string;
    }>;
    detailedData?: {
        books: Array<{
            id: string;
            finishedAt: string | null;
            Book: {
                id: string;
                title: string;
                authors: string[];
                numberOfPages: number | null;
            };
        }>;
        reviews: Array<{
            id: string;
            rating: number | null;
            feedback: string | null;
            createdAt: string;
            Book: {
                id: string;
                title: string;
                authors: string[];
            };
        }>;
    };
};

const ProfileContent = ({username}: { username: string }) => {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("overview");
    const usernameParamFormatted = username ? formatUsername(username) : null;

    const {data, error, isLoading} = useSWR<ProfileData>(
        usernameParamFormatted ? `/api/user/profile/${usernameParamFormatted}` : null,
        fetcher,
        {
            revalidateOnFocus: false,
            onError: (err) => {
                console.error('Error fetching profile:', err);
                if (err.status === 404) {
                    router.push('/404');
                }
            }
        }
    );

    // Redirect if username is empty
    React.useEffect(() => {
        if (!username) {
            router.push('/404');
        }
    }, [username, router]);

    // State for "show more" functionality
    const [showAllBooks, setShowAllBooks] = useState(false);
    const [showAllReviews, setShowAllReviews] = useState(false);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg shadow-sm">
                <h3 className="font-semibold">Impossible de charger le profil</h3>
                <p className="text-sm">Veuillez réessayer ultérieurement ou vérifier l'URL.</p>
            </div>
        );
    }

    const {user, isOwner, stats, badges, detailedData} = data;
    const memberSince = new Date(user.createdAt).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long'
    });

    // Group badges by category
    const badgesByCategory = badges?.reduce((acc, badge) => {
        const category = badge.category || 'Other';
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(badge);
        return acc;
    }, {} as Record<string, typeof badges>);

    // Preview items for overview tab
    const previewBooks = detailedData?.books.slice(0, 3) || [];
    const previewReviews = detailedData?.reviews.slice(0, 2) || [];
    const hasMoreBooks = detailedData && detailedData.books.length > 3;
    const hasMoreReviews = detailedData && detailedData.reviews.length > 2;

    // Calculate which books to display based on showAllBooks state
    const displayedBooks = showAllBooks
        ? detailedData?.books || []
        : previewBooks;

    // Calculate which reviews to display based on showAllReviews state
    const displayedReviews = showAllReviews
        ? detailedData?.reviews || []
        : previewReviews;

    return (
        <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
            {/* Header Card */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-20 sm:h-32"></div>
                <div className="relative px-4 sm:px-6 pb-6">
                    <div className="flex flex-col sm:flex-row sm:items-end -mt-12 sm:-mt-16 mb-4">
                        <div className="relative self-center sm:self-auto">
                            {user.image ? (
                                <img
                                    src={user.image}
                                    alt={`${user.username}'s profile`}
                                    className="w-24 h-24 sm:w-28 md:w-32 sm:h-28 md:h-32 rounded-full border-4 border-white shadow-lg object-cover"
                                />
                            ) : (
                                <div
                                    className="w-24 h-24 sm:w-28 md:w-32 sm:h-28 md:h-32 rounded-full border-4 border-white shadow-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                                    <span className="text-3xl font-bold text-white">
                                        {(user.name || user.username)[0].toUpperCase()}
                                    </span>
                                </div>
                            )}
                            {badges && badges.length > 0 && (
                                <div
                                    className="absolute -bottom-2 -right-2 bg-yellow-400 text-xs text-yellow-900 font-semibold rounded-full w-8 h-8 flex items-center justify-center border-2 border-white"
                                    title={`${badges.length} badges obtenus`}>
                                    {badges.length}
                                </div>
                            )}
                        </div>
                        <div className="sm:ml-6 mt-4 sm:mt-0 text-center sm:text-left">
                            <h1 className="text-2xl md:text-3xl font-bold">{user.name || user.username}</h1>
                            <div
                                className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-2 text-gray-600">
                                <span className="flex items-center text-sm">
                                    <User size={16} className="mr-1"/>
                                    @{user.username}
                                </span>
                                <span className="flex items-center text-sm">
                                    <Calendar size={16} className="mr-1"/>
                                    Membre depuis {memberSince}
                                </span>
                            </div>
                        </div>
                        {isOwner && (
                            <div className="ml-auto mt-4 sm:mt-0 text-center sm:text-left">
                                <button
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors shadow-md flex items-center mx-auto sm:mx-0">
                                    <PenTool size={16} className="mr-2"/>
                                    Modifier le profil
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <div className="border-b overflow-x-auto scrollbar-hide">
                        <TabsList className="flex bg-transparent p-0 w-full min-w-max">
                            <TabsTrigger
                                value="overview"
                                className="flex-1 min-w-[100px] py-3 sm:py-4 px-2 sm:px-6 border-b-2 border-transparent data-[state=active]:border-blue-600 rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none whitespace-nowrap text-xs sm:text-sm"
                            >
                                <span className="hidden sm:inline">Vue d'ensemble</span>
                                <span className="sm:hidden">Aperçu</span>
                            </TabsTrigger>
                            <TabsTrigger
                                value="badges"
                                className="flex-1 min-w-[80px] py-3 sm:py-4 px-2 sm:px-6 border-b-2 border-transparent data-[state=active]:border-blue-600 rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none whitespace-nowrap text-xs sm:text-sm"
                            >
                                Badges
                            </TabsTrigger>
                            {isOwner && detailedData && (
                                <>
                                    <TabsTrigger
                                        value="books"
                                        className="flex-1 min-w-[80px] py-3 sm:py-4 px-2 sm:px-6 border-b-2 border-transparent data-[state=active]:border-blue-600 rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none whitespace-nowrap text-xs sm:text-sm"
                                    >
                                        Livres
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="reviews"
                                        className="flex-1 min-w-[80px] py-3 sm:py-4 px-2 sm:px-6 border-b-2 border-transparent data-[state=active]:border-blue-600 rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none whitespace-nowrap text-xs sm:text-sm"
                                    >
                                        Avis
                                    </TabsTrigger>
                                </>
                            )}
                        </TabsList>
                    </div>

                    <TabsContent value="overview" className="p-4 sm:p-6">
                        <div
                            className="flex justify-between items-center mb-4 border-b pb-2">
                            <h2 className="text-lg sm:text-xl font-semibold flex items-center mb-2 sm:mb-0">
                                <span className="bg-blue-100 p-1 rounded-md mr-2 flex-shrink-0">
                                    <ChartBarIcon size={18} className="text-blue-700"/>
                                </span>
                                <span className="truncate">Vos statistiques</span>
                            </h2>
                            <button
                                onClick={() => {
                                    router.push('/book-shelf');
                                }}
                                className="text-xs sm:text-sm bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg transition-colors flex items-center shadow-sm whitespace-nowrap"
                            >
                                <span className="hidden sm:inline">Tableau de bord</span>
                                <span className="sm:hidden">Dashboard</span>
                                <ChevronRight size={14} className="ml-1"/>
                            </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
                            <div
                                className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 sm:p-6 rounded-xl shadow-sm flex items-center">
                                <div className="bg-blue-600 p-3 rounded-lg mr-4">
                                    <Book size={24} className="text-white"/>
                                </div>
                                <div>
                                    <div
                                        className="text-2xl sm:text-3xl font-bold text-blue-900">{stats?.totalBooksRead || 0}</div>
                                    <div className="text-sm text-blue-700">Livres lus</div>
                                </div>
                            </div>
                            <div
                                className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 sm:p-6 rounded-xl shadow-sm flex items-center">
                                <div className="bg-purple-600 p-3 rounded-lg mr-4">
                                    <Star size={24} className="text-white"/>
                                </div>
                                <div>
                                    <div
                                        className="text-2xl sm:text-3xl font-bold text-purple-900">{stats?.totalReviews || 0}</div>
                                    <div className="text-sm text-purple-700">Avis publiés</div>
                                </div>
                            </div>
                            <div
                                className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 sm:p-6 rounded-xl shadow-sm flex items-center">
                                <div className="bg-amber-600 p-3 rounded-lg mr-4">
                                    <Award size={24} className="text-white"/>
                                </div>
                                <div>
                                    <div
                                        className="text-2xl sm:text-3xl font-bold text-amber-900">{badges?.length || 0}</div>
                                    <div className="text-sm text-amber-700">Badges obtenus</div>
                                </div>
                            </div>
                        </div>

                        {/* Badges section in overview */}
                        {badges && badges.length > 0 && (
                            <div className="mb-6">
                                <h2 className="text-lg sm:text-xl font-semibold mb-4 border-b pb-2">Badges récents</h2>
                                <div className="flex flex-wrap gap-3 sm:gap-4">
                                    {badges.slice(0, 4).map(badge => (
                                        <div
                                            key={badge.id}
                                            className="group flex flex-col items-center bg-white border border-gray-200 rounded-lg p-3 sm:p-4 shadow-sm hover:shadow-md transition-all w-20 sm:w-24"
                                            title={badge.description}
                                        >
                                            <div className="text-2xl sm:text-3xl mb-2">{badge.icon || '🏆'}</div>
                                            <div
                                                className="text-xs sm:text-sm font-medium text-center">{badge.name}</div>
                                            <div
                                                className="text-xs text-gray-500 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                {new Date(badge.earnedAt).toLocaleDateString('fr-FR', {
                                                    day: 'numeric',
                                                    month: 'short'
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                    {badges.length > 4 && (
                                        <button
                                            onClick={() => setActiveTab("badges")}
                                            className="flex flex-col items-center justify-center bg-gray-50 border border-gray-200 rounded-lg p-3 sm:p-4 w-20 sm:w-24 hover:bg-gray-100 transition-colors"
                                        >
                                            <span className="text-2xl sm:text-3xl mb-2">+{badges.length - 4}</span>
                                            <span className="text-xs text-gray-500">Voir tous</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Recent books section in overview (only for owner) */}
                        {isOwner && detailedData && detailedData.books.length > 0 && (
                            <div className="mb-6">
                                <div className="flex justify-between items-center mb-4 border-b pb-2">
                                    <h2 className="text-lg sm:text-xl font-semibold">Livres récents</h2>
                                    <button
                                        onClick={() => setActiveTab("books")}
                                        className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                                    >
                                        Voir tous
                                        <ChevronRight size={16}/>
                                    </button>
                                </div>
                                <div className="space-y-4">
                                    {displayedBooks.map(bookData => (
                                        <div key={bookData.id}
                                             className="py-3 flex items-center flex-wrap sm:flex-nowrap">
                                            <div className="bg-blue-100 p-2 sm:p-3 rounded-lg mr-3 sm:mr-4">
                                                <Book size={20} className="text-blue-600"/>
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
                                    {hasMoreBooks && !showAllBooks && (
                                        <button
                                            onClick={() => setShowAllBooks(true)}
                                            className="w-full py-3 text-center text-blue-600 hover:text-blue-800 border-t border-gray-100 flex items-center justify-center"
                                        >
                                            <Eye size={16} className="mr-2"/>
                                            Voir plus de livres
                                        </button>
                                    )}
                                    {showAllBooks && hasMoreBooks && (
                                        <button
                                            onClick={() => {
                                                setShowAllBooks(false);
                                                window.scrollTo({top: 0, behavior: 'smooth'});
                                            }}
                                            className="w-full py-3 text-center text-blue-600 hover:text-blue-800 border-t border-gray-100"
                                        >
                                            Réduire
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Recent reviews section in overview (only for owner) */}
                        {isOwner && detailedData && detailedData.reviews.length > 0 && (
                            <div className="mb-6">
                                <div className="flex justify-between items-center mb-4 border-b pb-2">
                                    <h2 className="text-lg sm:text-xl font-semibold">Avis récents</h2>
                                    <button
                                        onClick={() => setActiveTab("reviews")}
                                        className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                                    >
                                        Voir tous
                                        <ChevronRight size={16}/>
                                    </button>
                                </div>
                                <div className="space-y-4">
                                    {displayedReviews.map(review => (
                                        <div key={review.id} className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                                            <div
                                                className="flex justify-between items-start mb-2 flex-wrap sm:flex-nowrap">
                                                <h3 className="font-semibold mr-2">{review.Book.title}</h3>
                                                <div className="flex items-center mt-1 sm:mt-0">
                                                    {review.rating && Array.from({length: 5}).map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            size={14}
                                                            className="sm:ml-0.5"
                                                            fill={i < (review.rating ?? 0) ? "#FBBF24" : "none"}
                                                            stroke={i < (review.rating ?? 0) ? "#FBBF24" : "#D1D5DB"}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="text-xs sm:text-sm text-gray-600 mb-2">{review.Book.authors.join(", ")}</p>
                                            {review.feedback && (
                                                <p className="text-sm sm:text-base text-gray-700">
                                                    {review.feedback.length > 150
                                                        ? `${review.feedback.substring(0, 150)}...`
                                                        : review.feedback}
                                                </p>
                                            )}
                                            <div className="text-xs text-gray-500 mt-2">
                                                Publié le {new Date(review.createdAt).toLocaleDateString('fr-FR')}
                                            </div>
                                        </div>
                                    ))}
                                    {hasMoreReviews && !showAllReviews && (
                                        <button
                                            onClick={() => setShowAllReviews(true)}
                                            className="w-full py-3 text-center text-blue-600 hover:text-blue-800 border-t border-gray-100 flex items-center justify-center"
                                        >
                                            <Eye size={16} className="mr-2"/>
                                            Voir plus d'avis
                                        </button>
                                    )}
                                    {showAllReviews && hasMoreReviews && (
                                        <button
                                            onClick={() => {
                                                setShowAllReviews(false);
                                                window.scrollTo({top: 0, behavior: 'smooth'});
                                            }}
                                            className="w-full py-3 text-center text-blue-600 hover:text-blue-800 border-t border-gray-100"
                                        >
                                            Réduire
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="badges" className="p-4 sm:p-6">
                        {badges && badges.length > 0 ? (
                            <>
                                {Object.entries(badgesByCategory || {}).map(([category, categoryBadges]) => (
                                    <div key={category} className="mb-8">
                                        <h2 className="text-lg sm:text-xl font-semibold mb-4 border-b pb-2">
                                            {category}
                                            <span className="text-sm text-gray-500 font-normal ml-2">
                                                ({categoryBadges?.length || 0})
                                            </span>
                                        </h2>
                                        <div
                                            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                                            {categoryBadges?.map(badge => (
                                                <div
                                                    key={badge.id}
                                                    className="flex flex-col items-center bg-white border border-gray-200 rounded-lg p-3 sm:p-4 shadow-sm hover:shadow-md transition-all"
                                                >
                                                    <div
                                                        className="text-3xl sm:text-4xl mb-2 sm:mb-3">{badge.icon || '🏆'}</div>
                                                    <div
                                                        className="text-xs sm:text-sm font-medium text-center">{badge.name}</div>
                                                    <div
                                                        className="text-xs text-gray-500 mt-2 text-center line-clamp-2">{badge.description}</div>
                                                    <div className="text-xs text-blue-600 mt-2 sm:mt-3">
                                                        Obtenu le {new Date(badge.earnedAt).toLocaleDateString('fr-FR')}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </>
                        ) : (
                            <div className="text-center py-12">
                                <div className="text-4xl mb-4">🏆</div>
                                <h3 className="text-xl font-semibold">Aucun badge pour le moment</h3>
                                <p className="text-gray-500 mt-2">Continuez à lire et à écrire des avis pour débloquer
                                    des badges.</p>
                            </div>
                        )}
                    </TabsContent>

                    {isOwner && detailedData && (
                        <>
                            <TabsContent value="books" className="p-4 sm:p-6">
                                {detailedData.books.length > 0 ? (
                                    <div className="divide-y">
                                        {detailedData.books.map(bookData => (
                                            <div key={bookData.id}
                                                 className="py-3 sm:py-4 flex items-center flex-wrap sm:flex-nowrap">
                                                <div className="bg-blue-100 p-2 sm:p-3 rounded-lg mr-3 sm:mr-4">
                                                    <Book size={20} className="text-blue-600"/>
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
                                ) : (
                                    <div className="text-center py-12">
                                        <div className="text-4xl mb-4">📚</div>
                                        <h3 className="text-xl font-semibold">Aucun livre pour le moment</h3>
                                        <p className="text-gray-500 mt-2">Commencez à ajouter des livres à votre
                                            bibliothèque.</p>
                                    </div>
                                )}
                            </TabsContent>

                            <TabsContent value="reviews" className="p-4 sm:p-6">
                                {detailedData.reviews.length > 0 ? (
                                    <div className="space-y-4 sm:space-y-6">
                                        {detailedData.reviews.map(review => (
                                            <div key={review.id} className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                                                <div
                                                    className="flex justify-between items-start mb-2 flex-wrap sm:flex-nowrap">
                                                    <h3 className="font-semibold mr-2">{review.Book.title}</h3>
                                                    <div className="flex items-center mt-1 sm:mt-0">
                                                        {review.rating && Array.from({length: 5}).map((_, i) => (
                                                            <Star
                                                                key={i}
                                                                size={16}
                                                                className="sm:ml-0.5"
                                                                fill={i < (review.rating ?? 0) ? "#FBBF24" : "none"}
                                                                stroke={i < (review.rating ?? 0) ? "#FBBF24" : "#D1D5DB"}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                                <p className="text-xs sm:text-sm text-gray-600 mb-3">{review.Book.authors.join(", ")}</p>
                                                {review.feedback && (
                                                    <p className="text-sm sm:text-base text-gray-700">{review.feedback}</p>
                                                )}
                                                <div className="text-xs text-gray-500 mt-3">
                                                    Publié le {new Date(review.createdAt).toLocaleDateString('fr-FR')}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <div className="text-4xl mb-4">✒️</div>
                                        <h3 className="text-xl font-semibold">Aucun avis pour le moment</h3>
                                        <p className="text-gray-500 mt-2">Partagez votre opinion sur les livres que vous
                                            avez lus.</p>
                                    </div>
                                )}
                            </TabsContent>
                        </>
                    )}
                </Tabs>
            </div>
        </div>
    );
};

export default ProfileContent;