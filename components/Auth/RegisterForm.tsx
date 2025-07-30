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
import {LoaderCircleIcon} from "lucide-react";
import {useState} from "react";
import {useRouter} from "nextjs-toploader/app";
import {signUp} from "@/actions/auth/auth";
import ColorPicker from "@/components/ui/color-picker";

export default function RegisterForm() {
    const {toast} = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const form = useForm<z.infer<typeof SignUpSchema>>({
        resolver: zodResolver(SignUpSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
            favoriteColor: "#3b82f6"
        },
    });

    async function onSubmit(values: z.infer<typeof SignUpSchema>) {
        if (values) {
            setIsSubmitting(true);
            try {
                const result = await signUp(values);

                if (result.error) {
                    if (result.error === "Username already exists") {
                        form.setError("username", {
                            type: "manual",
                            message: "Ce nom d'utilisateur existe déjà",
                        });
                    } else if (result.error === "User already exists") {
                        form.setError("email", {
                            type: "manual",
                            message: "Cet email est déjà utilisé",
                        });
                    } else {
                        toast({
                            variant: "destructive",
                            title: "Erreur",
                            description: result.error || "Une erreur est survenue",
                        });
                    }
                } else {
                    form.reset();
                    toast({
                        title: "Succès",
                        description: "Votre compte a été créé avec succès",
                    });
                    router.push("/login");
                }
            } catch (error) {
                console.error(error);
                toast({
                    variant: "destructive",
                    title: "Erreur",
                    description: "Une erreur est survenue lors de la création du compte",
                });
            } finally {
                setIsSubmitting(false);
            }
        }
    }

    return (
        <Card className="mx-auto mt-20 w-full max-w-xl p-4">
            <div className="flex flex-col items-center gap-2">
                <div
                    className="flex size-11 shrink-0 items-center justify-center rounded-full border"
                    aria-hidden="true"
                >
                    <Image src="/icon.png" alt="Capybook icon" width={100} height={100} className="p-1"/>
                </div>
                <CardHeader>
                    <CardTitle className="sm:text-center">
                        Créer un compte sur {" "}
                        <span className="font-extrabold underline">
                            Capybook
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
                            name="favoriteColor"
                            render={({field}) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Couleur préférée</FormLabel>
                                    <FormControl>
                                        <ColorPicker
                                            color={field.value || "#3b82f6"}
                                            action={(color) => field.onChange(color)}
                                            className="w-full"
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}/>
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

                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                            {
                                isSubmitting && <LoaderCircleIcon
                                    className="-ms-1 animate-spin"
                                    size={16}
                                    aria-hidden="true"
                                />
                            }
                            Créer
                        </Button>

                    </form>
                </Form>
            </CardContent>
            <CardFooter>
                <p className="text-muted-foreground text-sm">
                    Déjà un compte ? Connectez vous {" "}
                    <Link href="/login" className="text-sm text-black underline hover:no-underline">
                        ici
                    </Link>
                    .
                </p>
            </CardFooter>
        </Card>
    );
}
