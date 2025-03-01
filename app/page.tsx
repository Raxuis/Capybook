"use client";

import Footer from "@/components/Footer";
import Testimonials from "@/components/Homepage/Testimonials";
import Hero from "@/components/Homepage/Hero";
import Features from "@/components/Homepage/Features";

export default function Home() {
    return (
        <>
            <main className="flex-1">
                <Hero/>

                <Features/>

                <Testimonials/>
            </main>

            <Footer/>
        </>
    )
}


// interface FeatureCardProps {
//     icon: LucideIcon;
//     title: string;
//     description: string;
//     delay: number;
// }
//
// Animation d'apparition progressive des éléments
// const FeatureCard = ({
//                          icon: Icon, title, description, delay = 0
//                      }: FeatureCardProps) => {
//     return (
//         <motion.div
//             className="flex flex-col items-center text-center p-6 bg-card rounded-xl shadow-md"
//             initial={{opacity: 0, y: 50}}
//             whileInView={{opacity: 1, y: 0}}
//             viewport={{once: true, margin: "-100px"}}
//             transition={{
//                 duration: 0.5,
//                 delay,
//                 type: "spring",
//                 stiffness: 100
//             }}
//             whileHover={{
//                 y: -10,
//                 boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
//             }}
//         >
//             <div className="mb-4 bg-primary/10 p-3 rounded-full">
//                 <Icon className="h-8 w-8 text-primary"/>
//             </div>
//             <h3 className="text-xl font-bold mb-2">{title}</h3>
//             <p className="text-muted-foreground">{description}</p>
//         </motion.div>
//     );
// };
//
// interface FloatingElementProps {
//     children?: ReactNode;
//     delay?: number;
//     duration?: number;
//     className?: string;
// }
//
// // Animation d'un élément flottant pour décoration
// const FloatingElement = ({
//                              children, delay = 0, duration = 4, className = ""
//                          }: FloatingElementProps) => {
//     return (
//         <motion.div
//             className={className}
//             animate={{
//                 y: [0, -15, 0],
//                 rotate: [0, 5, 0, -5, 0],
//             }}
//             transition={{
//                 duration,
//                 repeat: Infinity,
//                 delay
//             }}
//         >
//             {children}
//         </motion.div>
//     );
// };
