import NextAuth from "next-auth";
import {PrismaAdapter} from "@auth/prisma-adapter";
import prisma from "@/utils/prisma";
import Credentials from "next-auth/providers/credentials";
import {ZodError} from "zod";
import {SignInSchema} from "@/utils/zod";
import bcrypt from "bcryptjs";

export const {handlers, signIn, signOut, auth} = NextAuth({
    adapter: PrismaAdapter(prisma),
    session: {
        strategy: "jwt",
    },
    providers: [
        Credentials({
            credentials: {email: {}, password: {}},
            authorize: async (credentials) => {
                try {
                    const {email, password} = await SignInSchema.parseAsync(credentials);
                    const user = await prisma.user.findUnique({where: {email}});

                    if (!user || !user.password) throw new Error("Invalid credentials");

                    const passwordMatch = await bcrypt.compare(password, user.password);
                    if (!passwordMatch) throw new Error("Invalid credentials");

                    return user;
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
                    id: token.sub as string,
                    email: token.email as string,
                    emailVerified: null
                };
            }
            return session;
        },
        async jwt({token, user}) {
            if (user) {
                token.id = user.id;
                token.email = user.email;
            }
            return token;
        },
        authorized: async ({auth}) => {
            return !!auth
        },
    },
    pages: {
        signIn: "/login",
    },
});
