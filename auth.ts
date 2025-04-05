import NextAuth from "next-auth";
import {PrismaAdapter} from "@auth/prisma-adapter";
import prisma from "@/utils/prisma";
import Credentials from "next-auth/providers/credentials";
import {ZodError} from "zod";
import {SignInSchema} from "@/utils/zod";
import bcrypt from "bcryptjs";

export const {handlers, signIn, signOut, auth} = NextAuth({
    adapter: PrismaAdapter(prisma),
    secret: process.env.AUTH_SECRET,
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60,
    },
    jwt: {
        maxAge: 30 * 24 * 60 * 60,
    },
    providers: [
        Credentials({
            credentials: {email: {}, password: {}},
            authorize: async (credentials) => {
                try {
                    const {email, password} = await SignInSchema.parseAsync(credentials);
                    const user = await prisma.user.findUnique({
                        where: {email},
                        select: {id: true, email: true, name: true, username: true, password: true}
                    });

                    if (!user || !user.password) throw new Error("Invalid credentials");

                    const passwordMatch = await bcrypt.compare(password, user.password);
                    if (!passwordMatch) throw new Error("Invalid credentials");

                    return {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        username: user.username,
                    };
                } catch (error) {
                    if (error instanceof ZodError) return null;
                    return null;
                }
            }
        }),
    ],
    callbacks: {
        async session({session, token}) {
            if (token) {
                session.user = {
                    id: token.id as string,
                    email: token.email as string,
                    username: token.username as string,
                    name: token.name as string,
                    emailVerified: null
                };
            }
            return session;
        },
        async jwt({token, user}) {
            if (user) {
                token.id = user.id as string;
                token.email = user.email as string;
                token.username = (user.username as string | undefined) ?? "No name";
                token.name = user.name;
            }
            return token;
        },
        async authorized({auth}) {
            return !!auth;
        },
    },
    pages: {
        signIn: "/login",
    },
});
