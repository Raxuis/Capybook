"use client";

import {useState} from "react";
import {useRouter} from "next/navigation";
import {useSession} from "next-auth/react";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {AlertTriangle, Trash2, Download, FileText, Loader2} from "lucide-react";
import {useToast} from "@/hooks/use-toast";
import {LoadingState} from "@/components/common/LoadingState";
import Link from "next/link";

export default function DeleteAccountPage() {
    const {data: session, status} = useSession();
    const router = useRouter();
    const {toast} = useToast();
    const [isDeleting, setIsDeleting] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [confirmText, setConfirmText] = useState("");

    const handleExportData = async () => {
        if (!session?.user?.id) return;

        setIsExporting(true);
        try {
            const response = await fetch(`/api/user/${session.user.id}/export`);
            if (!response.ok) {
                throw new Error("Erreur lors de l'export");
            }

            const data = await response.json();
            const blob = new Blob([JSON.stringify(data, null, 2)], {type: "application/json"});
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `capybook-data-${new Date().toISOString().split("T")[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            toast({
                title: "Export réussi",
                description: "Vos données ont été téléchargées",
            });
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Erreur",
                description: "Impossible d'exporter vos données : " + (error instanceof Error ? `: ${error.message}` : ""),
            });
        } finally {
            setIsExporting(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (!session?.user?.id) return;
        if (confirmText !== "SUPPRIMER") {
            toast({
                variant: "destructive",
                title: "Confirmation requise",
                description: "Veuillez taper 'SUPPRIMER' pour confirmer",
            });
            return;
        }

        setIsDeleting(true);
        try {
            const response = await fetch(`/api/user/${session.user.id}/delete`, {
                method: "DELETE",
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Erreur lors de la suppression");
            }

            toast({
                title: "Compte supprimé",
                description: "Votre compte et toutes vos données ont été supprimés",
            });

            // Rediriger vers la page d'accueil après un court délai
            setTimeout(() => {
                router.push("/");
            }, 2000);
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Erreur",
                description: error instanceof Error ? error.message : "Impossible de supprimer le compte",
            });
            setIsDeleting(false);
        }
    };

    // Afficher un état de chargement pendant que la session se charge
    if (status === "loading") {
        return (
            <div className="container mx-auto px-4 py-8 max-w-2xl">
                <LoadingState
                    message="Chargement de la session..."
                    className="min-h-[60vh]"
                />
            </div>
        );
    }

    // Afficher le message d'accès non autorisé si l'utilisateur n'est pas connecté
    if (status === "unauthenticated" || !session) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-2xl">
                <Card>
                    <CardHeader>
                        <CardTitle>Accès non autorisé</CardTitle>
                        <CardDescription>
                            Vous devez être connecté pour accéder à cette page.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild>
                            <Link href="/login">Se connecter</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl relative">
            {/* Overlay de chargement pour la suppression */}
            {isDeleting && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
                    <Card className="max-w-md mx-4">
                        <CardContent className="pt-6">
                            <div className="flex flex-col items-center justify-center space-y-4">
                                <Loader2 className="h-12 w-12 animate-spin text-destructive"/>
                                <div className="text-center">
                                    <h3 className="text-lg font-semibold mb-2">Suppression en cours...</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Veuillez patienter pendant que nous supprimons votre compte et toutes vos
                                        données.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            <h1 className="text-4xl font-bold mb-8">Suppression de compte</h1>

            <Alert className="mb-6">
                <AlertTriangle className="h-4 w-4"/>
                <AlertTitle>Attention</AlertTitle>
                <AlertDescription>
                    La suppression de votre compte est définitive et irréversible. Toutes vos données
                    seront supprimées de manière permanente.
                </AlertDescription>
            </Alert>

            <div className={`space-y-6 ${isDeleting ? "opacity-50 pointer-events-none" : ""}`}>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Download className="h-5 w-5"/>
                            Exporter vos données
                        </CardTitle>
                        <CardDescription>
                            Avant de supprimer votre compte, vous pouvez télécharger toutes vos données
                            au format JSON.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button
                            onClick={handleExportData}
                            disabled={isExporting || isDeleting}
                            variant="outline"
                            className="relative"
                        >
                            {isExporting && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                            )}
                            {isExporting ? "Export en cours..." : "Télécharger mes données"}
                        </Button>
                        <p className="text-sm text-muted-foreground mt-4">
                            Les données exportées incluent : vos informations de profil, vos livres,
                            votre progression, vos notes, vos avis, vos objectifs, vos badges et vos statistiques.
                        </p>
                    </CardContent>
                </Card>

                <Card className={`border-destructive ${isDeleting ? "opacity-50" : ""}`}>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-destructive">
                            <Trash2 className="h-5 w-5"/>
                            Supprimer mon compte
                        </CardTitle>
                        <CardDescription>
                            Cette action supprimera définitivement votre compte et toutes vos données.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="text-sm font-medium mb-2">
                                Données qui seront supprimées :
                            </p>
                            <ul className="text-sm text-muted-foreground list-disc pl-6 space-y-1">
                                <li>Votre profil utilisateur</li>
                                <li>Tous vos livres et votre progression</li>
                                <li>Toutes vos notes et citations</li>
                                <li>Tous vos avis (publics et privés)</li>
                                <li>Tous vos objectifs de lecture</li>
                                <li>Tous vos badges obtenus</li>
                                <li>Vos statistiques de lecture</li>
                                <li>Vos relations de suivi</li>
                                <li>Vos demandes de prêt de livres</li>
                            </ul>
                        </div>

                        <div>
                            <label htmlFor="confirm" className="text-sm font-medium mb-2 block">
                                Pour confirmer, tapez <strong>SUPPRIMER</strong> :
                            </label>
                            <input
                                id="confirm"
                                type="text"
                                value={confirmText}
                                onChange={(e) => setConfirmText(e.target.value)}
                                disabled={isDeleting}
                                className="w-full px-3 py-2 border border-input bg-background rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                                placeholder="SUPPRIMER"
                            />
                        </div>

                        <Button
                            onClick={handleDeleteAccount}
                            disabled={isDeleting || confirmText !== "SUPPRIMER" || isExporting}
                            variant="destructive"
                            className="w-full relative"
                        >
                            {isDeleting && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                            )}
                            {isDeleting ? "Suppression en cours..." : "Supprimer définitivement mon compte"}
                        </Button>

                        <p className="text-xs text-muted-foreground">
                            En supprimant votre compte, vous acceptez que cette action soit irréversible.
                            Certaines données pourront être conservées conformément aux obligations légales
                            (voir notre <Link href="/privacy" className="text-primary underline">Politique de
                            Confidentialité</Link>).
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5"/>
                            Vos droits
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <p className="text-sm">
                            Conformément au RGPD, vous avez le droit de :
                        </p>
                        <ul className="text-sm text-muted-foreground list-disc pl-6 space-y-1">
                            <li>Accéder à vos données personnelles</li>
                            <li>Rectifier vos données</li>
                            <li>Supprimer vos données (droit à l&apos;effacement)</li>
                            <li>Demander la portabilité de vos données</li>
                            <li>Vous opposer au traitement de vos données</li>
                        </ul>
                        <p className="text-sm mt-4">
                            Pour plus d'informations, consultez notre{" "}
                            <Link href="/privacy" className="text-primary underline">
                                Politique de Confidentialité
                            </Link>
                            .
                        </p>
                        <p className="text-sm">
                            Pour toute question, contactez-nous à{" "}
                            <a href="mailto:raxuis@proton.me" className="text-primary underline">
                                raxuis@proton.me
                            </a>
                            .
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
