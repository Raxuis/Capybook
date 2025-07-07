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
                            <X className="h-4 w-4"/>
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
                                                            {type}
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
                                                className={isEdit ? "bg-white/80 border-slate-200 resize-none" : ""}
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
                                                <span className="text-xs text-muted-foreground ml-1">
                          (Optionnel)
                        </span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    placeholder="Page"
                                                    {...field}
                                                    className={isEdit ? "bg-white/80 border-slate-200" : ""}
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
                                                <span className="text-xs text-muted-foreground ml-1">
                          (Optionnel)
                        </span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Nom du chapitre"
                                                    {...field}
                                                    className={isEdit ? "bg-white/80 border-slate-200" : ""}
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
                                            <span className="text-xs text-muted-foreground ml-1">
                        (Optionnel)
                      </span>
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Tags séparés par des virgules"
                                                {...field}
                                                className={isEdit ? "bg-white/80 border-slate-200" : ""}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            <div className="flex flex-col sm:flex-row gap-2">
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className={`flex-1 ${isEdit ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white' : ''}`}
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin"/>
                                            {submitText}...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="h-4 w-4 mr-2"/>
                                            {submitText}
                                        </>
                                    )}
                                </Button>
                                {isEdit && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={onCancel}
                                        className="flex-1 sm:flex-none bg-white/80 border-slate-200"
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