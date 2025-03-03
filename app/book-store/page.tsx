import {auth} from "@/auth";
import BookStore from "@/components/BookStore/BookStore";

export default async function BookStoreWrapper() {
    const session = await auth();
    const userId = session?.user?.id || null;

    return <BookStore userId={userId} />;
}
