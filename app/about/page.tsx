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

export default function AboutPage() {
    return (
        <main className="min-h-screen mb-20">
            {/* Hero Section */}
            <section className="relative py-20 bg-gradient-to-br from-primary/10 to-background">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">
                            À propos de Capybook
                        </h1>
                        <p className="text-xl text-muted-foreground">
                            Nous transformons la façon dont les lecteurs suivent et apprécient leurs lectures, un livre
                            à la fois.
                        </p>
                    </div>
                </div>
            </section>

            {/* Histoire et Mission */}
            <section className="py-16" id="history">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-bold mb-6">{history.title}</h2>
                            <p className="text-lg text-muted-foreground mb-6">
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
                        <div className="relative flex justify-center items-center">
                            <Image
                                src={history.image}
                                alt="Bibliothèque"
                                width={600}
                                height={400}
                                className="rounded-3xl shadow-lg relative z-0"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Services et Fonctionnalités */}
            <section className="py-16 bg-gradient-to-br from-secondary/5 to-background" id="services">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">Nos Services</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {services.map((service, index) => (
                            <Card key={index}
                                  className="relative overflow-hidden group hover:shadow-lg transition-shadow">
                                <CardContent className="p-6">
                                    <div
                                        className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full transform translate-x-8 -translate-y-8"></div>
                                    <div className="relative z-10">
                                        <div
                                            className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                                            {service.icon}
                                        </div>
                                        <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
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
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">Notre Équipe</h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Une équipe passionnée de lecteurs et de développeurs dédiés à créer la meilleure expérience
                            de lecture possible.
                        </p>
                    </div>
                    <div className="flex justify-center">
                        <div className="text-center group">
                            <div className="relative mb-8 inline-block">
                                <motion.div
                                    initial={{ scale: 1 }}
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                    className="relative p-1 rounded-full bg-gradient-to-r from-[#673ab7] via-[#4caf50] to-[#00bcd4]">
                                    <div className="relative rounded-full overflow-hidden w-[280px] h-[280px]">
                                        <Image
                                            src={team[0].image}
                                            alt={team[0].firstName + " " + team[0].lastName}
                                            width={280}
                                            height={280}
                                            className="rounded-full"
                                        />
                                    </div>
                                </motion.div>
                            </div>
                            <h3 className="text-2xl font-semibold mb-2">
                                {team[0].firstName + " " + team[0].lastName}
                            </h3>
                            <p className="text-lg text-muted-foreground mb-2">
                                {
                                    team[0].status
                                }
                            </p>
                            <p className="text-muted-foreground max-w-md mx-auto">
                                {
                                    team[0].description
                                }
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="py-16" id="faq">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-3xl font-bold text-center mb-12">Questions Fréquentes</h2>
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
    );
}