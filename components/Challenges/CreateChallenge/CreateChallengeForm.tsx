import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel} from "@/components/ui/form";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import {BookOpen, Calendar, Clock} from "lucide-react";
import {Input} from "@/components/ui/input";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import {format} from "date-fns";
import {fr} from "date-fns/locale";
import {Calendar as CalendarComponent} from "@/components/ui/calendar";
import {DialogFooter} from "@/components/ui/dialog";
import {mutate} from "swr";
import * as z from "zod";

type Props = {
    user: {
        id: string;
    };
    setIsDialogOpen: (value: boolean) => void;
}

const CreateChallengeForm = ({user, setIsDialogOpen}: Props) => {

    const challengeFormSchema = z.object({
        type: z.enum(["BOOKS", "PAGES", "TIME"]),
        target: z.number().min(1, "La cible doit être d'au moins 1"),
        deadline: z.date().min(new Date(), "La date limite doit être dans le futur"),
    });

    type ChallengeFormValues = z.infer<typeof challengeFormSchema>;

    const handleCreateChallenge = async (data: ChallengeFormValues) => {
        try {
            const response = await fetch('/api/challenges', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: user.id,
                    type: data.type,
                    target: data.target,
                    deadline: data.deadline,
                }),
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la création du challenge');
            }

            setIsDialogOpen(false);
            await mutate(`/api/user/${user.id}`);
        } catch (error) {
            console.error('Erreur:', error);
        }
    };

    const form = useForm<ChallengeFormValues>({
        resolver: zodResolver(challengeFormSchema),
        defaultValues: {
            type: "BOOKS",
            target: 10,
            deadline: new Date(new Date().getFullYear(), 11, 31), // 31 décembre de l'année en cours
        },
    });

    const handleDateChange = (date: Date) => {
        form.setValue("deadline", date);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleCreateChallenge)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="type"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Type de challenge</FormLabel>
                            <FormControl>
                                <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className="flex space-x-4"
                                >
                                    <FormItem className="flex items-center space-x-2">
                                        <FormControl>
                                            <RadioGroupItem value="BOOKS"/>
                                        </FormControl>
                                        <FormLabel className="font-normal cursor-pointer flex items-center">
                                            <BookOpen className="h-4 w-4 mr-2"/>
                                            Livres
                                        </FormLabel>
                                    </FormItem>

                                    <FormItem className="flex items-center space-x-2">
                                        <FormControl>
                                            <RadioGroupItem value="PAGES"/>
                                        </FormControl>
                                        <FormLabel className="font-normal cursor-pointer flex items-center">
                                            <Calendar className="h-4 w-4 mr-2"/>
                                            Pages
                                        </FormLabel>
                                    </FormItem>

                                    <FormItem className="flex items-center space-x-2">
                                        <FormControl>
                                            <RadioGroupItem value="TIME"/>
                                        </FormControl>
                                        <FormLabel className="font-normal cursor-pointer flex items-center">
                                            <Clock className="h-4 w-4 mr-2"/>
                                            Temps (min)
                                        </FormLabel>
                                    </FormItem>
                                </RadioGroup>
                            </FormControl>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="target"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Objectif</FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    min="1"
                                    {...field}
                                    onChange={(e) => field.onChange(parseInt(e.target.value, 10) || 1)}
                                />
                            </FormControl>
                            <FormDescription>
                                {form.watch("type") === "BOOKS" && "Nombre de livres à lire"}
                                {form.watch("type") === "PAGES" && "Nombre de pages à lire"}
                                {form.watch("type") === "TIME" && "Minutes de lecture"}
                            </FormDescription>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="deadline"
                    render={({field}) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Date limite</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            variant="outline"
                                            className={cn(
                                                "w-full pl-3 text-left font-normal hover:bg-transparent",
                                                !field.value && "text-muted-foreground"
                                            )}
                                        >
                                            {field.value ? (
                                                format(field.value, "PPP", {locale: fr})
                                            ) : (
                                                <span>Sélectionner une date</span>
                                            )}
                                            <Calendar className="ml-auto h-4 w-4 opacity-50"/>
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <CalendarComponent
                                        mode="single"
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        disabled={[{before: new Date()}]}
                                        classNames={{
                                            nav_button_previous: "absolute left-1 hover:bg-red-500/50",
                                            nav_button_next: "absolute right-1 hover:bg-green-500/50",
                                        }}
                                        locale={fr}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                            <FormDescription>
                                Date limite pour atteindre votre objectif
                            </FormDescription>
                        </FormItem>
                    )}
                />

                <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                        Annuler
                    </Button>
                    <Button type="submit">Créer le challenge</Button>
                </DialogFooter>
            </form>
        </Form>
    );
};

export default CreateChallengeForm;