import ProfileContent from "@/components/Profile/ProfileContent";
import {Metadata} from "next";
import {use} from "react";

export const metadata: Metadata = {
    title: "Profil Capybook",
    description: "Le profil de l'utilisateur",
}

type Params = Promise<{ username: string }>

export default function ProfilePage(props: {
    params: Params
}) {
    const params = use(props.params)
    const username = params.username
    return (
        <ProfileContent username={username}/>
    );
}