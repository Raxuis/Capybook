"use client";

import { useState } from "react";
import { useRouter } from 'nextjs-toploader/app';
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignInSchema } from "@/utils/zod";
import { login } from "@/actions/auth/auth";
import { LoaderCircleIcon } from "lucide-react";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "next-view-transitions";
import Image from "next/image";

export default function LoginForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const router = useRouter();

    const form = useForm<z.infer<typeof SignInSchema>>({
        resolver: zodResolver(SignInSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    });

    async function onSubmit(values: z.infer<typeof SignInSchema>) {
        setIsSubmitting(true);
        setErrorMessage(null);

        const response = await login(values);

        if (response?.error) {
            setErrorMessage(response.error);
        } else {
            router.push("/book-shelf");
            router.refresh();
        }

        setIsSubmitting(false);
    }

    return (
        <Card className="p-4 max-w-xl mx-auto w-full mt-20">
            <div className="flex flex-col items-center gap-2">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-full border" aria-hidden="true">
                    <Image src="/icon.png" alt="Capybook Icon" width={100} height={100} className="p-1"/>
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
                            render={({ field }) => (
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
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Mot de passe</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="Entrez votre mot de passe" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}

                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                            {isSubmitting && <LoaderCircleIcon className="-ms-1 animate-spin" size={16} aria-hidden="true"/>}
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
