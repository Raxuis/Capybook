import React from 'react';
import {getReview} from "@/actions/reviews";
import ReviewCard from "@/components/Reviews/ReviewCard";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {Link as NextLink} from "next-view-transitions";
import {ArrowLeft, AlertTriangle, Lock, Eye, Shield, UserCheck} from "lucide-react";

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
                            <ArrowLeft className="mr-2 h-4 w-4"/>
                            Retour aux critiques
                        </NextLink>
                    </Button>

                    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
                        <div className="relative mb-6">
                            <div
                                className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-orange-500/20 blur-xl rounded-full"></div>
                            <div className="relative bg-gradient-to-r from-red-500 to-orange-500 p-4 rounded-full">
                                <AlertTriangle className="w-12 h-12 text-white"/>
                            </div>
                        </div>

                        <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                            Critique introuvable
                        </h1>
                        <p className="text-muted-foreground mb-8 max-w-md text-lg leading-relaxed">
                            Nous n&apos;avons pas pu trouver cette critique. Elle a peut-être été supprimée, ou vous
                            n&apos;avez pas la permission de la voir.
                        </p>

                        <Button asChild size="lg"
                                className="bg-gradient-to-r from-slate-900 to-slate-700 hover:from-slate-800 hover:to-slate-600">
                            <NextLink href="/reviews">
                                <ArrowLeft className="mr-2 h-5 w-5"/>
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
            <div className="sticky top-0 z-10 backdrop-blur-md bg-background/80 border-b border-border/50">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <Button asChild variant="outline" size="sm">
                            <NextLink href="/reviews">
                                <ArrowLeft className="mr-2 h-4 w-4"/>
                                Retour aux critiques
                            </NextLink>
                        </Button>

                        <div className="flex items-center gap-3">
                            <Badge variant="secondary"
                                   className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 px-3 py-1">
                                <Lock className="w-3 h-3 mr-1"/>
                                Privé
                            </Badge>
                            <Badge variant="outline"
                                   className="border-green-200 text-green-700 dark:border-green-800 dark:text-green-400 px-3 py-1">
                                <UserCheck className="w-3 h-3 mr-1"/>
                                Accès autorisé
                            </Badge>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto max-w-4xl py-8 px-4">
                <div className="mb-8 relative overflow-hidden">
                    <div
                        className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 blur-xl"></div>
                    <div
                        className="relative bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 border border-blue-200/50 dark:border-blue-800/50 rounded-xl p-6">
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0">
                                <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-2 rounded-lg">
                                    <Shield className="w-5 h-5 text-white"/>
                                </div>
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
                                    <Lock className="w-4 h-4"/>
                                    Critique privée
                                </h3>
                                <p className="text-blue-800 dark:text-blue-200 text-sm leading-relaxed">
                                    Cette critique est privée et n&apos;est visible que par les personnes autorisées.
                                    Le contenu affiché ci-dessous est confidentiel.
                                </p>
                            </div>
                            <div className="flex-shrink-0">
                                <Eye className="w-5 h-5 text-blue-500"/>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative">
                    <div
                        className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-xl blur opacity-20 animate-pulse"></div>

                    <div
                        className="relative bg-card/95 backdrop-blur-sm rounded-xl border-2 border-blue-200/50 dark:border-blue-800/50 shadow-2xl">
                        {/* Header du contenu privé */}
                        <div
                            className="border-b border-blue-100 dark:border-blue-900/50 p-4 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-t-xl">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                    <span
                                        className="text-sm font-medium text-muted-foreground">Contenu privé déchiffré</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Lock className="w-4 h-4 text-blue-500"/>
                                    <span className="text-xs text-muted-foreground">Sécurisé</span>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 sm:p-8">
                            <ReviewCard review={review}/>
                        </div>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <p className="text-xs text-muted-foreground flex items-center justify-center gap-2">
                        <Shield className="w-3 h-3"/>
                        Cette page est sécurisée et le contenu est protégé
                    </p>
                </div>
            </div>
        </div>
    );
}