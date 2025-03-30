import {Avatar, AvatarFallback} from "@/components/ui/avatar";
import {memo, useMemo} from "react";
import {useUser} from "@/hooks/useUser";

const DashboardHeader = memo(() => {
    const {user} = useUser();

    if (!user) return null;
    const userInitials = useMemo(() => {
        return user.username.slice(0, 2).toUpperCase();
    }, [user.username]);

    return (
        <div className="flex items-center space-x-4 mb-6">
            <Avatar className="h-16 w-16 border-2 border-primary">
                <AvatarFallback className="bg-primary/10 text-primary font-medium">{userInitials}</AvatarFallback>
            </Avatar>
            <div>
                <h1 className="text-2xl font-bold">Bonjour {user.username}</h1>
                <p className="text-muted-foreground">Bienvenue sur votre tableau de bord</p>
            </div>
        </div>
    );
});

export default DashboardHeader;
