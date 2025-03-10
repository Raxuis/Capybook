import {Button} from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {Label} from "@/components/ui/label";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import {Textarea} from "@/components/ui/textarea";
import {useReviewModalStore} from "@/store/reviewModalStore";
import {useState, useEffect} from "react";

export default function ReviewBookModal() {
    const {bookToReview: book, setBookToReview} = useReviewModalStore();
    const [rating, setRating] = useState("");
    const [feedback, setFeedback] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (book) {
            setRating("");
            setFeedback("");
        }
    }, [book]);

    const handleClose = () => {
        setBookToReview(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        setTimeout(() => {
            setIsSubmitting(false);
            handleClose();
        }, 800);
    };

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
                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div>
                                <fieldset className="space-y-4">
                                    <legend className="text-foreground text-lg leading-none font-semibold">
                                        Qu&apos;avez-vous pensé de ce livre ?
                                    </legend>
                                    <RadioGroup
                                        className="flex gap-0 -space-x-px rounded-md shadow-xs"
                                        value={rating}
                                        onValueChange={setRating}
                                    >
                                        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((number) => (
                                            <label
                                                key={number}
                                                className="border-input has-data-[state=checked]:border-primary has-data-[state=checked]:bg-primary/5 has-[data-state=checked]:text-primary focus-within:border-ring focus-within:ring-ring/50 relative flex size-9 flex-1 cursor-pointer flex-col items-center justify-center gap-3 border text-center text-sm transition-all outline-none first:rounded-s-md last:rounded-e-md focus-within:ring-[3px] has-[data-disabled]:cursor-not-allowed has-[data-disabled]:opacity-50 has-[data-state=checked]:z-10"
                                            >
                                                <RadioGroupItem
                                                    id={`radio-rating-${number}`}
                                                    value={number.toString()}
                                                    className="sr-only after:absolute after:inset-0"
                                                />
                                                {number}
                                            </label>
                                        ))}
                                    </RadioGroup>
                                </fieldset>
                                <div className="text-muted-foreground mt-2 flex justify-between text-xs">
                                    <p>Mauvais</p>
                                    <p>Parfait</p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="feedback">Pourquoi avez-vous donné cette note ?</Label>
                                <Textarea
                                    id="feedback"
                                    placeholder="Partagez votre expérience avec ce livre..."
                                    aria-label="Avis sur le livre"
                                    value={feedback}
                                    onChange={(e) => setFeedback(e.target.value)}
                                    className="min-h-24 resize-none"
                                />
                            </div>
                        </div>
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={!rating || isSubmitting}
                        >
                            {isSubmitting ? "Enregistrement..." : "Enregistrer mon avis"}
                        </Button>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
}