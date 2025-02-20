import {signIn} from "@/auth"
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {useId} from "react";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Link} from "next-view-transitions";
import Image from "next/image";

export default function LoginForm() {
    const id = useId();
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
                <form className="space-y-5" action={async (formData) => {
                    "use server"
                    await signIn("credentials", formData)
                }}>
                    <div className="space-y-4">
                        <div className="*:not-first:mt-2">
                            <Label htmlFor={`${id}-email`}>Email</Label>
                            <Input id={`${id}-email`} placeholder="john@doe.com" type="email" required/>
                        </div>
                        <div className="*:not-first:mt-2">
                            <Label htmlFor={`${id}-password`}>Mot de passe</Label>
                            <Input
                                id={`${id}-password`}
                                placeholder="Entrez votre mot de passe"
                                type="password"
                                required
                            />
                        </div>
                    </div>
                    <Button type="button" className="w-full">
                        Se connecter
                    </Button>
                </form>
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
