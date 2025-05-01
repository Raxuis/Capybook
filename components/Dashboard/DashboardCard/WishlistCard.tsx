import { BookOpen, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Book as BookType } from "@/types";
import { formatList } from "@/utils/format";

type WishlistCardProps = {
  wishlistItem: any;
  openBookModal: (book: BookType) => void;
};

const WishlistCard = ({ wishlistItem, openBookModal }: WishlistCardProps) => {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md border-rose-100 hover:border-rose-200">
      <CardHeader className="p-4 pb-2 bg-rose-50 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-lg font-medium line-clamp-1">{wishlistItem.Book.title}</CardTitle>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 p-0 pt-0.5"
          onClick={() => openBookModal(wishlistItem.Book as BookType)}
        >
          <Info className="h-4 w-4" />
          <span className="sr-only">Détails</span>
        </Button>
      </CardHeader>
      <CardContent className="p-4 pt-2 flex items-center justify-between space-x-2">
        <div className="flex items-center">
          <BookOpen className="h-4 w-4 mr-2 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {formatList(wishlistItem.Book.authors) || "Auteur(s) inconnu(s)"}
          </span>
        </div>
        <div className="flex items-center">
          <Badge className="text-xs text-center bg-rose-100 hover:bg-rose-200 cursor-default text-rose-700 rounded-full">
            Souhaité depuis le {new Date(wishlistItem.createdAt).toLocaleDateString()}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default WishlistCard;
