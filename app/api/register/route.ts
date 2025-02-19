import {createZodRoute} from 'next-zod-route';
import {signInSchema} from "@/utils/zod";
import {NextResponse} from 'next/server';
import prisma from "@/utils/prisma";
import {saltAndHashPassword} from "@/utils/password";


export const POST = createZodRoute()
    .body(signInSchema)
    .handler(async (request, context) => {
        const {email, password} = context.body;

        const user = await prisma.user.findFirst({
            where: {email}
        })

        if (user) {
            return NextResponse.json({error: 'User already exists'}, {status: 400});
        }

        const hashedPassword = await saltAndHashPassword(password);

        const {email: createdUserEmail} = await prisma.user.create({
            data: {
                email,
                password: hashedPassword
            }
        });

        return NextResponse.json({message: `User with email : ${createdUserEmail} is created!`}, {status: 201});
    });