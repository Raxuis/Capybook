"use client";

import {useSession, signOut} from 'next-auth/react';
import {Layout} from "@/components/Layout";
import {Link} from "next-view-transitions";
import {Button} from "@/components/ui/button";
import {Sparkles} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Avatar, AvatarImage} from "@/components/ui/avatar";
import Image from "next/image";
import {useAuth} from "@/hooks/useAuth";

export default function Header() {
    const {data: session} = useSession();
    const {isAuthenticated} = useAuth();

    const handleSignOut = async () => {
        await signOut({redirectTo: '/login'});
    };

    return (
        <header
            className="fixed top-4 backdrop-blur-lg border border-gray-200 rounded-full max-w-5xl w-full mx-auto z-50">
            <Layout className="flex flex-row items-center justify-between py-4 relative">
                <Link href="/" className="flex items-center gap-3 font-manrope text-2xl font-bold text-gray-900">
                    <Image src="/icon.png" alt="Livre Track Icon" width={40} height={40}
                           className="rounded-full p-1 shadow-md"/>
                    Livre Track
                </Link>
                <div className="flex items-center gap-4">
                    <Button variant="outline" asChild
                            className="relative overflow-hidden font-inter group p-6 rounded-full border border-gray-300 shadow-md transition-all duration-300 bg-white/30 backdrop-blur-md hover:shadow-lg hover:border-amber-500">
                        <Link href={session || isAuthenticated ? "/book-shelf" : "/login"}
                              className="flex items-center gap-2 font-semibold text-lg">
                            <span
                                className="relative z-10 text-gray-900 transition-colors duration-300 group-hover:text-amber-600">
                                Commencer l&#39;aventure
                            </span>
                            <Sparkles
                                className="relative z-10 -me-1 ms-2 opacity-70 transition-transform duration-300 group-hover:scale-110 group-hover:text-amber-600"
                                size={18} strokeWidth={2} aria-hidden="true"/>
                            <span
                                className="absolute inset-0 bg-gradient-to-r from-amber-500 to-yellow-400 opacity-0 transition-opacity duration-500 group-hover:opacity-20"></span>
                        </Link>
                    </Button>
                    {session?.user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="icon" className="rounded-full">

                                    <Avatar className="h-8 w-8 border-1 border-gray-300">
                                        <AvatarImage src="/user.svg" alt="Profile picture"/>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem className="font-bold">
                                    {session.user.name ? session.user.name : "Anonymous"}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator/>
                                <DropdownMenuItem asChild>
                                    <Button variant="outline" className="block w-full text-left"
                                            onClick={handleSignOut}>
                                        Logout
                                    </Button>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : null}
                </div>
            </Layout>
        </header>
    );
}
