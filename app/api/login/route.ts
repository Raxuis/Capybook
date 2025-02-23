import {createZodRoute} from "next-zod-route";
import {SignInSchema} from "@/utils/zod";
import {NextResponse} from "next/server";
import {signIn} from "@/auth";

export const POST = createZodRoute()
    .body(SignInSchema)
    .handler(async (request, context) => {
        const {email, password} = context.body;

        if (!email) {
            return NextResponse.json({error: "Email is required"}, {status: 400});
        }

        if (!password) {
            return NextResponse.json({error: "Password is required"}, {status: 400});
        }

        try {
            const response = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });


            if (response?.error) {
                return NextResponse.json({error: response.error}, {status: 401});
            }

            return NextResponse.json({success: true});
        } catch (error) {
            return NextResponse.json({error: "Something went wrong"}, {status: 500});
        }
    });
