"use server";

import { signIn } from "@/auth";
import { SignInSchema, SignUpSchema } from "@/lib/validators";
import prisma from "@/lib/db/prisma";
import { hashPassword } from "@/lib/helpers/password";
import type { ActionResponse } from "./types";

/**
 * Server actions for authentication
 */

/**
 * Sign up a new user
 */
export async function signUp(formData: unknown): ActionResponse<{ message: string }> {
  try {
    const validatedData = SignUpSchema.parse(formData);
    const { username, email, password, favoriteColor } = validatedData;

    // Check if user with email already exists
    const existingUser = await prisma.user.findFirst({
      where: { email },
    });

    if (existingUser) {
      return { success: false, error: "Un utilisateur avec cet email existe déjà" };
    }

    // Check if username is already taken
    const existingUsername = await prisma.user.findFirst({
      where: { username },
    });

    if (existingUsername) {
      return { success: false, error: "Le nom d'utilisateur est déjà pris" };
    }

    // Hash password and create user
    const hashedPassword = await hashPassword(password);

    const createdUser = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        favoriteColor,
      },
    });

    return {
      success: true,
      data: { message: `Utilisateur avec email : ${createdUser.email} est créé !` }
    };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Erreur lors de la création de l'utilisateur" };
  }
}

/**
 * Login user
 */
export async function login(formData: unknown): ActionResponse<{ success: boolean }> {
  try {
    const validatedData = SignInSchema.parse(formData);
    const { email, password } = validatedData;

    const response = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (response?.error) {
      return { success: false, error: response.error };
    }

    return { success: true, data: { success: true } };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Email ou mot de passe incorrect" };
  }
}
