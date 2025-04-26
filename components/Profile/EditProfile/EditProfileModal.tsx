"use client";
import {Button} from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import ColorPicker from "@/components/ui/color-picker";
import {Input} from "@/components/ui/input";
import {useToast} from "@/hooks/use-toast";
import {useRouter} from "next/navigation";
import {useForm} from "react-hook-form";
import z from "zod";
import {EditProfileSchema} from "@/utils/zod";
import {zodResolver} from "@hookform/resolvers/zod";
import axios from "axios";
import {useSession} from "next-auth/react";
import {useEffect} from "react";

type Props = {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    user: {
        id: string;
        username: string;
        favoriteColor: string;
    }
}

function EditProfileModal({
                              isOpen,
                              onOpenChange,
                              user
                          }: Props) {
    const {data: session, update: updateSession} = useSession();
    const {toast} = useToast();
    const router = useRouter();


    const form = useForm<z.infer<typeof EditProfileSchema>>({
        resolver: zodResolver(EditProfileSchema),
        defaultValues: {
            username: user.username || "",
            favoriteColor: user.favoriteColor || "#3b82f6",
        },
    });

    useEffect(() => {
        form.reset({
            username: user.username || "",
            favoriteColor: user.favoriteColor || "#3b82f6",
        });
    }, [user, form]);

    const onSubmit = async (values: z.infer<typeof EditProfileSchema>) => {
        if (values) {
            try {
                const response = await axios.put(`/api/user/${user.id}`, {
                    username: values.username,
                    favoriteColor: values.favoriteColor,
                });

                if (response.status === 200) {
                    await updateSession({
                        ...session,
                        user: {
                            ...session?.user,
                            username: values.username,
                            favoriteColor: values.favoriteColor
                        }
                    });

                    toast({
                        title: "Succès",
                        variant: "success",
                        description: "Votre profil a été mis à jour avec succès",
                    });

                    form.reset({
                        username: values.username,
                        favoriteColor: values.favoriteColor,
                    });

                    onOpenChange(false);

                    setTimeout(() => {
                        router.push(`/profile/@${response.data.username}`);
                    }, 100);
                }
            } catch (error) {
                // Gérer les erreurs axios ici
                if (axios.isAxiosError(error)) {
                    const responseData = error.response?.data;

                    if (error.response?.status === 400 && responseData?.error === "Username already taken") {
                        form.setError("username", {
                            type: "manual",
                            message: "Ce nom d'utilisateur existe déjà",
                        });
                    } else {
                        toast({
                            variant: "destructive",
                            title: "Erreur",
                            description: responseData?.error || "Une erreur est survenue lors de la mise à jour du profil",
                        });
                    }
                } else {
                    // Erreurs non-Axios
                    toast({
                        variant: "destructive",
                        title: "Erreur",
                        description: "Une erreur est survenue lors de la mise à jour du profil",
                    });
                }
            }
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent
                className="flex flex-col gap-0 overflow-y-visible p-0 sm:max-w-lg [&>button:last-child]:top-3.5">
                <DialogHeader className="contents space-y-0 text-left">
                    <DialogTitle className="border-b border-border px-6 py-4 text-base">
                        Modifier votre profil {" "}
                        <span className="text-primary font-semibold">
              @{user.username}
            </span>
                    </DialogTitle>
                </DialogHeader>
                <DialogDescription className="sr-only">
                    Faire des changements à votre profil.
                </DialogDescription>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="overflow-y-auto">
                        <div className="px-6 pb-6 pt-4">
                            <FormField
                                control={form.control}
                                name="favoriteColor"
                                render={({field}) => (
                                    <FormItem className="flex flex-col mb-4">
                                        <FormLabel className="text-sm font-medium text-gray-700">Couleur
                                            préférée</FormLabel>
                                        <FormControl>
                                            <ColorPicker
                                                color={field.value || "#3b82f6"}
                                                action={(color) => field.onChange(color)}
                                                className="w-full hover:bg-transparent"
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}/>
                            <FormField
                                control={form.control}
                                name="username"
                                render={({field}) => (
                                    <FormItem className='mb-4'>
                                        <FormLabel className="text-sm font-medium text-gray-700">Pseudo</FormLabel>
                                        <FormControl>
                                            <Input placeholder="JohnDoe_" {...field}
                                                   className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring focus:ring-primary/50"/>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                        </div>
                        <DialogFooter className="border-t border-border px-6 py-4">
                            <DialogClose asChild>
                                <Button type="button" variant="destructive">
                                    Annuler
                                </Button>
                            </DialogClose>
                            <Button type="submit">
                                Sauvegarder
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

export default EditProfileModal;
