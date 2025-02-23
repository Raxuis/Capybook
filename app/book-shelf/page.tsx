import {auth} from "@/auth";
import BookShelf from "@/components/Dashboard/Book/BookShelf";

export default async function BookShelfWrapper() {
    const session = await auth();
    const userId = session?.user?.id || null;

    return <BookShelf userId={userId} />;
}
