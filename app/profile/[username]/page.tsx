import ProfileContent from "@/components/Profile/ProfileContent";

export default async function ProfilePage({params}: {
    params: Promise<{ username: string }>
}) {
    const {username} = await params
    return (
        <ProfileContent username={username}/>
    );
}