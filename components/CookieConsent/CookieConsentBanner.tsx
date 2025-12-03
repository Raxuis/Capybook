"use client";

import {useState, useEffect} from "react";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {X, Cookie, Settings} from "lucide-react";
import Link from "next/link";

const COOKIE_CONSENT_KEY = "capybook-cookie-consent";
const COOKIE_PREFERENCES_KEY = "capybook-cookie-preferences";

export interface CookiePreferences {
    necessary: boolean; // Toujours true, ne peut pas être désactivé
    analytics: boolean; // Sentry
}

export function CookieConsentBanner() {
    const [showBanner, setShowBanner] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [preferences, setPreferences] = useState<CookiePreferences>({
        necessary: true,
        analytics: false,
    });

    useEffect(() => {
        // Vérifier si le consentement a déjà été donné
        const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
        const savedPreferences = localStorage.getItem(COOKIE_PREFERENCES_KEY);

        if (consent === "accepted" || consent === "rejected") {
            // Charger les préférences sauvegardées
            if (savedPreferences) {
                try {
                    const parsed = JSON.parse(savedPreferences);
                    setPreferences(parsed);
                } catch (e) {
                    console.error("Erreur lors du chargement des préférences cookies", e);
                }
            }
            setShowBanner(false);
        } else {
            // Afficher le bandeau si aucun consentement n'a été donné
            setShowBanner(true);
        }
    }, []);

    const savePreferences = (prefs: CookiePreferences) => {
        localStorage.setItem(COOKIE_CONSENT_KEY, "accepted");
        localStorage.setItem(COOKIE_PREFERENCES_KEY, JSON.stringify(prefs));
        setPreferences(prefs);
        setShowBanner(false);
        setShowSettings(false);

        // Appliquer les préférences (par exemple, initialiser Sentry si analytics est accepté)
        if (prefs.analytics) {
            // Sentry est déjà initialisé dans instrumentation-client.ts
            // Ici, on pourrait ajouter une logique pour activer/désactiver Sentry dynamiquement
            console.log("Analytics activé");
        } else {
            console.log("Analytics désactivé");
        }
    };

    const handleAcceptAll = () => {
        savePreferences({
            necessary: true,
            analytics: true,
        });
    };

    const handleRejectAll = () => {
        savePreferences({
            necessary: true,
            analytics: false,
        });
    };

    const handleSavePreferences = () => {
        savePreferences(preferences);
    };

    const handleToggleAnalytics = () => {
        setPreferences((prev) => ({
            ...prev,
            analytics: !prev.analytics,
        }));
    };

    if (!showBanner && !showSettings) {
        // Afficher un bouton pour rouvrir les paramètres
        return (
            <div className="fixed bottom-4 right-4 z-50">
                <Button
                    onClick={() => setShowSettings(true)}
                    variant="outline"
                    size="sm"
                    className="shadow-lg"
                >
                    <Settings className="size-4 mr-2"/>
                    Cookies
                </Button>
            </div>
        );
    }

    if (showSettings) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Cookie className="h-5 w-5"/>
                                <CardTitle>Paramètres des cookies</CardTitle>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setShowSettings(false)}
                            >
                                <X className="h-4 w-4"/>
                            </Button>
                        </div>
                        <CardDescription>
                            Gérez vos préférences de cookies. Vous pouvez activer ou désactiver
                            chaque catégorie de cookies.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Cookies nécessaires */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-semibold">Cookies nécessaires</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Ces cookies sont essentiels au fonctionnement de l&apos;application.
                                        Ils ne peuvent pas être désactivés.
                                    </p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={preferences.necessary}
                                    disabled
                                    className="size-4"
                                />
                            </div>
                            <ul className="text-sm text-muted-foreground list-disc pl-6 space-y-1">
                                <li>Cookies de session (authentification)</li>
                                <li>Cookies de sécurité (protection CSRF)</li>
                            </ul>
                        </div>

                        {/* Cookies d&apos;analyse */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-semibold">Cookies d&apos;analyse et de performance</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Ces cookies nous aident à comprendre comment vous utilisez l&apos;application
                                        et à améliorer ses performances.
                                    </p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={preferences.analytics}
                                    onChange={handleToggleAnalytics}
                                    className="size-4"
                                />
                            </div>
                            <ul className="text-sm text-muted-foreground list-disc pl-6 space-y-1">
                                <li>Sentry : monitoring des erreurs et des performances</li>
                            </ul>
                        </div>

                        <div className="flex gap-2 pt-4">
                            <Button onClick={handleSavePreferences} className="flex-1">
                                Enregistrer les préférences
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => setShowSettings(false)}
                                className="flex-1"
                            >
                                Annuler
                            </Button>
                        </div>

                        <p className="text-xs text-muted-foreground">
                            Pour plus d&apos;informations, consultez notre{" "}
                            <Link href="/cookies" className="text-primary underline">
                                Politique de Cookies
                            </Link>
                            .
                        </p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t shadow-lg p-4">
            <div className="container mx-auto max-w-4xl">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <Cookie className="h-5 w-5"/>
                            <h3 className="font-semibold">Nous utilisons des cookies</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Nous utilisons des cookies pour améliorer votre expérience, analyser les performances
                            et assurer la sécurité de l&apos;application. Vous pouvez accepter tous les cookies ou
                            personnaliser vos préférences.
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                            En continuant, vous acceptez notre{" "}
                            <Link href="/cookies" className="text-primary underline">
                                Politique de Cookies
                            </Link>
                            .
                        </p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                        <Button
                            variant="outline"
                            onClick={() => setShowSettings(true)}
                            size="sm"
                        >
                            Personnaliser
                        </Button>
                        <Button
                            variant="outline"
                            onClick={handleRejectAll}
                            size="sm"
                        >
                            Refuser
                        </Button>
                        <Button
                            onClick={handleAcceptAll}
                            size="sm"
                        >
                            Tout accepter
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
