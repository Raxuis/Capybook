import {Metadata} from "next";
import AboutComponent from "@/components/About/AboutComponent";

export const metadata: Metadata = {
    title: "À propos de Capybook",
    description: "Découvrez l'histoire, la mission et l'équipe derrière Capybook.",
};

export default function AboutPage() {
    return (
        <AboutComponent/>
    );
}