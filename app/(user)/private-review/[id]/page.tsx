import React from 'react';
import {getReview} from "@/actions/reviews";
import ReviewCard from "@/components/Reviews/ReviewCard";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {Link as NextLink} from "next-view-transitions";
import {ArrowLeft, AlertTriangle, Lock, Eye, Shield, UserCheck} from "lucide-react";
import {Metadata} from "next";

export const metadata: Metadata = {
    title: "Critique Privée - Capybook",
    description: "Accédez à une critique privée sur Capybook, réservée aux utilisateurs autorisés.",
};

interface PrivateReviewPageProps {
    params: {
        id: string;
    };
}

export default async function PrivateReviewPage({params}: PrivateReviewPageProps) {
    const {id} = await params;
    const review = await getReview(id);

    if (!review) {
        return (
            <div
                className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50 to-orange-50 dark:from-slate-950 dark:via-red-950/20 dark:to-orange-950/20">
                <div className="container mx-auto px-4 py-8">
                    <Button asChild variant="outline" size="sm" className="mb-6">
                        <NextLink href="/reviews">
                            <ArrowLeft className="mr-2 size-4"/>
                            Retour aux critiques
                        </NextLink>
                    </Button>

                    <div className="flex min-h-[60vh] flex-col items-center justify-center p-8 text-center">
                        <div className="relative mb-6">
                            <div
                                className="absolute inset-0 rounded-full bg-gradient-to-r from-red-500/20 to-orange-500/20 blur-xl"></div>
                            <div className="relative rounded-full bg-gradient-to-r from-red-500 to-orange-500 p-4">
                                <AlertTriangle className="size-12 text-white"/>
                            </div>
                        </div>

                        <h1 className="mb-3 bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-3xl font-bold text-transparent">
                            Critique introuvable
                        </h1>
                        <p className="text-muted-foreground mb-8 max-w-md text-lg leading-relaxed">
                            Nous n&apos;avons pas pu trouver cette critique. Elle a peut-être été supprimée, ou vous
                            n&apos;avez pas la permission de la voir.
                        </p>

                        <Button asChild size="lg"
                                className="bg-gradient-to-r from-slate-900 to-slate-700 hover:from-slate-800 hover:to-slate-600">
                            <NextLink href="/reviews">
                                <ArrowLeft className="mr-2 size-5"/>
                                Retour aux critiques
                            </NextLink>
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-blue-950/20 dark:to-indigo-950/20">
            <div className="bg-background/80 border-border/50 sticky top-0 z-10 border-b backdrop-blur-md">
                <div className="container mx-auto p-4">
                    <div className="flex items-center justify-between">
                        <Button asChild variant="outline" size="sm">
                            <NextLink href="/reviews">
                                <ArrowLeft className="mr-2 size-4"/>
                                Retour aux critiques
                            </NextLink>
                        </Button>

                        <div className="flex items-center gap-3">
                            <Badge variant="secondary"
                                   className="bg-blue-100 px-3 py-1 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                                <Lock className="mr-1 size-3"/>
                                Privé
                            </Badge>
                            <Badge variant="outline"
                                   className="border-green-200 px-3 py-1 text-green-700 dark:border-green-800 dark:text-green-400">
                                <UserCheck className="mr-1 size-3"/>
                                Accès autorisé
                            </Badge>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto max-w-4xl px-4 py-8">
                <div className="relative mb-8 overflow-hidden">
                    <div
                        className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 blur-xl"></div>
                    <div
                        className="relative rounded-xl border border-blue-200/50 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 dark:border-blue-800/50 dark:from-blue-950/50 dark:to-indigo-950/50">
                        <div className="flex items-start gap-4">
                            <div className="shrink-0">
                                <div className="rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 p-2">
                                    <Shield className="size-5 text-white"/>
                                </div>
                            </div>
                            <div className="flex-1">
                                <h3 className="mb-2 flex items-center gap-2 font-semibold text-blue-900 dark:text-blue-100">
                                    <Lock className="size-4"/>
                                    Critique privée
                                </h3>
                                <p className="text-sm leading-relaxed text-blue-800 dark:text-blue-200">
                                    Cette critique est privée et n&apos;est visible que par les personnes autorisées.
                                    Le contenu affiché ci-dessous est confidentiel.
                                </p>
                            </div>
                            <div className="shrink-0">
                                <Eye className="size-5 text-blue-500"/>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative">
                    <div
                        className="absolute -inset-1 animate-pulse rounded-xl bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 opacity-20 blur"></div>

                    <div
                        className="bg-card/95 relative rounded-xl border-2 border-blue-200/50 shadow-2xl backdrop-blur-sm dark:border-blue-800/50">
                        {/* Header du contenu privé */}
                        <div
                            className="rounded-t-xl border-b border-blue-100 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 p-4 dark:border-blue-900/50 dark:from-blue-950/20 dark:to-indigo-950/20">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="size-2 animate-pulse rounded-full bg-green-500"></div>
                                    <span
                                        className="text-muted-foreground text-sm font-medium">Contenu privé déchiffré</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Lock className="size-4 text-blue-500"/>
                                    <span className="text-muted-foreground text-xs">Sécurisé</span>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 sm:p-8">
                            <ReviewCard review={review}/>
                        </div>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <p className="text-muted-foreground flex items-center justify-center gap-2 text-xs">
                        <Shield className="size-3"/>
                        Cette page est sécurisée et le contenu est protégé
                    </p>
                </div>
            </div>
        </div>
    );
}