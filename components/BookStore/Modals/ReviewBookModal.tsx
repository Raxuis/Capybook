import {Button} from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {Textarea} from "@/components/ui/textarea";
import {useReviewModalStore} from "@/store/reviewModalStore";
import {useState, useEffect, useCallback} from "react";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Star, Copy, CheckCircle} from "lucide-react";
import {ReviewBookSchema} from "@/lib/validators";
import axios from "axios";
import {mutate} from "swr";
import {useToast} from "@/hooks/use-toast";
import {zodResolver} from "@hookform/resolvers/zod";
import {useBadgeQueue} from "@/Context/BadgeQueueContext";
import {ReviewPrivacyModal} from "@/components/BookStore/Modals/PrivacySelectionModal";
import {cn} from "@/lib/utils";

export default function ReviewBookModal(
    {userId}: { userId: string | null }
) {
    const {toast} = useToast();
    const {
        bookToReview: book,
        setBookToReview
    } = useReviewModalStore();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [hoverRating, setHoverRating] = useState<number | null>(null);
    const [showPrivacyModal, setShowPrivacyModal] = useState(false);
    const [pendingReviewData, setPendingReviewData] = useState<z.infer<typeof ReviewBookSchema>>({
        rating: "",
        feedback: ""
    });
    const [privateLink, setPrivateLink] = useState<string | null>(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [linkCopied, setLinkCopied] = useState(false);
    const {addBadges} = useBadgeQueue();

    const form = useForm<z.infer<typeof ReviewBookSchema>>({
        resolver: zodResolver(ReviewBookSchema),
        defaultValues: {
            rating: "",
            feedback: "",
        }
    })

    useEffect(() => {
        if (book) {
            form.reset({
                rating: "",
                feedback: "",
            });
            setPrivateLink(null);
            setLinkCopied(false);
        }
    }, [book, form]);

    const handleClose = () => {
        setBookToReview(null);
        setShowSuccessModal(false);
        setPrivateLink(null);
        setLinkCopied(false);
    };

    const handleInitialSubmit = (values: z.infer<typeof ReviewBookSchema>) => {
        setPendingReviewData(values);
        setShowPrivacyModal(true);
    };

    const handlePrivacySubmit = async (privacy: string, specificFriendId?: string) => {
        if (!pendingReviewData || !userId || !book?.key) {
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await axios.post("/api/user/book/review", {
                userId,
                bookKey: book.key,
                rating: parseInt(pendingReviewData.rating),
                feedback: pendingReviewData.feedback,
                privacy,
                specificFriendId
            });

            await mutate(`/api/user/${userId}`);

            if (response.data.badges.newBadgesCount > 0) {
                addBadges(response.data.badges.newBadges);
            }

            // Handle private link
            if (response.data.privateLink) {
                setPrivateLink(response.data.privateLink);
                setShowSuccessModal(true);
            } else {
                toast({
                    title: "Succès",
                    description: "Votre avis a été enregistré avec succès",
                });
                setTimeout(() => {
                    handleClose();
                }, 800);
            }

        } catch (error) {
            console.error("Erreur lors de l'ajout de la review:", error);
            toast({
                variant: "destructive",
                title: "Erreur",
                description: "Une erreur est survenue lors de l'enregistrement de votre avis",
            });
        } finally {
            setIsSubmitting(false);
            setPendingReviewData({
                rating: "",
                feedback: ""
            });
        }
    };

    const copyPrivateLink = async () => {
        if (privateLink) {
            try {
                await navigator.clipboard.writeText(privateLink);
                setLinkCopied(true);

                // Toast avec délai pour éviter les interférences
                setTimeout(() => {
                    toast({
                        title: "Lien copié",
                        description: "Le lien privé a été copié dans le presse-papiers",
                        duration: 2000,
                    });
                }, 100);

                setTimeout(() => setLinkCopied(false), 3000);
            } catch (error) {
                console.error('Failed to copy link:', error);
                toast({
                    variant: "destructive",
                    title: "Erreur",
                    description: "Impossible de copier le lien",
                });
                setLinkCopied(false);
            }
        }
    };

    const getRatingText = useCallback((rating: string | null) => {
        if (!rating) return "";

        const ratingMap: Record<string, string> = {
            "1": "Décevant",
            "2": "Moyen",
            "3": "Bon",
            "4": "Très bon",
            "5": "Excellent"
        };

        return ratingMap[rating] || "";
    }, []);

    // Success Modal for Private Link - Version corrigée
    const SuccessModal = () => (
        <Dialog
            open={showSuccessModal}
            onOpenChange={(open) => {
                // Empêcher la fermeture involontaire de la modal
                if (!open && !linkCopied) {
                    handleClose();
                }
            }}
        >
            <DialogContent className="max-w-md" onInteractOutside={(e) => {
                // Empêcher la fermeture quand on clique sur le toast
                if (linkCopied) {
                    e.preventDefault();
                }
            }}>
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <CheckCircle className="size-5 text-green-500"/>
                        Avis publié avec succès !
                    </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <p className="text-muted-foreground text-sm">
                        Votre avis privé a été créé. Voici le lien à partager :
                    </p>
                    <div className="bg-muted flex items-center gap-2 rounded-md p-3">
                        <input
                            type="text"
                            value={privateLink || ""}
                            readOnly
                            className="flex-1 bg-transparent font-mono text-sm"
                        />
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={copyPrivateLink}
                            className="shrink-0"
                        >
                            {linkCopied ? (
                                <CheckCircle className="size-4 text-green-500"/>
                            ) : (
                                <Copy className="size-4"/>
                            )}
                        </Button>
                    </div>
                    {linkCopied && (
                        <div className="text-xs font-medium text-green-600">
                            ✓ Lien copié dans le presse-papiers
                        </div>
                    )}
                    <p className="text-muted-foreground text-xs">
                        Seules les personnes avec ce lien pourront voir votre avis.
                    </p>
                </div>
                <Button onClick={handleClose} className="w-full">
                    Terminé
                </Button>
            </DialogContent>
        </Dialog>
    );

    return (
        <>
            <Dialog open={!!book && !showSuccessModal} onOpenChange={(open) => !open && handleClose()}>
                <DialogContent className="flex max-w-md flex-col gap-0 p-0 [&>button:last-child]:top-3.5">
                    <DialogHeader className="contents space-y-0 text-left">
                        <DialogTitle className="flex items-center justify-between border-b px-6 py-4 text-base">
                            <div>
                                Vous êtes sur le point de noter :
                                <br/>
                                <span className="text-sm font-medium text-gray-700">
                                    {book?.title}
                                </span>
                                {" "}📖
                            </div>
                        </DialogTitle>
                    </DialogHeader>
                    <div className="px-6 py-4">
                        <Form {...form}>
                            <form className="space-y-5" onSubmit={form.handleSubmit(handleInitialSubmit)}>
                                <div className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="rating"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel
                                                    className="text-foreground text-lg font-semibold leading-none">
                                                    Qu&apos;avez-vous pensé de ce livre ?
                                                </FormLabel>
                                                <FormControl>
                                                    <div className="flex flex-col items-center gap-2">
                                                        <div className="flex items-center justify-center space-x-1">
                                                            {[1, 2, 3, 4, 5].map((value) => {
                                                                const isActive =
                                                                    (
                                                                        hoverRating !== null
                                                                        &&
                                                                        value <= hoverRating
                                                                    )
                                                                    ||
                                                                    (
                                                                        hoverRating === null
                                                                        &&
                                                                        field.value
                                                                        &&
                                                                        value <= parseInt(field.value
                                                                        )
                                                                    );
                                                                return (
                                                                    <button
                                                                        type="button"
                                                                        key={value}
                                                                        onClick={() => field.onChange(value.toString())}
                                                                        onMouseEnter={() => setHoverRating(value)}
                                                                        onMouseLeave={() => setHoverRating(null)}
                                                                        className="p-1 transition-all duration-150"
                                                                    >
                                                                        <Star
                                                                            className={cn("h-8 w-8 transition-colors",
                                                                                isActive
                                                                                    ? "fill-yellow-400 text-yellow-500"
                                                                                    : "fill-gray-200 text-gray-300"
                                                                            )}
                                                                        />
                                                                    </button>
                                                                );
                                                            })}
                                                        </div>
                                                        {(field.value || hoverRating) ? (
                                                            <div className="text-primary mt-1 font-medium">
                                                                {getRatingText(hoverRating ? hoverRating.toString() : field.value)}
                                                            </div>
                                                        ) : (
                                                            <div className="mt-1 text-gray-500">Sélectionnez une
                                                                note</div>
                                                        )}
                                                    </div>
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="feedback"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel htmlFor="feedback">
                                                    Pourquoi avez-vous donné cette note ?
                                                </FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        id="feedback"
                                                        placeholder="Partagez votre expérience avec ce livre..."
                                                        aria-label="Avis sur le livre"
                                                        className="min-h-24 resize-none"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={isSubmitting || !form.formState.isValid}
                                >
                                    {isSubmitting ? "Enregistrement..." : "Continuer"}
                                </Button>
                            </form>
                        </Form>
                    </div>
                </DialogContent>
            </Dialog>

            <ReviewPrivacyModal
                isOpen={showPrivacyModal}
                onClose={() => setShowPrivacyModal(false)}
                onSubmit={handlePrivacySubmit}
                userId={userId || ""}
            />

            <SuccessModal/>
        </>
    );
}
