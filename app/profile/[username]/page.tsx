import ProfileContent from "@/components/Profile/ProfileContent";
import {Metadata} from "next";

export const metadata: Metadata = {
    title: "Profil Capybook",
    description: "Le profil de l'utilisateur",
}

export default async function ProfilePage({params}: {
    params: Promise<{ username: string }>
}) {
    const {username} = await params
    return (
        <ProfileContent username={username}/>
    );
}