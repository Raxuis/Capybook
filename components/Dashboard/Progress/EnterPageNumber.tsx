"use client";

import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {FileText} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {usePageNumberModal} from "@/store/pageNumberModalStore";
import {PageNumberSchema} from "@/utils/zod";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";

export function PageNumberModal() {
    const {showPageNumberModal, setShowPageNumberModal, closeModal, bookId} = usePageNumberModal();

    const form = useForm<z.infer<typeof PageNumberSchema>>({
        resolver: zodResolver(PageNumberSchema),
        defaultValues: {
            pageNumber: "",
        },
    })

    const onSubmit = (values: z.infer<typeof PageNumberSchema>) => {
        setShowPageNumberModal(false);
        form.reset();
    };

    return (
        <Dialog open={showPageNumberModal} onOpenChange={setShowPageNumberModal}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5"/> Nombre de pages
                    </DialogTitle>
                    <DialogDescription>
                        Saisissez le nombre de pages de ce livre pour suivre votre progression.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
                        <FormField
                            control={form.control}
                            name="pageNumber"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel className="text-right" htmlFor="pageCount">Pages</FormLabel>
                                    <FormControl>
                                        <Input
                                            id="pageCount"
                                            type="number"
                                            placeholder="Ex: 320"
                                            className="col-span-3"
                                            autoFocus
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Cela aidera pour suivre votre progression.
                                    </FormDescription>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button type="button" variant="destructive" onClick={closeModal}>
                                Annuler
                            </Button>
                            <Button type="submit" disabled={!form.getValues()}>
                                Enregistrer
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}