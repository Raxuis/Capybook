import React, {useRef} from 'react';
import {motion, useInView, useScroll, useTransform} from "motion/react";
import {animations} from "@/constants";
import {Button} from "@/components/ui/button";
import {Link} from "next-view-transitions";
import {ChevronRight} from "lucide-react";
import Image from "next/image";

const Hero = () => {
    const {scrollYProgress} = useScroll();

    const heroRef = useRef(null);


    const heroInView = useInView(heroRef, {once: false, margin: "-30%"});


    // Parallax effect for hero image
    const heroImgY = useTransform(scrollYProgress, [0, 0.5], [0, 100]);
    const heroTextY = useTransform(scrollYProgress, [0, 0.5], [0, -50]);

    return (
        <section ref={heroRef}
                 className="relative py-20 overflow-hidden bg-gradient-to-br from-primary/10 to-background">
            <div className="container mx-auto px-4 relative z-10">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <motion.div
                        className="space-y-6"
                        style={{y: heroTextY}}
                        initial="hidden"
                        animate={heroInView ? "visible" : "hidden"}
                        variants={animations.staggerChildren}
                    >
                        <motion.h1
                            className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
                            variants={animations.fadeInUp}
                        >
                            Ne perdez plus le fil de vos lectures !
                        </motion.h1>
                        <motion.p
                            className="text-xl text-muted-foreground"
                            variants={animations.fadeInUp}
                        >
                            Suivez votre progression facilement avec LivreTrack, l&#39;application qui
                            transforme
                            votre expérience de lecture.
                        </motion.p>
                        <motion.div
                            className="flex flex-col sm:flex-row gap-4 pt-4"
                            variants={animations.staggerChildren}
                        >
                            <motion.div variants={animations.fadeInUp} whileHover={{scale: 1.05}}
                                        whileTap={{scale: 0.95}}>
                                <Button size="lg" className="gap-2 bg-secondary hover:bg-secondary/90" asChild>
                                    <Link href="/book-shelf">
                                        Commencer l&#39;aventure
                                    </Link>
                                </Button>
                            </motion.div>
                            <motion.div variants={animations.fadeInUp} whileHover={{scale: 1.05}}
                                        whileTap={{scale: 0.95}}>
                                <Button size="lg" variant="outline"
                                        className="hover:bg-primary/10 hover:text-foreground hover:border-primary"
                                        asChild>
                                    <Link href="/about">
                                        En savoir plus
                                        <ChevronRight className="h-4 w-4"/>
                                    </Link>
                                </Button>
                            </motion.div>
                        </motion.div>
                    </motion.div>

                    <motion.div
                        className="relative h-[500px] flex items-center justify-center"
                        style={{y: heroImgY}}
                        initial={{opacity: 0, x: 100}}
                        animate={heroInView ? {opacity: 1, x: 0} : {opacity: 0, x: 100}}
                        transition={{duration: 0.8, ease: "easeOut"}}
                    >
                        <motion.div
                            className="relative z-10 flex items-center justify-center"
                            whileHover={{scale: 1.05, rotate: -2}}
                            transition={{type: "spring", stiffness: 200}}
                        >
                            <Image
                                src="/landing-page/book.webp"
                                alt="LivreTrack App Mockup"
                                width={300}
                                height={900}
                                className="object-contain rounded-3xl shadow-2xl border-8 border-white dark:border-gray-800 size-full"
                                priority
                            />
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
