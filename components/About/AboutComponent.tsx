"use client";

import Image from "next/image";
import {motion} from "motion/react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import {Card, CardContent} from "@/components/ui/card";
import {faqs, services, team, history} from "@/constants/about";
import Link from "next/link";


const AboutComponent = () => {
    return (
        <main className="mb-20 min-h-screen">
            {/* Hero Section */}
            <section className="from-primary/10 to-background relative bg-gradient-to-br py-20">
                <div className="container mx-auto px-4">
                    <div className="mx-auto max-w-3xl text-center">
                        <h1 className="mb-6 text-4xl font-bold md:text-5xl">
                            À propos de Capybook
                        </h1>
                        <p className="text-muted-foreground text-xl">
                            Nous transformons la façon dont les lecteurs suivent et apprécient leurs lectures, un livre
                            à la fois.
                        </p>
                    </div>
                </div>
            </section>

            {/* Histoire et Mission */}
            <section className="py-16" id="history">
                <div className="container mx-auto px-4">
                    <div className="grid items-center gap-12 md:grid-cols-2">
                        <div>
                            <h2 className="mb-6 text-3xl font-bold">{history.title}</h2>
                            <p className="text-muted-foreground mb-6 text-lg">
                                {history.description}
                            </p>
                            <div className="space-y-4">
                                {
                                    history.list.map((item) => (
                                        <div className="flex items-start gap-3" key={item.title}>
                                            {history.listIcon}
                                            <div>
                                                <h3 className="font-semibold">{item.title}</h3>
                                                <p className="text-muted-foreground">
                                                    {item.description}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                        <div className="relative flex items-center justify-center">
                            <Image
                                src={history.image}
                                alt="Bibliothèque"
                                width={600}
                                height={400}
                                className="relative z-0 rounded-3xl shadow-lg"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Services et Fonctionnalités */}
            <section className="from-secondary/5 to-background bg-gradient-to-br py-16" id="services">
                <div className="container mx-auto px-4">
                    <h2 className="mb-12 text-center text-3xl font-bold">Nos Services</h2>
                    <div className="grid gap-8 md:grid-cols-3">
                        {services.map((service, index) => (
                            <Card key={index}
                                  className="group relative overflow-hidden transition-shadow hover:shadow-lg">
                                <CardContent className="p-6">
                                    <div
                                        className="from-primary/10 absolute right-0 top-0 size-32 -translate-y-8 translate-x-8 rounded-bl-full bg-gradient-to-br to-transparent"></div>
                                    <div className="relative z-10">
                                        <div
                                            className="bg-primary/10 mb-4 flex size-12 items-center justify-center rounded-lg">
                                            {service.icon}
                                        </div>
                                        <h3 className="mb-3 text-xl font-semibold">{service.title}</h3>
                                        <p className="text-muted-foreground">{service.description}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Notre Équipe */}
            <section className="py-16" id="team">
                <div className="container mx-auto px-4">
                    <div className="mb-12 text-center">
                        <h2 className="mb-4 text-3xl font-bold">Notre Équipe</h2>
                        <p className="text-muted-foreground mx-auto max-w-2xl text-xl">
                            Une équipe passionnée de lecteurs et de développeurs dédiés à créer la meilleure expérience
                            de lecture possible.
                        </p>
                    </div>
                    <div className="flex justify-center">
                        <div className="group text-center">
                            <div className="relative mb-8 inline-block">
                                <motion.div
                                    initial={{scale: 1}}
                                    whileHover={{scale: 1.03}}
                                    whileTap={{scale: 1}}
                                    transition={{type: "spring", stiffness: 300}}
                                    className="relative rounded-full bg-gradient-to-r from-[#673ab7] via-[#4caf50] to-[#00bcd4] p-1">
                                    <Link
                                        className="relative size-[280px] overflow-hidden rounded-full block"
                                        href={team[0].link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={team[0].firstName + " " + team[0].lastName}
                                    >
                                        <Image
                                            src={team[0].image}
                                            alt={team[0].firstName + " " + team[0].lastName}
                                            width={280}
                                            height={280}
                                            className="rounded-full"
                                        />
                                    </Link>
                                </motion.div>
                            </div>
                            <h3 className="mb-2 text-2xl font-semibold">{team[0].firstName + " " + team[0].lastName}</h3>
                            <p className="text-muted-foreground mb-2 text-lg">{team[0].status}</p>
                            <p className="text-muted-foreground mx-auto max-w-md">{team[0].description}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ */
            }
            <section className="py-16" id="faq">
                <div className="container mx-auto px-4">
                    <div className="mx-auto max-w-3xl">
                        <h2 className="mb-12 text-center text-3xl font-bold">Questions Fréquentes</h2>
                        <Accordion type="single" collapsible className="w-full">
                            {faqs.map((faq, index) => (
                                <AccordionItem key={index} value={`item-${index}`}>
                                    <AccordionTrigger>{faq.question}</AccordionTrigger>
                                    <AccordionContent>{faq.answer}</AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                </div>
            </section>
        </main>
    )
        ;
};

export default AboutComponent;