"use client";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Textarea} from "@/components/ui/textarea";
import {Badge} from "@/components/ui/badge";
import {Users, Search, Loader2, Send, X} from "lucide-react";
import {useState, useEffect, useMemo, useCallback} from "react";
import {motion, AnimatePresence} from "motion/react";
import {MoreInfoBook} from "@/types";
import {useUser} from "@/hooks/useUser";
import {api} from "@/utils/api";

interface LendingModalProps {
    book: MoreInfoBook;
    isOpen: boolean;
    onClose: () => void;
    onLend: (borrowerId: string, message?: string) => Promise<void>;
    isLoading?: boolean;
}

interface Friend {
    id: string;
    username: string;
    name?: string;
    email: string;
    image?: string;
}

const LendingModal = ({
                          book,
                          isOpen,
                          onClose,
                          onLend,
                          isLoading = false
                      }: LendingModalProps) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
    const [message, setMessage] = useState("");
    const [friends, setFriends] = useState<Friend[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [loadingLend, setLoadingLend] = useState(false);
    const {user} = useUser();

    // Recherche d'amis/utilisateurs
    const searchFriends = useCallback(async (search: string) => {
        if (!search.trim() || !user?.id) return;

        setIsSearching(true);
        try {
            const response = await api.get(`/users/search`, {
                params: {
                    q: search.trim(),
                    excludeId: user.id
                }
            });
            setFriends(response.data.users || []);
        } catch (error) {
            console.error("Erreur lors de la recherche d'amis:", error);
            setFriends([]);
        } finally {
            setIsSearching(false);
        }
    }, [user?.id]);

    // Filtrer les amis en fonction de la recherche
    const filteredFriends = useMemo(() => {
        if (!searchTerm.trim()) return friends;

        return friends.filter(friend =>
            friend.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            friend.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            friend.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [friends, searchTerm]);

    // Effectuer la recherche avec un délai
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (searchTerm.trim()) {
                searchFriends(searchTerm);
            } else {
                setFriends([]);
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchFriends, searchTerm]);

    const handleLend = async () => {
        if (!selectedFriend) return;

        setLoadingLend(true);
        try {
            await onLend(selectedFriend.id, message.trim() || undefined);
            handleClose();
        } catch (error) {
            console.error("Erreur lors du prêt:", error);
        } finally {
            setLoadingLend(false);
        }
    };

    const handleClose = () => {
        setSearchTerm("");
        setSelectedFriend(null);
        setMessage("");
        setFriends([]);
        onClose();
    };

    const handleFriendSelect = (friend: Friend) => {
        setSelectedFriend(friend);
        setSearchTerm(friend.username);
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-blue-600"/>
                        Prêter &#34;{book.title}&#34;
                    </DialogTitle>
                    <DialogDescription>
                        Choisissez à qui vous souhaitez prêter ce livre
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Recherche d'utilisateurs */}
                    <div className="space-y-2">
                        <Label htmlFor="search">Rechercher un utilisateur</Label>
                        <div className="relative">
                            <Search
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"/>
                            <Input
                                id="search"
                                placeholder="Nom d'utilisateur, nom ou email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                                disabled={isLoading || loadingLend}
                            />
                            {isSearching && (
                                <Loader2
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-gray-400"/>
                            )}
                        </div>
                    </div>

                    {/* Liste des résultats */}
                    {searchTerm && (
                        <div className="max-h-48 overflow-y-auto border rounded-md">
                            <AnimatePresence>
                                {filteredFriends.length > 0 ? (
                                    filteredFriends.map((friend) => (
                                        <motion.div
                                            key={friend.id}
                                            initial={{opacity: 0, y: -10}}
                                            animate={{opacity: 1, y: 0}}
                                            exit={{opacity: 0, y: -10}}
                                            className={`p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0 transition-colors ${
                                                selectedFriend?.id === friend.id ? 'bg-blue-50 border-blue-200' : ''
                                            }`}
                                            onClick={() => handleFriendSelect(friend)}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-sm font-medium">
                                                    {friend.name?.[0] || friend.username[0]}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium text-sm truncate">
                                                        {friend.name || friend.username}
                                                    </p>
                                                    <p className="text-xs text-gray-500 truncate">
                                                        @{friend.username}
                                                    </p>
                                                </div>
                                                {selectedFriend?.id === friend.id && (
                                                    <Badge variant="secondary" className="text-xs">
                                                        Sélectionné
                                                    </Badge>
                                                )}
                                            </div>
                                        </motion.div>
                                    ))
                                ) : searchTerm.trim() && !isSearching ? (
                                    <div className="p-4 text-center text-gray-500 text-sm">
                                        Aucun utilisateur trouvé pour &#34;{searchTerm}&#34;
                                    </div>
                                ) : null}
                            </AnimatePresence>
                        </div>
                    )}

                    {/* Utilisateur sélectionné */}
                    {selectedFriend && (
                        <motion.div
                            initial={{opacity: 0, scale: 0.95}}
                            animate={{opacity: 1, scale: 1}}
                            className="p-3 bg-blue-50 border border-blue-200 rounded-md"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-sm font-medium">
                                        {selectedFriend.name?.[0] || selectedFriend.username[0]}
                                    </div>
                                    <div>
                                        <p className="font-medium text-sm">
                                            {selectedFriend.name || selectedFriend.username}
                                        </p>
                                        <p className="text-xs text-gray-600">
                                            @{selectedFriend.username}
                                        </p>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setSelectedFriend(null)}
                                    className="h-8 w-8 p-0"
                                >
                                    <X className="h-4 w-4"/>
                                </Button>
                            </div>
                        </motion.div>
                    )}

                    {/* Message optionnel */}
                    <div className="space-y-2">
                        <Label htmlFor="message">Message (optionnel)</Label>
                        <Textarea
                            id="message"
                            placeholder="Ajoutez un message personnalisé..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="min-h-[80px]"
                            disabled={isLoading || loadingLend}
                        />
                    </div>
                </div>

                <DialogFooter className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={handleClose}
                        disabled={isLoading || loadingLend}
                    >
                        Annuler
                    </Button>
                    <Button
                        onClick={handleLend}
                        disabled={!selectedFriend || isLoading || loadingLend}
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                        {loadingLend ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin mr-2"/>
                                Prêt en cours...
                            </>
                        ) : (
                            <>
                                <Send className="h-4 w-4 mr-2"/>
                                Prêter le livre
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default LendingModal;