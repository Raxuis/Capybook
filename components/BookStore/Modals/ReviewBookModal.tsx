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
import {Star} from "lucide-react";
import {ReviewBookSchema} from "@/utils/zod";
import axios from "axios";
import {mutate} from "swr";
import {useToast} from "@/hooks/use-toast";
import {zodResolver} from "@hookform/resolvers/zod";

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
        }
    }, [book, form]);

    const handleClose = () => {
        setBookToReview(null);
    };

    async function onSubmit(values: z.infer<typeof ReviewBookSchema>) {
        if (values) {
            setIsSubmitting(true);
            console.log(book);
            if (!userId || !book?.id) {
                setIsSubmitting(false);
                return;
            }
            try {
                await axios.post("/api/user/book/review", {
                    userId,
                    bookId: book.id,
                    rating: parseInt(values.rating),
                    feedback: values.feedback
                });
                await mutate(`/api/user/${userId}`);
                toast({
                    title: "Succès",
                    description: "Votre avis a été enregistré avec succès",
                });
            } catch (error) {
                console.error("Erreur lors de l'ajout de la review:", error);
                toast({
                    variant: "destructive",
                    title: "Erreur",
                    description: "Une erreur est survenue lors de l'enregistrement de votre avis",
                });
            }

            setTimeout(() => {
                setIsSubmitting(false);
                handleClose();
            }, 800);
        }
    }

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

    return (
        <Dialog open={!!book} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent className="flex flex-col gap-0 p-0 [&>button:last-child]:top-3.5 max-w-md">
                <DialogHeader className="contents space-y-0 text-left">
                    <DialogTitle className="border-b px-6 py-4 text-base flex justify-between items-center">
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
                        <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
                            <div className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="rating"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel className="text-foreground text-lg leading-none font-semibold">
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
                                                                        className={`h-8 w-8 ${
                                                                            isActive
                                                                                ? "fill-yellow-400 text-yellow-500"
                                                                                : "fill-gray-200 text-gray-300"
                                                                        } transition-colors`}
                                                                    />
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                    {(field.value || hoverRating) ? (
                                                        <div className="text-primary font-medium mt-1">
                                                            {getRatingText(hoverRating ? hoverRating.toString() : field.value)}
                                                        </div>
                                                    ) : (
                                                        <div className="text-gray-500 mt-1">Sélectionnez une note</div>
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
                                {isSubmitting ? "Enregistrement..." : "Enregistrer mon avis"}
                            </Button>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    );
}