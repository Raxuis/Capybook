import NextAuth, {AuthError} from "next-auth";
import {PrismaAdapter} from "@auth/prisma-adapter";
import prisma from "@/lib/db/prisma";
import Credentials from "next-auth/providers/credentials";
import {ZodError} from "zod";
import {SignInSchema} from "@/lib/validators";
import bcrypt from "bcryptjs";

export const {handlers, signIn, auth} = NextAuth({
    trustHost: true,
    adapter: PrismaAdapter(prisma),
    secret: process.env.NEXTAUTH_SECRET ?? "test-secret-for-ci",
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
                    console.log('[auth] Starting authorization...');
                    console.log('[auth] Credentials received:', {
                        email: credentials?.email,
                        hasPassword: !!credentials?.password
                    });

                    const {email, password} = await SignInSchema.parseAsync(credentials);
                    console.log('[auth] Schema validation passed');
                    console.log(`[auth] Attempting login for: ${email}`);

                    const user = await prisma.user.findUnique({
                        where: {email},
                        select: {id: true, email: true, name: true, username: true, password: true, role: true}
                    });

                    console.log(`[auth] User lookup result:`, {
                        found: !!user,
                        hasPassword: !!user?.password,
                        email: user?.email,
                    });

                    if (!user) {
                        console.log(`[auth] ❌ User not found: ${email}`);
                        throw new Error("Invalid credentials");
                    }

                    if (!user.password) {
                        console.log(`[auth] ❌ User has no password: ${email}`);
                        throw new Error("Invalid credentials");
                    }

                    console.log(`[auth] Comparing passwords...`);
                    console.log(`[auth] Stored hash preview: ${user.password.substring(0, 20)}...`);

                    const passwordMatch = await bcrypt.compare(password, user.password);
                    console.log(`[auth] Password match result: ${passwordMatch}`);

                    if (!passwordMatch) {
                        console.log(`[auth] ❌ Password mismatch for: ${email}`);
                        throw new Error("Invalid credentials");
                    }

                    console.log(`[auth] ✓ Authentication successful for: ${email}`);
                    return {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        username: user.username,
                        role: user.role,
                    };
                } catch (error) {
                    console.error('[auth] Authorization error:', error);

                    if (error instanceof AuthError) {
                        console.log('[auth] AuthError type:', error.type);
                        switch (error.type) {
                            case "CredentialsSignin":
                                return {msg: "Invalid credentials", status: "error"};
                            default:
                                return {msg: "Something went wrong", status: "error"};
                        }
                    } else if (error instanceof ZodError) {
                        const firstError = error.errors[0];
                        console.log('[auth] Zod validation error:', firstError);
                        return {msg: firstError.message, status: "error"};
                    }
                    throw error;
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
                    role: token.role as string,
                    emailVerified: null,
                };
            }
            return session;
        },
        async jwt({token, user, trigger, session}) {
            if (trigger === "update" && session) {
                return {...token, ...session.user};
            }

            if (user) {
                token.id = user.id as string;
                token.email = user.email;
                token.username = user.username ?? "No name";
                token.name = user.name;
                token.role = user.role ?? "USER";
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