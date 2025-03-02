import {auth} from "@/auth";
import BookStore from "@/components/Dashboard/Book/BookStore";

export default async function BookStoreWrapper() {
    const session = await auth();
    const userId = session?.user?.id || null;

    return <BookStore userId={userId} />;
}
