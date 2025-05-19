"use client";

import {useState} from "react";
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
import {AdminDashboardStats, StatsPeriod} from "@/types/admin";
import {getAll} from "@/actions/admin/stats";

export default function AdminDashboard({initialStats}: { initialStats: AdminDashboardStats }) {
    const {toast} = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [stats, setStats] = useState<AdminDashboardStats>(initialStats);
    const [periodFilter, setPeriodFilter] = useState<StatsPeriod>("month");

    // Fonction pour changer la période et récupérer les nouvelles statistiques
    async function handlePeriodChange(newPeriod: StatsPeriod) {
        if (newPeriod === periodFilter) return;

        try {
            setIsLoading(true);
            setPeriodFilter(newPeriod);

            // Appeler le server action
            const newStats = await getAll(newPeriod);

            if (newStats) {
                setStats(newStats);
            } else {
                toast({
                    title: "Erreur",
                    description: "Impossible de charger les statistiques",
                    variant: "destructive",
                });
            }
        } catch (error) {
            console.error("Erreur:", error);
            toast({
                title: "Erreur",
                description: "Impossible de charger les statistiques",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    }

    if (isLoading) {
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
                        Vue d&#39;ensemble des statistiques et de l&#39;activité de la plateforme.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant={periodFilter === "week" ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePeriodChange("week")}
                    >
                        Semaine
                    </Button>
                    <Button
                        variant={periodFilter === "month" ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePeriodChange("month")}
                    >
                        Mois
                    </Button>
                    <Button
                        variant={periodFilter === "year" ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePeriodChange("year")}
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
                        <div className="text-2xl font-bold">{stats.overview.totalUsers}</div>
                        <div className="flex items-center pt-1 text-xs text-muted-foreground">
                            <ArrowUpRight className="mr-1 h-3 w-3 text-primary"/>
                            <span className="text-primary">+{stats.overview.newUsersInPeriod}</span>
                            <span className="ml-1">cette période</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Livres</CardTitle>
                        <BookOpen className="h-4 w-4 text-muted-foreground"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.overview.totalBooks}</div>
                        <div className="flex items-center pt-1 text-xs text-muted-foreground">
                            <ArrowUpRight className="mr-1 h-3 w-3 text-secondary"/>
                            <span className="text-secondary">+{stats.overview.newBooksInPeriod}</span>
                            <span className="ml-1">cette période</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Critiques</CardTitle>
                        <Star className="h-4 w-4 text-muted-foreground"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.overview.totalReviews}</div>
                        <div className="flex items-center pt-1 text-xs text-muted-foreground">
                            <ArrowUpRight className="mr-1 h-3 w-3 text-accent"/>
                            <span className="text-accent">+{stats.overview.newReviewsInPeriod}</span>
                            <span className="ml-1">cette période</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Badges décernés</CardTitle>
                        <Award className="h-4 w-4 text-muted-foreground"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.overview.badgesAwarded}</div>
                        <div className="flex items-center pt-1 text-xs text-muted-foreground">
                            <div className="rounded-full bg-muted px-2 py-0.5">
                                {Math.round(stats.overview.badgesAwarded / stats.overview.totalUsers * 100)}% des
                                utilisateurs
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
                                <Tooltip
                                    formatter={(value, name) => {
                                        const labels = {
                                            users: "Utilisateurs",
                                            books: "Livres",
                                            reviews: "Critiques"
                                        };
                                        return [value, labels[name as keyof typeof labels] || name];
                                    }}
                                />
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
                                        <div className="text-lg font-semibold">{stats.overview.totalReadingGoals}</div>
                                        <div className="text-xs text-muted-foreground">Objectifs créés</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <BadgeCheck className="h-6 w-6 text-secondary"/>
                                    <div>
                                        <div className="text-lg font-semibold">{stats.overview.completedGoals}</div>
                                        <div className="text-xs text-muted-foreground">Objectifs atteints</div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-1">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">Taux de complétion</span>
                                    <span className="text-sm font-medium text-primary">
                    {Math.round((stats.overview.completedGoals / stats.overview.totalReadingGoals) * 100)}%
                  </span>
                                </div>
                                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                                    <div
                                        className="h-full bg-primary"
                                        style={{
                                            width: `${(stats.overview.completedGoals / stats.overview.totalReadingGoals) * 100}%`,
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
                                <Tooltip
                                    formatter={(value, name) => {
                                        return [
                                            `${value} pages`,
                                            name === "pages" ? "Pages lues" : name
                                        ];
                                    }}
                                />
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
                                    <span className="text-sm font-medium">{stats.overview.totalReadingDays}</span>
                                </div>
                                <Separator/>
                            </div>

                            <div className="flex flex-col gap-1">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <BookOpenCheck className="h-4 w-4 text-primary"/>
                                        <span className="text-sm font-medium">Moyenne pages/jour</span>
                                    </div>
                                    <span className="text-sm font-medium">{stats.overview.avgPagesPerDay}</span>
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
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}