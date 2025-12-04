import {Metadata} from "next";
import AboutComponent from "@/components/About/AboutComponent";
import { getServerUrl } from "@/utils/get-server-url";

const baseUrl = getServerUrl();

export const metadata: Metadata = {
    title: "À propos de Capybook",
    description: "Découvrez l'histoire, la mission et l'équipe derrière Capybook. Apprenez comment nous aidons les lecteurs à suivre leur progression et à découvrir de nouvelles lectures.",
    openGraph: {
        title: "À propos de Capybook",
        description: "Découvrez l'histoire, la mission et l'équipe derrière Capybook.",
        url: `${baseUrl}/about`,
        siteName: "CapyBook",
        type: "website",
        locale: "fr_FR",
    },
    twitter: {
        card: "summary",
        title: "À propos de Capybook",
        description: "Découvrez l'histoire, la mission et l'équipe derrière Capybook.",
    },
    alternates: {
        canonical: `${baseUrl}/about`,
    },
};

export default function AboutPage() {
    return (
        <AboutComponent/>
    );
}
