import React, {useState, useEffect} from "react";
import {Button} from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import {Label} from "@/components/ui/label";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Globe, Lock, Users, User} from "lucide-react";
import axios from "axios";

interface Friend {
    id: string;
    username: string;
    name?: string;
}

interface PrivacyModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (privacy: string, specificFriendId?: string) => void;
    userId: string;
}

export function ReviewPrivacyModal({isOpen, onClose, onSubmit, userId}: PrivacyModalProps) {
    const [privacy, setPrivacy] = useState<string>("PUBLIC");
    const [specificFriendId, setSpecificFriendId] = useState<string>("");
    const [friends, setFriends] = useState<Friend[]>([]);
    const [isLoadingFriends, setIsLoadingFriends] = useState(false);

    useEffect(() => {
        if (isOpen && (privacy === "SPECIFIC_FRIEND" || privacy === "FRIENDS")) {
            loadFriends();
        }
    }, [isOpen, privacy, userId]);

    const loadFriends = async () => {
        setIsLoadingFriends(true);
        try {
            const response = await axios.get(`/api/user/${userId}/friends`);
            console.log("Loaded friends:", response);
            setFriends(response.data || []);
        } catch (error) {
            console.error("Error loading friends:", error);
            setFriends([]);
        } finally {
            setIsLoadingFriends(false);
        }
    };

    const handleSubmit = () => {
        if (privacy === "SPECIFIC_FRIEND" && !specificFriendId) {
            return; // Don't submit if specific friend is required but not selected
        }
        onSubmit(privacy, specificFriendId || undefined);
        handleClose();
    };

    const handleClose = () => {
        setPrivacy("PUBLIC");
        setSpecificFriendId("");
        onClose();
    };

    const privacyOptions = [
        {
            value: "PUBLIC",
            label: "Public",
            description: "Visible par tous les utilisateurs",
            icon: <Globe className="w-5 h-5"/>
        },
        {
            value: "PRIVATE",
            description: "Accessible uniquement par lien privé",
            label: "Privé",
            icon: <Lock className="w-5 h-5"/>
        },
        {
            value: "FRIENDS",
            label: "Amis",
            description: "Visible par tous vos amis",
            icon: <Users className="w-5 h-5"/>
        },
        {
            value: "SPECIFIC_FRIEND",
            label: "Ami spécifique",
            description: "Visible par un ami en particulier",
            icon: <User className="w-5 h-5"/>
        }
    ];

    const isSubmitDisabled =
        (privacy === "SPECIFIC_FRIEND" && !specificFriendId) ||
        ((privacy === "FRIENDS" || privacy === "SPECIFIC_FRIEND") && friends.length === 0 && !isLoadingFriends);

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Choisir la confidentialité de votre avis</DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    <RadioGroup value={privacy} onValueChange={setPrivacy} className="space-y-3">
                        {privacyOptions.map((option) => (
                            <div key={option.value} className="flex items-start space-x-3">
                                <RadioGroupItem
                                    value={option.value}
                                    id={option.value}
                                    className="mt-1"
                                />
                                <div className="flex-1">
                                    <Label
                                        htmlFor={option.value}
                                        className="flex items-center gap-2 font-medium cursor-pointer"
                                    >
                                        {option.icon}
                                        {option.label}
                                    </Label>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        {option.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </RadioGroup>

                    {privacy === "SPECIFIC_FRIEND" && (
                        <div className="space-y-2">
                            <Label>Sélectionner un ami</Label>
                            {isLoadingFriends ? (
                                <div className="text-sm text-muted-foreground">Chargement de vos amis...</div>
                            ) : friends.length === 0 ? (
                                <div className="text-sm text-muted-foreground">
                                    Vous n&#39;avez pas encore d&#39;amis. Ajoutez des amis pour utiliser cette option.
                                </div>
                            ) : (
                                <Select value={specificFriendId} onValueChange={setSpecificFriendId}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Choisir un ami"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {friends.map((friend) => (
                                            <SelectItem key={friend.id} value={friend.id}>
                                                {friend.name || friend.username}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        </div>
                    )}

                    {privacy === "FRIENDS" && friends.length === 0 && !isLoadingFriends && (
                        <div className="text-sm text-muted-foreground p-3 bg-muted rounded-md">
                            Vous n&#39;avez pas encore d&#39;amis. Votre avis sera visible uniquement par vous.
                        </div>
                    )}

                    {privacy === "PRIVATE" && (
                        <div className="text-sm text-muted-foreground p-3 bg-muted rounded-md">
                            Un lien privé sera généré que vous pourrez partager avec qui vous voulez.
                        </div>
                    )}
                </div>

                <div className="flex gap-2 pt-4">
                    <Button variant="outline" onClick={handleClose} className="flex-1">
                        Annuler
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={isSubmitDisabled}
                        className="flex-1"
                    >
                        Publier l&#39;avis
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}