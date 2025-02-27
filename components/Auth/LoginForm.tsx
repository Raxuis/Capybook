"use client";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Link, useTransitionRouter} from "next-view-transitions";
import Image from "next/image";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {SignInSchema} from "@/utils/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {useAuth} from "@/hooks/useAuth";

export default function LoginForm() {
    const form = useForm<z.infer<typeof SignInSchema>>({
        defaultValues: {
            email: "",
            password: ""
        }
    })
    const router = useTransitionRouter()
    const {setAuthenticated} = useAuth();


    async function onSubmit(values: z.infer<typeof SignInSchema>) {
        if (values) {
            try {
                const response = await fetch("/api/login", {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(values),
                });

                const data = await response.json();
                if (!response.ok) throw new Error(data.error || "Login failed");


                router.push("/book-shelf");
                setAuthenticated(true);


            } catch (error) {
                console.error(error);
            }
        }
    }

    return (
        <Card className="p-4 max-w-xl mx-auto w-full mt-20">
            <div className="flex flex-col items-center gap-2">
                <div
                    className="flex size-11 shrink-0 items-center justify-center rounded-full border"
                    aria-hidden="true"
                >
                    <Image src="/icon.png" alt="livre track icon" width={100} height={100} className="p-1"/>
                </div>
                <CardHeader>
                    <CardTitle className="sm:text-center">De retour ?</CardTitle>
                    <CardDescription className="sm:text-center">
                        Veuillez entrer vos informations.
                    </CardDescription>
                </CardHeader>
            </div>

            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="john@doe.com" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="password"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Mot de passe</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Entrez votre mot de passe." {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full">
                            Se connecter
                        </Button>
                    </form>
                </Form>
            </CardContent>
            <CardFooter>
                <p className="text-sm text-muted-foreground">
                    Pas encore de compte ? Créez en un {" "}
                    <Link href="/register" className="text-sm underline hover:no-underline text-black">
                        ici
                    </Link>
                    .
                </p>
            </CardFooter>
        </Card>
    );
}
