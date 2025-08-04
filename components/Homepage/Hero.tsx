"use client";

import React, { useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from "motion/react";
import { animations } from "@/constants";
import { Button } from "@/components/ui/button";
import { Link } from "next-view-transitions";
import { ChevronRight } from "lucide-react";
import Image from "next/image";

const Hero = () => {
  const { scrollYProgress } = useScroll();
  const heroRef = useRef(null);

  const heroInView = useInView(heroRef, { once: false, margin: "-30%" });

  // Parallax effect for hero image
  const heroImgY = useTransform(scrollYProgress, [0, 0.5], [0, 100]);
  const heroTextY = useTransform(scrollYProgress, [0, 0.5], [0, -50]);

  return (
    <section ref={heroRef}
      className="from-primary/10 to-background relative overflow-hidden bg-gradient-to-br py-20">
      <div className="container relative z-10 mx-auto px-4">
        <div className="grid items-center md:grid-cols-2 md:gap-12">
          <motion.div
            className="space-y-6"
            style={{ y: heroTextY }}
            initial="hidden"
            animate={heroInView ? "visible" : "hidden"}
            variants={animations.staggerChildren}
          >
            <motion.h1
              className="text-4xl font-bold leading-tight md:text-5xl lg:text-6xl"
              variants={animations.fadeInUp}
            >
              Ne perdez plus le fil de vos lectures !
            </motion.h1>
            <motion.p
              className="text-muted-foreground text-xl"
              variants={animations.fadeInUp}
            >
              Suivez votre progression facilement avec Capybook, l&#39;application qui
              transforme
              votre expérience de lecture.
            </motion.p>
            <motion.div
              className="flex gap-4 pt-4 max-md:w-full max-md:justify-center"
              variants={animations.staggerChildren}
            >
              <motion.div variants={animations.fadeInUp} whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}>
                <Button size="lg" className="bg-secondary hover:bg-secondary/90 max-md:px-4 max-md:py-3"
                  asChild>
                  <Link href="/book-shelf">
                    Commencer l&#39;aventure
                  </Link>
                </Button>
              </motion.div>
              <motion.div variants={animations.fadeInUp} whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}>
                <Button size="lg" variant="outline"
                  className="hover:bg-primary/10 hover:text-foreground hover:border-primary max-md:px-4 max-md:py-3"
                  asChild>
                  <Link href="/about">
                    En savoir plus
                    <ChevronRight className="size-4" />
                  </Link>
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>

          <div
            className="relative h-[500px] w-full"
          >
            <motion.div
              className="relative flex h-[500px] items-center justify-center"
              style={{ y: heroImgY }}
              initial={{ opacity: 0, x: 100 }}
              animate={heroInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 100 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.div
                className="relative z-10 flex cursor-grab items-center justify-center rounded-3xl active:cursor-grabbing"
                whileHover={{
                  scale: 1.05,
                  rotate: -2,
                  transition: { type: "spring", stiffness: 300, damping: 20 }
                }}
                whileTap={{
                  scale: 0.98,
                  transition: { duration: 0.1 }
                }}
                drag
                dragConstraints={heroRef}
                dragElastic={0.2}
                dragMomentum={true}
                dragTransition={{
                  bounceStiffness: 300,
                  bounceDamping: 20,
                  power: 0.2,
                  timeConstant: 750
                }}
                whileDrag={{
                  scale: 1.08,
                  rotate: -3,
                  zIndex: 50,
                  boxShadow: "0 35px 60px -12px rgba(0, 0, 0, 0.4)",
                  filter: "brightness(1.1) saturate(1.2)",
                  transition: {
                    type: "spring",
                    stiffness: 400,
                    damping: 25
                  }
                }}
                onDragStart={() => {
                  // Ajout d'un feedback haptic si sur mobile
                  if (typeof navigator !== "undefined" && navigator.vibrate) {
                    navigator.vibrate(50);
                  }
                }}
                onDragEnd={() => {
                  return {
                    scale: 1.02,
                    rotate: 0,
                    filter: "brightness(1) saturate(1)",
                    transition: {
                      type: "spring",
                      stiffness: 200,
                      damping: 15,
                      duration: 0.6
                    }
                  }
                }}
              >
                <Image
                  src="/landing-page/book.webp"
                  alt="Capybook App Mockup"
                  width={300}
                  height={900}
                  className="pointer-events-none size-full rounded-3xl border-8 border-white object-contain shadow-2xl dark:border-gray-800"
                  priority
                />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
