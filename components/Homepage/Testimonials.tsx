import React, {useEffect, useRef, useState} from 'react';
import {motion, useInView} from "motion/react";
import {animations, testimonials} from "@/constants";
import {BookOpen, Quote, Star} from "lucide-react";
import Image from "next/image";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";

const Testimonials = () => {

    const [activeTestimonialIndex, setActiveTestimonialIndex] = useState(0);
    const [intervalDuration, setIntervalDuration] = useState(3000);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const {testimonials: userTestimonials} = testimonials;


    const testimonialsRef = useRef(null);

    const testimonialsInView = useInView(testimonialsRef, {once: false, margin: "-20%"});


    const handleClick = (index: number) => {
        if (intervalRef.current) clearInterval(intervalRef.current);

        setActiveTestimonialIndex(index);
        setTimeout(() => {
            setIntervalDuration(6000);
        }, 1000);
    };

    useEffect(() => {
        if (intervalRef.current) clearInterval(intervalRef.current);

        intervalRef.current = setInterval(() => {
            setActiveTestimonialIndex((prev) => (prev + 1) % userTestimonials.length);
            setIntervalDuration(3000);
        }, intervalDuration);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [intervalDuration, userTestimonials.length]);

    return (
        <section ref={testimonialsRef} id="témoignages"
                 className="py-20 bg-gradient-to-br from-primary/5 to-background">
            <div className="container mx-auto px-4">
                <motion.div
                    className="text-center mb-16"
                    initial="hidden"
                    animate={testimonialsInView ? "visible" : "hidden"}
                    variants={animations.staggerChildren}
                >
                    <motion.h2
                        className="text-3xl md:text-4xl font-bold mb-4"
                        variants={animations.fadeInUp}
                    >
                        Ce que disent nos utilisateurs / utilisatrices
                    </motion.h2>
                    <motion.p
                        className="text-xl text-muted-foreground max-w-2xl mx-auto"
                        variants={animations.fadeInUp}
                    >
                        Découvrez comment LivreTrack a transformé les habitudes de lecture de nos utilisateurs
                        et utilisatrices.
                    </motion.p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                    {/* Featured testimonial */}
                    <motion.div
                        className="md:col-span-6 lg:col-span-5"
                        initial={{opacity: 0, x: -50}}
                        animate={testimonialsInView ? {opacity: 1, x: 0} : {opacity: 0, x: -50}}
                        transition={{duration: 0.3}}
                        whileHover={{scale: 1.01}}
                    >
                        <motion.div
                            className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 h-full flex flex-col relative overflow-hidden"
                            variants={animations.mainTestimonialCardHover}
                            initial="rest"
                            whileHover="hover"
                        >
                            <motion.div
                                className="absolute -top-6 -left-6 text-primary/10"
                                animate={{
                                    rotate: [0, 10, 0],
                                    scale: [1, 1.1, 1]
                                }}
                                transition={{
                                    duration: 5,
                                    repeat: Infinity,
                                    repeatType: "reverse"
                                }}
                            >
                                <Quote size={120}/>
                            </motion.div>
                            <div className="relative z-10">
                                <div className="flex flex-col items-center gap-4 mb-6">
                                    <div className="relative">
                                        <motion.div
                                            className="rounded-full overflow-hidden w-20 h-20 bg-gradient-to-br from-primary/30 to-primary p-1"
                                            whileHover={{scale: 1.05}}
                                            transition={{type: "spring", stiffness: 300}}
                                        >
                                            <div className="w-full h-full rounded-full overflow-hidden">
                                                <Image
                                                    src={userTestimonials[activeTestimonialIndex].avatar}
                                                    alt={userTestimonials[activeTestimonialIndex].name}
                                                    width={80}
                                                    height={80}
                                                    className="rounded-full object-cover w-full h-full"
                                                />
                                            </div>
                                        </motion.div>
                                        <motion.div
                                            className="absolute -right-1 -bottom-1 bg-primary text-white rounded-full p-1"
                                            whileHover={{rotate: 15}}
                                        >
                                            <BookOpen size={16}/>
                                        </motion.div>
                                    </div>
                                    <div className="text-center">
                                        <p className="font-semibold text-lg">
                                            {
                                                userTestimonials[activeTestimonialIndex].name
                                            }
                                        </p>
                                        <div className="flex items-center justify-center">
                                            {Array.from({length: userTestimonials[activeTestimonialIndex].rating}).map((_, i) => (
                                                <Star key={i}
                                                      className="w-3 h-3 text-yellow-400 fill-yellow-400"/>
                                            ))}
                                        </div>
                                    </div>
                                    <motion.div
                                        className="relative bg-primary/5 rounded-xl p-4 mt-2"
                                        initial={{opacity: 0}}
                                        animate={{opacity: 1}}
                                        transition={{delay: 0.3, duration: 0.8}}
                                    >
                                        <p className="text-lg italic">
                                            {
                                                userTestimonials[activeTestimonialIndex].content
                                            }
                                        </p>
                                        <div
                                            className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 border px-4 py-1 rounded-full">
                                            <p className="text-xs text-primary font-medium">
                                                {
                                                    userTestimonials[activeTestimonialIndex].gender === "male" ?
                                                        "Utilisateur"
                                                        : userTestimonials[activeTestimonialIndex].gender === "female"
                                                            ?
                                                            'Utilisatrice'
                                                            : "Ici"
                                                }
                                                {" "} depuis {" "}
                                                {
                                                    userTestimonials[activeTestimonialIndex].time
                                                }.
                                            </p>
                                        </div>
                                    </motion.div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Testimonial grid */}
                    <div className="md:col-span-6 lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {userTestimonials.map((testimonial, index) => (
                            <motion.div
                                key={testimonial.id}
                                initial={{opacity: 0, y: 50}}
                                className="cursor-pointer"
                                onClick={() => handleClick(testimonial.id - 1)}
                                animate={testimonialsInView ? {
                                    opacity: 1,
                                    y: 0,
                                    transition: {
                                        duration: 0.6,
                                        delay: 0.1 * index
                                    }
                                } : {opacity: 0, y: 50}}
                                whileHover={{y: -8}}
                                transition={{type: "spring", stiffness: 200}}
                            >
                                <Card
                                    className="h-full backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 border border-primary/10 hover:border-primary/30 transition-colors">
                                    <CardHeader className="pb-4">
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-center gap-3">
                                                <div className="relative">
                                                    <div
                                                        className="rounded-full overflow-hidden w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/40 p-0.5">
                                                        <Image
                                                            src={testimonial.avatar}
                                                            alt={testimonial.name}
                                                            width={48}
                                                            height={48}
                                                            className="rounded-full object-cover w-full h-full"
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <CardTitle
                                                        className="text-base">{testimonial.name}</CardTitle>
                                                    <div className="flex items-center mt-1">
                                                        {Array.from({length: testimonial.rating}).map((_, i) => (
                                                            <Star key={i}
                                                                  className="w-3 h-3 text-yellow-400 fill-yellow-400"/>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                            <motion.div
                                                animate={{
                                                    rotate: [0, 10, 0]
                                                }}
                                                transition={{
                                                    duration: 4,
                                                    delay: index * 0.5,
                                                    repeat: Infinity,
                                                    repeatType: "reverse"
                                                }}
                                            >
                                                <Quote className="h-8 w-8 text-primary/30"/>
                                            </motion.div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground leading-relaxed">{testimonial.content}</p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
