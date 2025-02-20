"use client"

import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Link} from "next-view-transitions";
import Image from "next/image";
import {SignUpSchema} from "@/utils/zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {useToast} from "@/hooks/use-toast";

export default function RegisterForm() {
    const {toast} = useToast();

    const form = useForm<z.infer<typeof SignUpSchema>>({
        resolver: zodResolver(SignUpSchema),
        defaultValues: {
            username: "",
            email: "",
            password: ""
        },
    });

    async function onSubmit(values: z.infer<typeof SignUpSchema>) {
        if (values) {
            try {
                const response = await fetch("/api/register", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(values)
                });

                const data = await response.json();

                if (!response.ok) {
                    if (data.error === 'Username already exists') {
                        form.setError('username', {
                            type: 'manual',
                            message: 'Ce nom d\'utilisateur existe déjà'
                        });
                    } else if (data.error === 'User already exists') {
                        form.setError('email', {
                            type: 'manual',
                            message: 'Cet email est déjà utilisé'
                        });
                    } else {
                        toast({
                            variant: "destructive",
                            title: "Erreur",
                            description: data.error || "Une erreur est survenue"
                        });
                    }
                } else {
                    form.reset();
                    toast({
                        title: "Succès",
                        description: "Votre compte a été créé avec succès"
                    });
                }
            } catch (error) {
                console.error(error);
                toast({
                    variant: "destructive",
                    title: "Erreur",
                    description: "Une erreur est survenue lors de la création du compte"
                });
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
                    <CardTitle className="sm:text-center">
                        Créer un compte sur {" "}
                        <span className="font-extrabold underline">
                            Livre Track
                        </span>
                    </CardTitle>
                    <CardDescription className="sm:text-center">
                        Nous avons juste besoin de plus d&#39;informations.
                    </CardDescription>
                </CardHeader>
            </div>

            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="username"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Pseudo</FormLabel>
                                    <FormControl>
                                        <Input placeholder="JohnDoe_" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

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
                            Créer
                        </Button>
                    </form>
                </Form>
            </CardContent>
            <CardFooter>
                <p className="text-sm text-muted-foreground">
                    Déjà un compte ? Connectez vous {" "}
                    <Link href="/login" className="text-sm underline hover:no-underline text-black">
                        ici
                    </Link>
                    .
                </p>
            </CardFooter>
        </Card>
    );
}
