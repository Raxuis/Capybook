"use server";

import {signOut, signIn} from "@/auth";

import {signIn as clientSignIn} from "next-auth/react"


export const signOutAction = async () => {
    await signOut({redirectTo: "/"});
};

export const signInAction = async (values: { email: string; password: string }) => {
    await signIn("credentials", {
        values,
        redirectTo: "/",
    });
};

export const clientSignInAction = async (values: { email: string; password: string }) => {
    await clientSignIn("credentials", {
        values,
        redirectTo: "/",
    });
}