import React from 'react';
import {UseFormReturn} from 'react-hook-form';
import {motion} from 'motion/react';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Textarea} from '@/components/ui/textarea';
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from '@/components/ui/form';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {BookNoteType} from '@prisma/client';
import {X, Save, Loader2} from 'lucide-react';
import {getTypeIcon} from '@/utils/bookNotes';
import {NoteFormData} from "@/types";
import {cn} from "@/lib/utils";
import {formatBookNoteType} from "@/utils/format";

interface NoteFormProps {
    form: UseFormReturn<NoteFormData>;
    onSubmit: (data: NoteFormData) => void;
    onCancel: () => void;
    loading: boolean;
    title: string;
    submitText: string;
    isEdit?: boolean;
}

export const NoteForm = ({
                             form,
                             onSubmit,
                             onCancel,
                             loading,
                             title,
                             submitText,
                             isEdit = false,
                         }: NoteFormProps) => {
    return (
        <motion.div
            initial={{opacity: 0, y: -20}}
            animate={{opacity: 1, y: 0}}
            exit={{opacity: 0, y: -20}}
        >
            <Card className={cn(
                "mt-4",
                !isEdit && "border-2 border-dashed border-primary/30")}>
                <CardHeader className="pb-3">

                    <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{title}</CardTitle>
                        <Button variant="ghost" size="sm" onClick={onCancel}>
                            <X className="size-4"/>
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="type"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Type de note</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Sélectionnez un type"/>
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {Object.values(BookNoteType).map((type) => (
                                                    <SelectItem key={type} value={type}>
                                                        <div className="flex items-center gap-2">
                                                            {getTypeIcon(type)}
                                                            {formatBookNoteType(type)}
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="note"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Contenu</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Écrivez votre note ici..."
                                                {...field}
                                                rows={4}
                                                className={isEdit ? "resize-none border-slate-200 bg-white/80" : ""}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            <div className="flex gap-2">
                                <FormField
                                    control={form.control}
                                    name="page"
                                    render={({field}) => (
                                        <FormItem className="w-28">
                                            <FormLabel>
                                                Page
                                                <span className="text-muted-foreground ml-1 text-xs">
                          (Optionnel)
                        </span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    placeholder="Page"
                                                    {...field}
                                                    className={isEdit ? "border-slate-200 bg-white/80" : ""}
                                                />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="chapter"
                                    render={({field}) => (
                                        <FormItem className="flex-1">
                                            <FormLabel>
                                                Chapitre
                                                <span className="text-muted-foreground ml-1 text-xs">
                          (Optionnel)
                        </span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Nom du chapitre"
                                                    {...field}
                                                    className={isEdit ? "border-slate-200 bg-white/80" : ""}
                                                />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="tags"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>
                                            Tags
                                            <span className="text-muted-foreground ml-1 text-xs">
                        (Optionnel)
                      </span>
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Tags séparés par des virgules"
                                                {...field}
                                                className={isEdit ? "border-slate-200 bg-white/80" : ""}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            <div className="flex flex-col gap-2 sm:flex-row">
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className={`flex-1 ${isEdit ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700' : ''}`}
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="mr-2 size-4 animate-spin"/>
                                            {submitText}...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="mr-2 size-4"/>
                                            {submitText}
                                        </>
                                    )}
                                </Button>
                                {isEdit && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={onCancel}
                                        className="flex-1 border-slate-200 bg-white/80 sm:flex-none"
                                    >
                                        Annuler
                                    </Button>
                                )}
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </motion.div>
    );
};