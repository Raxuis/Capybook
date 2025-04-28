import React, { useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "motion/react";
import { animations } from "@/constants";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import { features } from "@/constants/landing-page/features";

const Features = () => {
    const [currentTab, setCurrentTab] = useState("add");
    const featuresRef = useRef(null);
    const featuresInView = useInView(featuresRef, { once: false, margin: "-20%" });

    return (
        <section ref={featuresRef} id="fonctionnalités" className="py-20 bg-background">
            <div className="container mx-auto px-4">
                <motion.div
                    className="text-center mb-16"
                    initial="hidden"
                    animate={featuresInView ? "visible" : "hidden"}
                    variants={animations.staggerChildren}
                >
                    <motion.h2 className="text-3xl md:text-4xl font-bold mb-4" variants={animations.fadeInUp}>
                        Fonctionnalités Clés
                    </motion.h2>
                    <motion.p className="text-xl text-muted-foreground max-w-2xl mx-auto" variants={animations.fadeInUp}>
                        Découvrez comment LivreTrack transforme votre expérience de lecture avec ces fonctionnalités essentielles.
                    </motion.p>
                </motion.div>

                <Tabs defaultValue="add" className="w-full" onValueChange={(value) => setCurrentTab(value)}>
                    <motion.div
                        className="flex justify-center mb-8"
                        initial={{ opacity: 0, y: 30 }}
                        animate={featuresInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full max-w-2xl h-full bg-muted p-2">
                            {features.map(({ key }) => (
                                <motion.div key={key} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex justify-center items-center">
                                    <TabsTrigger value={key}>{key === "add" ? "Ajouter" : key === "track" ? "Progression" : key === "stats" ? "Statistiques" : "Favoris"}</TabsTrigger>
                                </motion.div>
                            ))}
                        </TabsList>
                    </motion.div>

                    <div className="relative min-h-[500px] flex justify-center items-center">
                        <AnimatePresence mode="wait">
                            {features.map(({ key, title, description, icon, points, image }) =>
                                currentTab === key ? (
                                    <motion.div key={key} initial="hidden" animate="visible" exit="exit" variants={animations.tabContentAnimation}>
                                        <TabsContent value={key}>
                                            <div className="grid md:grid-cols-2 gap-8 items-center place-items-center">
                                                <div className="space-y-4 justify-self-start">
                                                    <motion.div className="inline-block p-3 bg-primary/10 rounded-2xl" whileHover={{ scale: 1.1, rotate: 5 }} transition={{ type: "spring", stiffness: 300 }}>
                                                        {icon}
                                                    </motion.div>
                                                    <h3 className="text-2xl font-bold">{title}</h3>
                                                    <p className="text-muted-foreground">{description}</p>
                                                    <motion.ul className="space-y-2" variants={animations.staggerChildren} initial="hidden" animate="visible">
                                                        {points.map((item, index) => (
                                                            <motion.li key={item} className="flex items-center gap-2" variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0, transition: { delay: index * 0.1, duration: 0.5 } } }}>
                                                                <motion.div className="h-2 w-2 rounded-full bg-secondary" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3 + index * 0.1 }}></motion.div>
                                                                <span>{item}</span>
                                                            </motion.li>
                                                        ))}
                                                    </motion.ul>
                                                </div>
                                                <motion.div className="bg-muted rounded-2xl p-6 aspect-square flex items-center justify-center w-1/2 md:justify-self-end" animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} variants={animations.cardHover} initial="rest" whileHover="hover">
                                                    <Image src={image} alt={title} width={400} height={400} className="rounded-xl object-cover size-full" />
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
