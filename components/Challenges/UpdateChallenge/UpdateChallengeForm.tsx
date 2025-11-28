import {useState} from 'react';
import {useForm} from 'react-hook-form';
import * as z from 'zod';
import {format} from 'date-fns';
import {fr} from 'date-fns/locale';
import {Calendar as CalendarIcon, Clock, Book, FileText} from 'lucide-react';

import {Button} from '@/components/ui/button';
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from '@/components/ui/form';
import {Input} from '@/components/ui/input';
import {Calendar} from '@/components/ui/calendar';
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover';
import {RadioGroup, RadioGroupItem} from '@/components/ui/radio-group';
import {cn} from '@/lib/utils';
import {zodResolver} from "@hookform/resolvers/zod";
import {useToast} from "@/hooks/use-toast";
import {ModalData} from "@/store/challengeCrudModalStore";
import {UpdateChallengeSchema} from "@/utils/zod";
import {useUser} from "@/hooks/useUser";

type Props = {
    onSubmit: (data: z.infer<typeof UpdateChallengeSchema>) => Promise<void>;
    initialData?: ModalData;
    onCancel: () => void;
}

const UpdateChallengeForm = ({onSubmit, initialData, onCancel}: Props) => {
    const {toast} = useToast();
    const {user} = useUser();

    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<z.infer<typeof UpdateChallengeSchema>>({
        resolver: zodResolver(UpdateChallengeSchema),
        defaultValues: {
            type: initialData?.type || 'BOOKS',
            target: initialData?.target || 0,
            progress: initialData?.progress || 0,
            deadline: initialData?.deadline ? new Date(initialData.deadline) : new Date(),
        },
    });

    if (!user) return null;


    const watchType = form.watch('type');
    const watchTarget = form.watch('target');
    const watchProgress = form.watch('progress');

    const percentage = watchTarget > 0 ? Math.min(100, (watchProgress / watchTarget) * 100) : 0;

    const handleFormSubmit = async (values: z.infer<typeof UpdateChallengeSchema>) => {
        setIsSubmitting(true);
        try {
            await onSubmit(values);
            toast({
                title: 'Challenge mis à jour',
                description: 'Votre challenge de lecture a été mis à jour avec succès.',
                variant: 'success',
            });
        } catch (error) {
            toast({
                title: 'Erreur',
                description: 'Une erreur est survenue lors de la mise à jour du challenge.',
                variant: 'destructive',
            });
            console.error('Error updating challenge:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
                {/* Challenge Type Selection */}
                <FormField
                    control={form.control}
                    name="type"
                    render={({field}) => (
                        <FormItem className="space-y-3">
                            <FormLabel>Type de challenge</FormLabel>
                            <FormControl>
                                <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className="flex flex-col space-y-1"
                                >
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                        <FormControl>
                                            <RadioGroupItem value="BOOKS"/>
                                        </FormControl>
                                        <FormLabel className="flex items-center font-normal">
                                            <Book className="mr-2 size-4"/>
                                            Nombre de livres
                                        </FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                        <FormControl>
                                            <RadioGroupItem value="PAGES"/>
                                        </FormControl>
                                        <FormLabel className="flex items-center font-normal">
                                            <FileText className="mr-2 size-4"/>
                                            Nombre de pages
                                        </FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                        <FormControl>
                                            <RadioGroupItem value="TIME"/>
                                        </FormControl>
                                        <FormLabel className="flex items-center font-normal">
                                            <Clock className="mr-2 size-4"/>
                                            Temps de lecture (en minutes)
                                        </FormLabel>
                                    </FormItem>
                                </RadioGroup>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                {/* Target */}
                <FormField
                    control={form.control}
                    name="target"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>
                                {watchType === 'BOOKS' && 'Nombre de livres à lire'}
                                {watchType === 'PAGES' && 'Nombre de pages à lire'}
                                {watchType === 'TIME' && 'Minutes de lecture à atteindre'}
                            </FormLabel>
                            <FormControl>
                                <Input type="number" {...field} min={1}/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                {/* Progress */}
                <FormField
                    control={form.control}
                    name="progress"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>
                                {watchType === 'BOOKS' && 'Nombre de livres lus'}
                                {watchType === 'PAGES' && 'Nombre de pages lues'}
                                {watchType === 'TIME' && 'Minutes de lecture effectuées'}
                            </FormLabel>
                            <FormControl>
                                <Input type="number" {...field} min={0} max={watchTarget}/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                {/* Deadline */}
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
                                            variant={"outline"}
                                            className={cn(
                                                "w-full pl-3 text-left font-normal",
                                                !field.value && "text-muted-foreground"
                                            )}
                                        >
                                            {field.value ? (
                                                format(field.value, "PPP", {locale: fr})
                                            ) : (
                                                <span>Choisir une date</span>
                                            )}
                                            <CalendarIcon className="ml-auto size-4 opacity-50"/>
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        disabled={[
                                            {before: new Date(), to: new Date()}, // Désactive aujourd’hui et les jours précédents
                                            ...user.ReadingGoal.map(goal => {
                                                if (goal.id !== initialData?.id && !goal.completedAt) {
                                                    return new Date(goal.deadline);
                                                }
                                                return [];
                                            }) // Désactive les autres deadlines sans le challenge actuel
                                        ]}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                {/* Progress Visualization */}
                <div className="mt-6">
                    <h3 className="mb-2 text-sm font-medium">Progression actuelle</h3>
                    <div className="rounded-lg bg-slate-50 p-4">
                        {watchType === 'BOOKS' && (
                            <div className="flex flex-col items-center">
                                <div
                                    className="flex max-h-48 w-full flex-wrap justify-center gap-2 overflow-y-auto p-2">
                                    {Array.from({length: Math.min(watchTarget, 30)}).map((_, index) => (
                                        <div
                                            key={index}
                                            className={`relative h-16 w-12 rounded-sm border border-slate-300 shadow-sm transition-all duration-300${
                                                index < watchProgress
                                                    ? 'rotate-0 scale-105 bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md hover:rotate-1'
                                                    : 'rotate-1 bg-white text-slate-400 hover:rotate-2 hover:scale-105 hover:shadow-sm'
                                            }`}
                                        >
                                            <div
                                                className={`absolute inset-y-0 left-0 w-1.5 rounded-l-sm ${
                                                    index < watchProgress
                                                        ? 'bg-purple-800'
                                                        : 'bg-slate-200'
                                                }`}
                                            ></div>

                                            <div
                                                className="absolute inset-0 flex flex-col items-center justify-center pl-3 pr-1">
                                                <div
                                                    className={`h-0.5 w-full rounded ${index < watchProgress ? 'bg-white/60' : 'bg-slate-200'} mb-1`}></div>
                                                <div
                                                    className={`h-0.5 w-2/3 rounded ${index < watchProgress ? 'bg-white/60' : 'bg-slate-200'} mb-1`}></div>
                                                <div
                                                    className={`h-0.5 w-3/4 rounded ${index < watchProgress ? 'bg-white/60' : 'bg-slate-200'}`}></div>
                                            </div>

                                            {index < watchProgress && (
                                                <div
                                                    className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full border-2 border-white bg-green-500 shadow-sm">
                                                    <svg className="size-2 text-white" fill="none"
                                                         stroke="currentColor" viewBox="0 0 24 24"
                                                         xmlns="http://www.w3.org/2000/svg">
                                                        <path strokeLinecap="round" strokeLinejoin="round"
                                                              strokeWidth="4" d="M5 13l4 4L19 7"></path>
                                                    </svg>
                                                </div>
                                            )}
                                        </div>
                                    ))}

                                    {watchTarget > 30 && (
                                        <div
                                            className="flex h-16 w-12 items-center justify-center text-xs font-medium text-slate-500">
                                            +{watchTarget - 30} livres
                                        </div>
                                    )}
                                </div>

                                <div className="mt-4 text-center">
                                    <div className="text-sm font-medium">
                                        {watchProgress} / {watchTarget} livre {
                                        watchProgress > 1 ? 's' : ''
                                    } lu {
                                        watchProgress > 1 ? 's' : ''
                                    }
                                    </div>
                                    <div className="text-xs text-slate-500">
                                        {
                                            watchTarget - watchProgress > 0 ? (
                                                <span>{watchTarget - watchProgress} livre
                                                    {
                                                        watchTarget - watchProgress > 1 ? 's' : ''
                                                    } restant{
                                                        watchTarget - watchProgress > 1 ? 's' : ''
                                                    }
                                                </span>
                                            ) : (
                                                <span className="text-green-500">Challenge terminé !</span>
                                            )
                                        }
                                    </div>
                                </div>
                            </div>
                        )}

                        {watchType === 'PAGES' && (
                            <div className="flex flex-col items-center">
                                <div
                                    className="relative flex h-48 w-36 items-center justify-center overflow-hidden rounded-md bg-white shadow-md">
                                    <div className="absolute inset-0 bg-gradient-to-br from-white to-slate-50"></div>

                                    <div
                                        className="absolute inset-0 z-10 flex flex-col justify-start space-y-3 px-3 pt-5">
                                        {Array.from({length: 8}).map((_, i) => (
                                            <div
                                                key={i}
                                                className="h-0.5 w-full rounded bg-slate-200"
                                                style={{opacity: 1 - (i * 0.05)}}
                                            ></div>
                                        ))}
                                    </div>

                                    <div className="absolute right-0 top-0 size-8">
                                        <div
                                            className="absolute right-0 top-0 size-8 -translate-y-4 translate-x-4 rotate-45 bg-white shadow-md"
                                            style={{
                                                backgroundImage: 'linear-gradient(135deg, rgba(0,0,0,0.05) 0%, rgba(255,255,255,0.3) 100%)'
                                            }}
                                        ></div>
                                    </div>

                                    <div
                                        className={cn(
                                            "absolute bottom-0 left-0 right-0 bg-gradient-to-tr z-0 transition-all duration-500 ease-out",
                                            watchProgress >= watchTarget ? "from-green-500 to-green-600" : "from-indigo-500 to-purple-600"
                                        )}
                                        style={{height: `${percentage}%`}}
                                    >
                                        <div className="absolute inset-x-0 -top-3 h-4 opacity-30">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"
                                                 preserveAspectRatio="none" className="size-full">
                                                <path
                                                    fill="white"
                                                    fillOpacity="1"
                                                    d="M0,96L30,106.7C60,117,120,139,180,133.3C240,128,300,96,360,90.7C420,85,480,107,540,128C600,149,660,171,720,165.3C780,160,840,128,900,122.7C960,117,1020,139,1080,133.3C1140,128,1200,96,1260,80C1320,64,1380,64,1410,64L1440,64L1440,320L1410,320C1380,320,1320,320,1260,320C1200,320,1140,320,1080,320C1020,320,960,320,900,320C840,320,780,320,720,320C660,320,600,320,540,320C480,320,420,320,360,320C300,320,240,320,180,320C120,320,60,320,30,320L0,320Z">
                                                    <animate
                                                        attributeName="d"
                                                        values="
                  M0,96L30,106.7C60,117,120,139,180,133.3C240,128,300,96,360,90.7C420,85,480,107,540,128C600,149,660,171,720,165.3C780,160,840,128,900,122.7C960,117,1020,139,1080,133.3C1140,128,1200,96,1260,80C1320,64,1380,64,1410,64L1440,64L1440,320L1410,320C1380,320,1320,320,1260,320C1200,320,1140,320,1080,320C1020,320,960,320,900,320C840,320,780,320,720,320C660,320,600,320,540,320C480,320,420,320,360,320C300,320,240,320,180,320C120,320,60,320,30,320L0,320Z;

                  M0,160L30,170.7C60,181,120,203,180,192C240,181,300,139,360,133.3C420,128,480,160,540,181.3C600,203,660,213,720,208C780,203,840,181,900,154.7C960,128,1020,96,1080,101.3C1140,107,1200,149,1260,154.7C1320,160,1380,128,1410,112L1440,96L1440,320L1410,320C1380,320,1320,320,1260,320C1200,320,1140,320,1080,320C1020,320,960,320,900,320C840,320,780,320,720,320C660,320,600,320,540,320C480,320,420,320,360,320C300,320,240,320,180,320C120,320,60,320,30,320L0,320Z;

                  M0,96L30,106.7C60,117,120,139,180,133.3C240,128,300,96,360,90.7C420,85,480,107,540,128C600,149,660,171,720,165.3C780,160,840,128,900,122.7C960,117,1020,139,1080,133.3C1140,128,1200,96,1260,80C1320,64,1380,64,1410,64L1440,64L1440,320L1410,320C1380,320,1320,320,1260,320C1200,320,1140,320,1080,320C1020,320,960,320,900,320C840,320,780,320,720,320C660,320,600,320,540,320C480,320,420,320,360,320C300,320,240,320,180,320C120,320,60,320,30,320L0,320Z
                "
                                                        dur="5s"
                                                        repeatCount="indefinite"
                                                    />
                                                </path>
                                            </svg>
                                        </div>
                                    </div>

                                    <div className="absolute bottom-3 right-3 z-20 flex items-center">
                                        <div
                                            className="rounded bg-white px-2 py-1 font-mono text-xs text-slate-800 shadow-md"
                                        >
                                            <span className="font-bold">{watchProgress}</span>
                                            <span className="opacity-70"> / {watchTarget}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-3 text-center">
                                    <div className="text-sm font-medium">
                                        {watchProgress} / {watchTarget} pages lues
                                    </div>
                                    <div className="mt-1 text-xs text-slate-500">
                                        {
                                            watchTarget - watchProgress > 0 ? (
                                                <span>{watchTarget - watchProgress} page
                                                    {
                                                        watchTarget - watchProgress > 1 ? 's' : ''
                                                    }restante{
                                                        watchTarget - watchProgress > 1 ? 's' : ''
                                                    }
                                                </span>
                                            ) : (
                                                <span className="text-green-500">Challenge terminé !</span>
                                            )
                                        }
                                    </div>
                                </div>
                            </div>
                        )}

                        {watchType === 'TIME' && (
                            <div className="flex flex-col items-center">
                                <div className="relative size-40">
                                    <div
                                        className="absolute inset-0 rounded-full border border-slate-200 bg-white shadow-md"></div>

                                    <svg className="absolute inset-0 size-full" viewBox="0 0 100 100">
                                        <circle
                                            cx="50"
                                            cy="50"
                                            r="45"
                                            fill="none"
                                            stroke="#f1f5f9"
                                            strokeWidth="6"
                                        />

                                        <circle
                                            cx="50"
                                            cy="50"
                                            r="45"
                                            fill="none"
                                            stroke={watchProgress >= watchTarget ? "url(#completedGradient)" : "url(#clockGradient)"}
                                            strokeWidth="6"
                                            strokeLinecap="round"
                                            strokeDasharray={`${2 * Math.PI * 45 * percentage / 100} ${2 * Math.PI * 45}`}
                                            transform="rotate(-90, 50, 50)"
                                            className="transition-all duration-700 ease-in-out"
                                        />

                                        <defs>
                                            <linearGradient id="clockGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                                <stop offset="0%" stopColor="#4f46e5"/>
                                                <stop offset="100%" stopColor="#7c3aed"/>
                                            </linearGradient>
                                            <linearGradient id="completedGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                                <stop offset="0%" stopColor="#22c55e"/>
                                                {/* as green-500 */}
                                                <stop offset="100%" stopColor="#16a34a"/>
                                                {/* as green-600 */}
                                            </linearGradient>
                                        </defs>
                                    </svg>

                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="relative size-full">
                                            <div
                                                className={cn(
                                                    "absolute top-1/2 left-1/2 w-1.5 h-14 bg-gradient-to-t rounded-full shadow-md transition-transform duration-500",
                                                    watchProgress >= watchTarget ? 'from-green-500 to-green-600' : 'from-indigo-500 to-purple-600',
                                                )}
                                                style={{
                                                    transformOrigin: 'bottom center',
                                                    transform: `translate(-50%, -100%) rotate(${(percentage / 100) * 360}deg)`
                                                }}
                                            ></div>

                                            <div
                                                className={cn(
                                                    "absolute top-1/2 left-1/2 w-1 h-18 bg-gradient-to-t rounded-full shadow-md transition-transform duration-500",
                                                    watchProgress >= watchTarget ? 'from-green-500 to-green-600' : 'from-indigo-500 to-purple-600',
                                                )}
                                                style={{
                                                    transformOrigin: 'bottom center',
                                                    transform: `translate(-50%, -100%) rotate(${(percentage / 100) * 360 + 30}deg)`
                                                }}
                                            ></div>

                                            <div
                                                className="absolute left-1/2 top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border border-slate-700 bg-gradient-to-br from-slate-800 to-slate-600 shadow-md"></div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4 text-center">
                                    <div className="text-sm font-medium">
                                        {
                                            watchProgress > 0 ? (
                                                <span>{watchProgress} / {watchTarget} minute
                                                    {
                                                        watchProgress > 1 ? 's' : ''
                                                    } lue{
                                                        watchProgress > 1 ? 's' : ''
                                                    }</span>
                                            ) : (
                                                <span>Aucune minute lue</span>
                                            )
                                        }
                                    </div>
                                    <div className="mt-1 text-xs text-slate-500">
                                        {
                                            watchTarget - watchProgress > 0 ? (
                                                <span>{watchTarget - watchProgress} minute
                                                    {
                                                        watchTarget - watchProgress > 1 ? 's' : ''
                                                    } restantes</span>
                                            ) : (
                                                <span className="text-green-500">Challenge terminé !</span>
                                            )
                                        }
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="mt-4 h-2 w-full rounded-full bg-slate-200">
                            <div
                                className={cn(
                                    "bg-gradient-to-r h-2 rounded-full",
                                    watchProgress >= watchTarget ? "from-green-500 to-green-600" : "from-indigo-500 to-purple-600"
                                )}
                                style={{width: `${percentage}%`}}
                            ></div>
                        </div>
                        <div className="mt-1 text-center text-sm text-slate-600">
                            {percentage.toFixed(0)}% complété
                        </div>
                    </div>
                </div>

                <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}
                            className="transition-colors hover:bg-black/10">
                        Annuler
                    </Button>
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Mise à jour...' : 'Mettre à jour'}
                    </Button>
                </div>
            </form>
        </Form>
    );
};

export default UpdateChallengeForm;