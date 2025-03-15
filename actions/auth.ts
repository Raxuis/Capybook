"use server";

import {signIn} from "@/auth";
import {SignInSchema, SignUpSchema} from "@/utils/zod";
import prisma from "@/utils/prisma";
import {saltAndHashPassword} from "@/utils/password";

export async function signUp(formData: unknown) {
    try {
        const {username, email, password} = SignUpSchema.parse(formData);

        const existingUser = await prisma.user.findFirst({
            where: {email},
        });

        if (existingUser) {
            return {error: "User already exists"};
        }

        const existingUsername = await prisma.user.findFirst({
            where: {username},
        });

        if (existingUsername) {
            return {error: "Username already exists"};
        }

        const hashedPassword = await saltAndHashPassword(password);

        const createdUser = await prisma.user.create({
            data: {
                email,
                username,
                password: hashedPassword,
            },
        });

        return {message: `User with email: ${createdUser.email} is created!`};
    } catch {
        return {error: "Invalid data"};
    }
}

export async function login(formData: unknown) {
    try {
        const {email, password} = SignInSchema.parse(formData);

        if (!email) {
            return {error: "Email is required"};
        }

        if (!password) {
            return {error: "Password is required"};
        }

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
        return {error: "Invalid credentials"};
    }
}
