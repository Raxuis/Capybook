import {BookOpen, Info} from "lucide-react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {Book as BookType} from "@/types";
import {formatList} from "@/utils/format";

type WishlistCardProps = {
    wishlistItem: {
        Book: BookType;
        createdAt: Date;
    };
    openBookModal: (book: BookType) => void;
};

const WishlistCard = ({wishlistItem, openBookModal}: WishlistCardProps) => {
    return (
        <Card className="overflow-hidden border-rose-100 transition-all hover:border-rose-200 hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 bg-rose-50 p-4 pb-2">
                <CardTitle className="line-clamp-1 text-lg font-medium">{wishlistItem.Book.title}</CardTitle>
                <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 p-0 pt-0.5"
                    onClick={() => openBookModal(wishlistItem.Book as BookType)}
                >
                    <Info className="size-4"/>
                    <span className="sr-only">Détails</span>
                </Button>
            </CardHeader>
            <CardContent className="flex items-center justify-between space-x-2 p-4 pt-2">
                <div className="flex items-center">
                    <BookOpen className="text-muted-foreground mr-2 size-4"/>
                    <span className="text-muted-foreground text-sm">
            {formatList(wishlistItem.Book.authors) || "Auteur(s) inconnu(s)"}
          </span>
                </div>
                <div className="flex items-center">
                    <Badge
                        className="cursor-default rounded-full bg-rose-100 text-center text-xs text-rose-700 hover:bg-rose-200">
                        Souhaité depuis le {wishlistItem.createdAt.toLocaleDateString()}
                    </Badge>
                </div>
            </CardContent>
        </Card>
    );
};

export default WishlistCard;
