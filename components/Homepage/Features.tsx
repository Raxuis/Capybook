"use client";

import React, {useRef, useState} from "react";
import {AnimatePresence, motion, useInView} from "motion/react";
import {animations} from "@/constants";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import Image from "next/image";
import {features} from "@/constants/landing-page/features";

const Features = () => {
    const [currentTab, setCurrentTab] = useState("add");
    const featuresRef = useRef(null);
    const featuresInView = useInView(featuresRef, {once: false, margin: "-20%"});

    return (
        <section ref={featuresRef} id="fonctionnalités" className="bg-background py-20">
            <div className="container mx-auto px-4">
                <motion.div
                    className="mb-16 text-center"
                    initial="hidden"
                    animate={featuresInView ? "visible" : "hidden"}
                    variants={animations.staggerChildren}
                >
                    <motion.h2 className="mb-4 text-3xl font-bold md:text-4xl" variants={animations.fadeInUp}>
                        Fonctionnalités Clés
                    </motion.h2>
                    <motion.p className="text-muted-foreground mx-auto max-w-2xl text-xl"
                              variants={animations.fadeInUp}>
                        Découvrez comment Capybook transforme votre expérience de lecture avec ces fonctionnalités
                        essentielles.
                    </motion.p>
                </motion.div>

                <Tabs defaultValue="add" className="w-full" onValueChange={(value) => setCurrentTab(value)}>
                    <motion.div
                        className="mb-8 flex justify-center"
                        initial={{opacity: 0, y: 30}}
                        animate={featuresInView ? {opacity: 1, y: 0} : {opacity: 0, y: 30}}
                        transition={{duration: 0.6, delay: 0.2}}
                    >
                        <TabsList className="bg-muted grid size-full max-w-2xl grid-cols-2 p-2 md:grid-cols-4">
                            {features.map(({key, label}) => (
                                <motion.div key={key} whileHover={{scale: 1.05}} whileTap={{scale: 0.95}}
                                            className="flex items-center justify-center">
                                    <TabsTrigger value={key}>
                                        {label}
                                    </TabsTrigger>
                                </motion.div>
                            ))}
                        </TabsList>
                    </motion.div>

                    <div className="relative flex min-h-[500px] items-center justify-center">
                        <AnimatePresence mode="wait">
                            {features.map(({key, title, description, icon, points, image}) =>
                                currentTab === key ? (
                                    <motion.div key={key} initial="hidden" animate="visible" exit="exit"
                                                variants={animations.tabContentAnimation}>
                                        <TabsContent value={key}>
                                            <div className="grid place-items-center gap-8 md:grid-cols-2">
                                                <div className="space-y-4 justify-self-start">
                                                    <motion.div className="bg-primary/10 inline-block rounded-2xl p-3"
                                                                whileHover={{scale: 1.1, rotate: 5}}
                                                                transition={{type: "spring", stiffness: 300}}>
                                                        {icon}
                                                    </motion.div>
                                                    <h3 className="text-2xl font-bold">{title}</h3>
                                                    <p className="text-muted-foreground">{description}</p>
                                                    <motion.ul className="space-y-2"
                                                               variants={animations.staggerChildren} initial="hidden"
                                                               animate="visible">
                                                        {points.map((item, index) => (
                                                            <motion.li key={item} className="flex items-center gap-2"
                                                                       variants={{
                                                                           hidden: {opacity: 0, x: -20},
                                                                           visible: {
                                                                               opacity: 1,
                                                                               x: 0,
                                                                               transition: {
                                                                                   delay: index * 0.1,
                                                                                   duration: 0.5
                                                                               }
                                                                           }
                                                                       }}>
                                                                <motion.div className="bg-secondary size-2 rounded-full"
                                                                            initial={{scale: 0}} animate={{scale: 1}}
                                                                            transition={{delay: 0.3 + index * 0.1}}></motion.div>
                                                                <span>{item}</span>
                                                            </motion.li>
                                                        ))}
                                                    </motion.ul>
                                                </div>
                                                <motion.div
                                                    className="bg-muted flex aspect-square w-3/4 items-center justify-center rounded-2xl p-6 md:w-1/2 md:justify-self-end"
                                                    animate={{opacity: 1, y: 0}}
                                                    transition={{duration: 0.6, delay: 0.3}}
                                                    variants={animations.cardHover} initial="rest" whileHover="hover">
                                                    <Image src={image} alt={title} width={400} height={400}
                                                           className="size-full rounded-xl object-cover"/>
                                                </motion.div>
                                            </div>
                                        </TabsContent>
                                    </motion.div>
                                ) : null
                            )}
                        </AnimatePresence>
                    </div>
                </Tabs>
            </div>
        </section>
    );
};

export default Features;
