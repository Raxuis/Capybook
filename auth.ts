import NextAuth from "next-auth"
import { ZodError } from "zod"
import Credentials from "next-auth/providers/credentials"
import { signInSchema } from "./utils/zod"
// import { saltAndHashPassword } from "@/utils/password"
import { getUserFromDb } from "@/utils/db"
import bcrypt from "bcryptjs";
import {PrismaAdapter} from "@auth/prisma-adapter";
import prisma from "@/utils/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        try {
          const { email, password } = await signInSchema.parseAsync(credentials)

          const user = await getUserFromDb(email)

          if (!user || !user.password) {
            throw new Error("Invalid credentials.")
          }
          const passwordMatch = await bcrypt.compare(password, user.password)

          if (!passwordMatch) {
            throw new Error("Invalid credentials.")
          }

          return user
        } catch (error) {
          if (error instanceof ZodError) {
            return null
          }
          return null
        }
      }
    }),
  ],
})
