"use client";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
    CardFooter
} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";

const DailyBookCard = ({dailyBook}: { dailyBook: DailyBookData }) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-xl">{dailyBook.title}</CardTitle>
                <CardDescription>
                    Découvrez le livre du jour, soigneusement sélectionné pour enrichir votre expérience de lecture.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Image de couverture */}
                    <div className="flex-shrink-0 self-center lg:self-start">
                        {dailyBook.cover ? (
                            <img
                                src={dailyBook.cover}
                                alt={dailyBook.title}
                                className="w-48 h-64 object-cover rounded-lg shadow-md"
                                onError={(e) => {
                                    // Fallback si l'image ne charge pas
                                    const target = e.target as HTMLImageElement;
                                    target.src = '/placeholder-book.jpg';
                                }}
                            />
                        ) : (
                            <div className="w-48 h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                                <span className="text-gray-500">Pas de couverture</span>
                            </div>
                        )}
                    </div>

                    {/* Détails du livre */}
                    <div className="flex-1 space-y-4">
                        {/* Auteurs */}
                        {dailyBook.authors && dailyBook.authors.length > 0 && (
                            <div>
                                <h3 className="font-semibold text-sm text-muted-foreground mb-2">
                                    {dailyBook.authors.length > 1 ? 'Auteurs' : 'Auteur'}
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {dailyBook.authors.map((author, index) => (
                                        <Badge key={index} variant="secondary">
                                            {author}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Informations supplémentaires */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {dailyBook.numberOfPages && (
                                <div>
                                    <span className="font-semibold text-sm text-muted-foreground">Pages: </span>
                                    <span className="text-sm">{dailyBook.numberOfPages}</span>
                                </div>
                            )}

                            {dailyBook.publishYear && (
                                <div>
                                    <span className="font-semibold text-sm text-muted-foreground">Année: </span>
                                    <span className="text-sm">{dailyBook.publishYear}</span>
                                </div>
                            )}
                        </div>

                        {/* Sujets/Genres */}
                        {dailyBook.subjects && dailyBook.subjects.length > 0 && (
                            <div>
                                <h3 className="font-semibold text-sm text-muted-foreground mb-2">Genres</h3>
                                <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
                                    {dailyBook.subjects.slice(0, 10).map((subject, index) => (
                                        <Badge key={index} variant="outline" className="text-xs">
                                            {subject}
                                        </Badge>
                                    ))}
                                    {dailyBook.subjects.length > 10 && (
                                        <Badge variant="outline" className="text-xs">
                                            +{dailyBook.subjects.length - 10} autres
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-3">
                <p className="text-sm text-muted-foreground text-center">
                    Chaque jour, un nouveau livre vous attend. N&#39;oubliez pas de revenir demain pour découvrir le
                    prochain !
                </p>
                <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                        // Logique pour "Lire maintenant" - à adapter selon vos besoins
                        window.open(`https://openlibrary.org${dailyBook.key}`, '_blank');
                    }}
                >
                    Voir sur Open Library
                </Button>
            </CardFooter>
        </Card>
    );
};

export default DailyBookCard;