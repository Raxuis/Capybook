"use client";

import {useState, useEffect} from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import {
    BookOpen,
    Users,
    Star,
    Award,
    Target,
    TrendingUp,
    ArrowUpRight,
    Calendar,
    BadgeCheck,
    BookOpenCheck
} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Bar, BarChart as RechartsBarChart, XAxis, YAxis, Tooltip, ResponsiveContainer} from "recharts";
import {Separator} from "@/components/ui/separator";
import {useToast} from "@/hooks/use-toast";

// Typage pour les données de statistiques
type StatsData = {
    totalUsers: number;
    newUsersThisMonth: number;
    totalBooks: number;
    newBooksThisMonth: number;
    totalReviews: number;
    newReviewsThisMonth: number;
    totalReadingGoals: number;
    completedGoals: number;
    badgesAwarded: number;
    totalReadingDays: number;
    avgPagesPerDay: number;
    monthlyGrowth: {
        name: string;
        users: number;
        books: number;
        reviews: number;
    }[];
    topGenres: {
        name: string;
        count: number;
    }[];
    readingActivity: {
        name: string;
        pages: number;
        minutes: number;
    }[];
};

export default function AdminDashboard() {
    const {toast} = useToast();
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState<StatsData | null>(null);
    const [periodFilter, setPeriodFilter] = useState("month");

    useEffect(() => {
        async function fetchStats() {
            try {
                setIsLoading(true);
                // Simulation d'appel API pour les données de statistique
                // En production, ceci serait un vrai appel API à votre backend
                const response = await fetch(`/api/admin/stats?period=${periodFilter}`);
                if (!response.ok) throw new Error("Erreur lors du chargement des statistiques");

                const data = await response.json();
                setStats(data);
            } catch (error) {
                console.error("Erreur:", error);
                toast({
                    title: "Erreur",
                    description: "Impossible de charger les statistiques",
                    variant: "destructive",
                });

                // Données simulées pour la démonstration
                setStats({
                    totalUsers: 573,
                    newUsersThisMonth: 42,
                    totalBooks: 1890,
                    newBooksThisMonth: 78,
                    totalReviews: 2345,
                    newReviewsThisMonth: 156,
                    totalReadingGoals: 478,
                    completedGoals: 312,
                    badgesAwarded: 1456,
                    totalReadingDays: 12467,
                    avgPagesPerDay: 48,
                    monthlyGrowth: [
                        {name: "Jan", users: 18, books: 45, reviews: 87},
                        {name: "Fév", users: 22, books: 51, reviews: 92},
                        {name: "Mar", users: 19, books: 38, reviews: 76},
                        {name: "Avr", users: 25, books: 49, reviews: 105},
                        {name: "Mai", users: 42, books: 78, reviews: 156},
                    ],
                    topGenres: [
                        {name: "Fiction", count: 486},
                        {name: "Fantasy", count: 342},
                        {name: "Sci-Fi", count: 287},
                        {name: "Thriller", count: 254},
                        {name: "Romance", count: 219},
                    ],
                    readingActivity: [
                        {name: "Lun", pages: 1450, minutes: 3780},
                        {name: "Mar", pages: 1630, minutes: 4120},
                        {name: "Mer", pages: 1280, minutes: 3420},
                        {name: "Jeu", pages: 1540, minutes: 3860},
                        {name: "Ven", pages: 1720, minutes: 4250},
                        {name: "Sam", pages: 2140, minutes: 5320},
                        {name: "Dim", pages: 1980, minutes: 4780},
                    ],
                });
            } finally {
                setIsLoading(false);
            }
        }

        fetchStats();
    }, [periodFilter, toast]);

    if (isLoading || !stats) {
        return (
            <div className="flex h-full w-full items-center justify-center p-8">
                <div className="flex flex-col items-center space-y-4">
                    <div
                        className="h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                    <p className="text-lg font-medium text-muted-foreground">Chargement des statistiques...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Tableau de bord administrateur</h1>
                    <p className="text-muted-foreground">
                        Vue d'ensemble des statistiques et de l'activité de la plateforme.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant={periodFilter === "week" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setPeriodFilter("week")}
                    >
                        Semaine
                    </Button>
                    <Button
                        variant={periodFilter === "month" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setPeriodFilter("month")}
                    >
                        Mois
                    </Button>
                    <Button
                        variant={periodFilter === "year" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setPeriodFilter("year")}
                    >
                        Année
                    </Button>
                </div>
            </div>

            {/* Cartes de statistiques principales */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Utilisateurs</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalUsers}</div>
                        <div className="flex items-center pt-1 text-xs text-muted-foreground">
                            <ArrowUpRight className="mr-1 h-3 w-3 text-primary"/>
                            <span className="text-primary">+{stats.newUsersThisMonth}</span>
                            <span className="ml-1">ce mois-ci</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Livres</CardTitle>
                        <BookOpen className="h-4 w-4 text-muted-foreground"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalBooks}</div>
                        <div className="flex items-center pt-1 text-xs text-muted-foreground">
                            <ArrowUpRight className="mr-1 h-3 w-3 text-secondary"/>
                            <span className="text-secondary">+{stats.newBooksThisMonth}</span>
                            <span className="ml-1">ce mois-ci</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Critiques</CardTitle>
                        <Star className="h-4 w-4 text-muted-foreground"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalReviews}</div>
                        <div className="flex items-center pt-1 text-xs text-muted-foreground">
                            <ArrowUpRight className="mr-1 h-3 w-3 text-accent"/>
                            <span className="text-accent">+{stats.newReviewsThisMonth}</span>
                            <span className="ml-1">ce mois-ci</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Badges décernés</CardTitle>
                        <Award className="h-4 w-4 text-muted-foreground"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.badgesAwarded}</div>
                        <div className="flex items-center pt-1 text-xs text-muted-foreground">
                            <div className="rounded-full bg-muted px-2 py-0.5">
                                {Math.round(stats.badgesAwarded / stats.totalUsers * 100)}% des utilisateurs
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Statistiques secondaires */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className="col-span-2 shadow-sm">
                    <CardHeader>
                        <CardTitle>Croissance mensuelle</CardTitle>
                        <CardDescription>Évolution des inscriptions, livres ajoutés et critiques</CardDescription>
                    </CardHeader>
                    <CardContent className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <RechartsBarChart
                                data={stats.monthlyGrowth}
                                margin={{top: 5, right: 30, left: 20, bottom: 5}}
                            >
                                <XAxis dataKey="name"/>
                                <YAxis/>
                                <Tooltip formatter={(value) => [`${value}`, ""]}/>
                                <Bar dataKey="users" name="Utilisateurs" fill="hsl(var(--primary))"/>
                                <Bar dataKey="books" name="Livres" fill="hsl(var(--secondary))"/>
                                <Bar dataKey="reviews" name="Critiques" fill="hsl(var(--accent))"/>
                            </RechartsBarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle>Top genres</CardTitle>
                        <CardDescription>Les genres les plus populaires</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {stats.topGenres.map((genre, index) => (
                                <div key={index}>
                                    <div className="flex items-center justify-between">
                                        <div className="text-sm font-medium">{genre.name}</div>
                                        <div className="text-sm text-muted-foreground">{genre.count} livres</div>
                                    </div>
                                    <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-muted">
                                        <div
                                            className="h-full bg-primary"
                                            style={{
                                                width: `${(genre.count / stats.topGenres[0].count) * 100}%`,
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Statistiques de lecture et engagements */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle>Objectifs de lecture</CardTitle>
                        <CardDescription>Progression vers les objectifs</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col gap-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Target className="h-6 w-6 text-primary"/>
                                    <div>
                                        <div className="text-lg font-semibold">{stats.totalReadingGoals}</div>
                                        <div className="text-xs text-muted-foreground">Objectifs créés</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <BadgeCheck className="h-6 w-6 text-secondary"/>
                                    <div>
                                        <div className="text-lg font-semibold">{stats.completedGoals}</div>
                                        <div className="text-xs text-muted-foreground">Objectifs atteints</div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-1">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">Taux de complétion</span>
                                    <span className="text-sm font-medium text-primary">
                    {Math.round((stats.completedGoals / stats.totalReadingGoals) * 100)}%
                  </span>
                                </div>
                                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                                    <div
                                        className="h-full bg-primary"
                                        style={{
                                            width: `${(stats.completedGoals / stats.totalReadingGoals) * 100}%`,
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle>Activité de lecture</CardTitle>
                        <CardDescription>Pages lues durant les 7 derniers jours</CardDescription>
                    </CardHeader>
                    <CardContent className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <RechartsBarChart
                                data={stats.readingActivity}
                                margin={{top: 5, right: 10, left: 0, bottom: 5}}
                            >
                                <XAxis dataKey="name"/>
                                <YAxis/>
                                <Tooltip formatter={(value) => [`${value} pages`, ""]}/>
                                <Bar dataKey="pages" name="Pages" fill="hsl(var(--primary))"/>
                            </RechartsBarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle>Statistiques de lecture</CardTitle>
                        <CardDescription>Performances des utilisateurs</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-primary"/>
                                        <span className="text-sm font-medium">Jours de lecture</span>
                                    </div>
                                    <span className="text-sm font-medium">{stats.totalReadingDays}</span>
                                </div>
                                <Separator/>
                            </div>

                            <div className="flex flex-col gap-1">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <BookOpenCheck className="h-4 w-4 text-primary"/>
                                        <span className="text-sm font-medium">Moyenne pages/jour</span>
                                    </div>
                                    <span className="text-sm font-medium">{stats.avgPagesPerDay}</span>
                                </div>
                                <Separator/>
                            </div>

                            <div className="flex flex-col gap-1">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <TrendingUp className="h-4 w-4 text-primary"/>
                                        <span className="text-sm font-medium">Minutes/jour</span>
                                    </div>
                                    <span className="text-sm font-medium">
                    {Math.round(stats.readingActivity.reduce((acc, day) => acc + day.minutes, 0) / 7 / 60)} heures
                  </span>
                                </div>
                                <Separator/>
                            </div>

                            <Button variant="outline" className="w-full">
                                Voir les détails d'activité
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}