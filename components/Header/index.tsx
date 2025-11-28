import {currentUser} from "@/actions/auth/current-user";
import ClientHeader from "./ClientHeader";

export default async function Header({isAdmin}: { isAdmin?: boolean }) {
    const user = await currentUser();

    return <ClientHeader user={user} adminHeader={isAdmin}/>;
}