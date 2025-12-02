"use client";

import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {FileText} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {usePageNumberModal} from "@/store/pageNumberModalStore";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {useBooks} from "@/hooks/useBooks";
import {PageNumberSchema} from "@/lib/validators";

export function PageNumberModal() {
    const {showPageNumberModal, setShowPageNumberModal, closeModal, bookId, bookKey} = usePageNumberModal();
    const {updateBookPageCount} = useBooks(null);

    const form = useForm<z.infer<typeof PageNumberSchema>>({
        resolver: zodResolver(PageNumberSchema),
        defaultValues: {
            pageNumber: 0,
        },
    });

    const onSubmit = async (values: z.infer<typeof PageNumberSchema>) => {
        if (bookId && bookKey) {
            await updateBookPageCount(bookId, values.pageNumber);
            closeModal();
            form.reset();
        }
    };

    return (
        <Dialog open={showPageNumberModal} onOpenChange={setShowPageNumberModal}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <FileText className="size-5"/> Nombre de pages
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
                                            value={field.value ?? ""}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                field.onChange(value === "" ? undefined : Number(value));
                                            }}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Cela aidera pour suivre votre progression.
                                    </FormDescription>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <div className="flex justify-end space-x-2">
                            <Button type="button" variant="outline" onClick={closeModal}>Annuler</Button>
                            <Button type="submit">Enregistrer</Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
