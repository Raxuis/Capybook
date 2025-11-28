"use server";

import {signIn} from "@/auth";
import {SignInSchema, SignUpSchema} from "@/utils/zod";
import prisma from "@/utils/prisma";
import {saltAndHashPassword} from "@/utils/password";

export async function signUp(formData: unknown) {
    try {
        const {username, email, password, favoriteColor} = SignUpSchema.parse(formData);

        const existingUser = await prisma.user.findFirst({
            where: {email},
        });

        if (existingUser) {
            return {error: "Un utilisateur avec cet email existe déjà"};
        }

        const existingUsername = await prisma.user.findFirst({
            where: {username},
        });

        if (existingUsername) {
            return {error: "Le nom d'utilisateur est déjà pris"};
        }

        const hashedPassword = await saltAndHashPassword(password);

        const createdUser = await prisma.user.create({
            data: {
                email,
                username,
                password: hashedPassword,
                favoriteColor,
            },
        });

        return {message: `Utilisateur avec email : ${createdUser.email} est créé !`};
    } catch {
        return {error: "Erreur lors de la création de l'utilisateur"};
    }
}

export async function login(formData: unknown) {
    try {
        const {email, password} = SignInSchema.parse(formData);

        const response = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        if (response?.error) {
            return {error: response.error};
        }

        return {success: true};
    } catch {
        return {error: "Email ou mot de passe incorrect"};
    }
}
