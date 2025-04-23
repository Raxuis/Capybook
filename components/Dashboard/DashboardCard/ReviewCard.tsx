import { Info, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Book as BookType } from "@/types";

type ReviewCardProps = {
  review: any;
  openBookModal: (book: BookType) => void;
};

const ReviewCard = ({ review, openBookModal }: ReviewCardProps) => {
  return (
    <Card key={review.id} className="overflow-hidden">
      <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between bg-primary/5 space-y-0">
        <CardTitle className="text-lg font-medium">{review.Book.title}</CardTitle>
        <div className="flex items-center">
          <div className="flex items-center bg-white px-2 py-1 rounded-full mr-2">
            <Star className="h-3 w-3 text-amber-500 mr-1 inline-block" />
            <span className="text-sm font-bold">{review.rating}/5</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 p-0 pt-0.5 hover:bg-transparent"
            onClick={() => openBookModal(review.Book as BookType)}
          >
            <Info className="h-4 w-4" />
            <span className="sr-only">Détails</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        {review.feedback ? (
          <p className="text-muted-foreground">{review.feedback}</p>
        ) : (
          <p className="text-muted-foreground italic">Pas de commentaire</p>
        )}
      </CardContent>
    </Card>
  );
};

export default ReviewCard;
