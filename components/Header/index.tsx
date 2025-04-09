import {currentUser} from "@/actions/auth/current-user";
import ClientHeader from "./ClientHeader";

export default async function Header() {
    const user = await currentUser();

    return <ClientHeader user={user}/>;
}