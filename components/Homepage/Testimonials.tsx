"use client";

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
                 className="from-primary/5 to-background bg-gradient-to-br py-20">
            <div className="container mx-auto px-4">
                <motion.div
                    className="mb-16 text-center"
                    initial="hidden"
                    animate={testimonialsInView ? "visible" : "hidden"}
                    variants={animations.staggerChildren}
                >
                    <motion.h2
                        className="mb-4 text-3xl font-bold md:text-4xl"
                        variants={animations.fadeInUp}
                    >
                        Ce que disent nos utilisateurs / utilisatrices
                    </motion.h2>
                    <motion.p
                        className="text-muted-foreground mx-auto max-w-2xl text-xl"
                        variants={animations.fadeInUp}
                    >
                        Découvrez comment Capybook a transformé les habitudes de lecture de nos utilisateurs
                        et utilisatrices.
                    </motion.p>
                </motion.div>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
                    {/* Featured testimonial */}
                    <motion.div
                        className="md:col-span-6 lg:col-span-5"
                        initial={{opacity: 0, x: -50}}
                        animate={testimonialsInView ? {opacity: 1, x: 0} : {opacity: 0, x: -50}}
                        transition={{duration: 0.3}}
                        whileHover={{scale: 1.01}}
                    >
                        <motion.div
                            className="relative flex h-full flex-col overflow-hidden rounded-3xl bg-white p-8 shadow-xl dark:bg-gray-800"
                            variants={animations.mainTestimonialCardHover}
                            initial="rest"
                            whileHover="hover"
                        >
                            <motion.div
                                className="text-primary/10 absolute -left-6 -top-6"
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
                                <div className="mb-6 flex flex-col items-center gap-4">
                                    <div className="relative">
                                        <motion.div
                                            className="from-primary/30 to-primary size-20 overflow-hidden rounded-full bg-gradient-to-br p-1"
                                            whileHover={{scale: 1.05}}
                                            transition={{type: "spring", stiffness: 300}}
                                        >
                                            <div className="size-full overflow-hidden rounded-full">
                                                <Image
                                                    src={userTestimonials[activeTestimonialIndex].avatar}
                                                    alt={userTestimonials[activeTestimonialIndex].name}
                                                    width={80}
                                                    height={80}
                                                    className="size-full rounded-full object-cover"
                                                />
                                            </div>
                                        </motion.div>
                                        <motion.div
                                            className="bg-primary absolute -bottom-1 -right-1 rounded-full p-1 text-white"
                                            whileHover={{rotate: 15}}
                                        >
                                            <BookOpen size={16}/>
                                        </motion.div>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-lg font-semibold">
                                            {
                                                userTestimonials[activeTestimonialIndex].name
                                            }
                                        </p>
                                        <div className="flex items-center justify-center">
                                            {Array.from({length: userTestimonials[activeTestimonialIndex].rating}).map((_, i) => (
                                                <Star key={i}
                                                      className="size-3 fill-yellow-400 text-yellow-400"/>
                                            ))}
                                        </div>
                                    </div>
                                    <motion.div
                                        className="bg-primary/5 relative mt-2 rounded-xl p-4"
                                        initial={{opacity: 0}}
                                        animate={{opacity: 1}}
                                        transition={{delay: 0.3, duration: 0.8}}
                                    >
                                        <p className="text-lg italic">
                                            {userTestimonials[activeTestimonialIndex].content}
                                        </p>
                                        <div
                                            className="absolute left-1/2 top-0 flex h-8 w-48 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border bg-white sm:w-36 dark:bg-gray-800"
                                        >
                                            <p className="text-primary px-1 text-center text-xs font-medium">
                                                {userTestimonials[activeTestimonialIndex].gender === "male"
                                                    ? "Utilisateur"
                                                    : userTestimonials[activeTestimonialIndex].gender === "female"
                                                        ? "Utilisatrice"
                                                        : "Ici"}{" "}
                                                depuis {userTestimonials[activeTestimonialIndex].time}.
                                            </p>
                                        </div>
                                    </motion.div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Testimonial grid */}
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:col-span-6 lg:col-span-7">
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
                                    className="border-primary/10 hover:border-primary/30 h-full border bg-white/90 backdrop-blur-sm transition-colors dark:bg-gray-800/90">
                                    <CardHeader className="pb-4">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="relative">
                                                    <div
                                                        className="from-primary/20 to-primary/40 size-12 overflow-hidden rounded-full bg-gradient-to-br p-0.5">
                                                        <Image
                                                            src={testimonial.avatar}
                                                            alt={testimonial.name}
                                                            width={48}
                                                            height={48}
                                                            className="size-full rounded-full object-cover"
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <CardTitle
                                                        className="text-base">{testimonial.name}</CardTitle>
                                                    <div className="mt-1 flex items-center">
                                                        {Array.from({length: testimonial.rating}).map((_, i) => (
                                                            <Star key={i}
                                                                  className="size-3 fill-yellow-400 text-yellow-400"/>
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
                                                <Quote className="text-primary/30 size-8"/>
                                            </motion.div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-muted-foreground text-sm leading-relaxed">{testimonial.content}</p>
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
