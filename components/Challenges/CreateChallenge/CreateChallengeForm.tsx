import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import {BookOpen, Calendar, Clock, Target} from "lucide-react";
import {TbBell} from "react-icons/tb";
import {Input} from "@/components/ui/input";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import {format} from "date-fns";
import {fr} from "date-fns/locale";
import {Calendar as CalendarComponent} from "@/components/ui/calendar";
import {DialogFooter} from "@/components/ui/dialog";
import z from "zod";
import {CreateChallengeSchema} from "@/utils/zod";
import {useChallenges} from "@/hooks/useChallenges";
import {memo} from "react";
import {useChallengeCrudModalStore} from "@/store/challengeCrudModalStore";
import {useUser} from "@/hooks/useUser";
import {useToast} from "@/hooks/use-toast";
import axios from "axios";

const CreateChallengeForm = memo(() => {
    const {setDialogOpen} = useChallengeCrudModalStore();
    const {user} = useUser();
    const {toast} = useToast()
    const {createChallenge} = useChallenges();

    const form = useForm<ChallengeFormValues>({
        resolver: zodResolver(CreateChallengeSchema),
        defaultValues: {
            type: "BOOKS",
            target: 10,
            deadline: new Date(new Date().getFullYear(), 11, 31), // 31 décembre de l'année en cours
        },
    });

    if (!user) return null;


    type ChallengeFormValues = z.infer<typeof CreateChallengeSchema>;

    const handleCreateChallenge = async (data: ChallengeFormValues) => {
        try {
            const response = await createChallenge(data);
            toast({
                title: 'Succès',
                description: "Challenge créé avec succès.",
            })
            if (response) {
                toast({
                    title: 'Succès',
                    description: "Challenge créé avec succès.",
                })
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error?.response?.status === 409) {
                toast({
                    title: 'Erreur',
                    description: "Vous avez déjà un challenge en cours pour cette date avec ce type d'objectif.",
                    variant: 'destructive',
                })
                return
            }
            toast({
                title: 'Erreur',
                description: "Erreur lors de la création du challenge.",
                variant: 'destructive',
            })
        } finally {
            setDialogOpen(false);
            form.reset();
        }
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
                            <FormLabel className="flex items-center">
                                <Target className="w-4 h-4 mr-1"/>
                                Objectif
                            </FormLabel>
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
                            <FormLabel className="flex items-center">
                                <TbBell className="w-4 h-4 mr-1"/>
                                Date limite
                            </FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            variant="outline"
                                            className={cn(
                                                "w-full pl-3 text-left font-normal",
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
                                        disabled={[
                                            {before: new Date(), to: new Date()}, // Désactive aujourd’hui et les jours précédents
                                            ...user.ReadingGoal
                                                .filter(
                                                    goal => !goal.completedAt
                                                        && goal.type === form.watch("type"))
                                                .map(goal => new Date(goal.deadline))
                                            // Désactive les dates de deadline des autres challenges possédant le même type
                                        ]}
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
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}
                            className="hover:bg-black/10 transition-colors">
                        Annuler
                    </Button>
                    <Button type="submit">Créer le challenge</Button>
                </DialogFooter>
            </form>
        </Form>
    );
});

CreateChallengeForm.displayName = "CreateChallengeForm";

export default CreateChallengeForm;