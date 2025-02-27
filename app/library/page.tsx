import {auth} from "@/auth";
import Library from "@/components/Dashboard/Book/Library";

export default async function LibraryWrapper() {
    const session = await auth();
    const userId = session?.user?.id || null;

    return <Library userId={userId} />;
}
