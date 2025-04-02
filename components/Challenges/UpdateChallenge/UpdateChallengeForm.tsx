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
    onSubmit: (data: any) => Promise<void>;
    initialData?: ModalData;
    onCancel: () => void;
}

const UpdateChallengeForm = ({onSubmit, initialData, onCancel}: Props) => {
    const {toast} = useToast();
    const {user} = useUser();
    if (!user) return null;
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
                                        <FormLabel className="font-normal flex items-center">
                                            <Book className="w-4 h-4 mr-2"/>
                                            Nombre de livres
                                        </FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                        <FormControl>
                                            <RadioGroupItem value="PAGES"/>
                                        </FormControl>
                                        <FormLabel className="font-normal flex items-center">
                                            <FileText className="w-4 h-4 mr-2"/>
                                            Nombre de pages
                                        </FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                        <FormControl>
                                            <RadioGroupItem value="TIME"/>
                                        </FormControl>
                                        <FormLabel className="font-normal flex items-center">
                                            <Clock className="w-4 h-4 mr-2"/>
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
                                                "w-full pl-3 text-left font-normal hover:bg-transparent",
                                                !field.value && "text-muted-foreground"
                                            )}
                                        >
                                            {field.value ? (
                                                format(field.value, "PPP", {locale: fr})
                                            ) : (
                                                <span>Choisir une date</span>
                                            )}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50"/>
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        disabled={[
                                            { before: new Date(), to: new Date() }, // Désactive aujourd’hui et les jours précédents
                                            ...user.ReadingGoal.map(goal => {
                                                if (goal.id !== initialData?.id) {
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
                    <h3 className="text-sm font-medium mb-2">Progression actuelle</h3>
                    <div className="p-4 bg-slate-50 rounded-lg">
                        {watchType === 'BOOKS' && (
                            <div className="flex flex-col items-center">
                                <div
                                    className="w-full flex flex-wrap gap-2 justify-center max-h-48 overflow-y-auto p-2">
                                    {Array.from({length: Math.min(watchTarget, 30)}).map((_, index) => (
                                        <div
                                            key={index}
                                            className={`relative w-12 h-16 rounded-sm border border-slate-300 shadow-sm transition-all duration-300 transform ${
                                                index < watchProgress
                                                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white scale-105 shadow-md hover:rotate-1 rotate-0'
                                                    : 'bg-white text-slate-400 hover:scale-105 hover:shadow-sm hover:rotate-2 rotate-1'
                                            }`}
                                        >
                                            <div
                                                className={`absolute left-0 top-0 bottom-0 w-1.5 rounded-l-sm ${
                                                    index < watchProgress
                                                        ? 'bg-purple-800'
                                                        : 'bg-slate-200'
                                                }`}
                                            ></div>

                                            <div
                                                className="absolute inset-0 flex flex-col justify-center items-center pl-3 pr-1">
                                                <div
                                                    className={`w-full h-0.5 rounded ${index < watchProgress ? 'bg-white/60' : 'bg-slate-200'} mb-1`}></div>
                                                <div
                                                    className={`w-2/3 h-0.5 rounded ${index < watchProgress ? 'bg-white/60' : 'bg-slate-200'} mb-1`}></div>
                                                <div
                                                    className={`w-3/4 h-0.5 rounded ${index < watchProgress ? 'bg-white/60' : 'bg-slate-200'}`}></div>
                                            </div>

                                            {index < watchProgress && (
                                                <div
                                                    className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-white flex items-center justify-center shadow-sm">
                                                    <svg className="w-2 h-2 text-white" fill="none"
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
                                            className="flex items-center justify-center w-12 h-16 text-slate-500 text-xs font-medium">
                                            +{watchTarget - 30} livres
                                        </div>
                                    )}
                                </div>

                                <div className="mt-4 text-center">
                                    <div className="text-sm font-medium">
                                        {watchProgress} / {watchTarget} livres lus
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
                                    className="relative w-36 h-48 bg-white rounded-md shadow-md overflow-hidden flex items-center justify-center">
                                    <div className="absolute inset-0 bg-gradient-to-br from-white to-slate-50"></div>

                                    <div
                                        className="absolute inset-0 flex flex-col justify-start pt-5 space-y-3 px-3 z-10">
                                        {Array.from({length: 8}).map((_, i) => (
                                            <div
                                                key={i}
                                                className="w-full h-0.5 bg-slate-200 rounded"
                                                style={{opacity: 1 - (i * 0.05)}}
                                            ></div>
                                        ))}
                                    </div>

                                    <div className="absolute top-0 right-0 w-8 h-8">
                                        <div
                                            className="absolute top-0 right-0 w-8 h-8 bg-white shadow-md transform rotate-45 translate-x-4 -translate-y-4"
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
                                        <div className="absolute -top-3 left-0 right-0 h-4 opacity-30">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"
                                                 preserveAspectRatio="none" className="w-full h-full">
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

                                    <div className="absolute bottom-3 right-3 flex items-center z-20">
                                        <div
                                            className="px-2 py-1 rounded text-xs font-mono bg-white text-slate-800 shadow-md"
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
                                    <div className="text-xs text-slate-500 mt-1">
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
                                <div className="relative w-40 h-40">
                                    <div
                                        className="absolute inset-0 rounded-full bg-white shadow-md border border-slate-200"></div>

                                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
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
                                                <stop offset="0%" stopColor="#22c55e"/>  {/* as green-500 */}
                                                <stop offset="100%" stopColor="#16a34a"/> {/* as green-600 */}
                                            </linearGradient>
                                        </defs>
                                    </svg>

                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="relative w-full h-full">
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
                                                className="absolute top-1/2 left-1/2 w-4 h-4 bg-gradient-to-br from-slate-800 to-slate-600 rounded-full transform -translate-x-1/2 -translate-y-1/2 shadow-md border border-slate-700"></div>
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
                                    <div className="text-xs text-slate-500 mt-1">
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

                        <div className="w-full bg-slate-200 rounded-full h-2 mt-4">
                            <div
                                className={cn(
                                    "bg-gradient-to-r h-2 rounded-full",
                                    watchProgress >= watchTarget ? "from-green-500 to-green-600" : "from-indigo-500 to-purple-600"
                                )}
                                style={{width: `${percentage}%`}}
                            ></div>
                        </div>
                        <div className="text-center text-sm mt-1 text-slate-600">
                            {percentage.toFixed(0)}% complété
                        </div>
                    </div>
                </div>

                <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}
                            className="hover:bg-black/10 transition-colors">
                        Annuler
                    </Button>
                    <Button
                        type="submit"
                        className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
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