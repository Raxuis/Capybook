import RegisterForm from "@/components/Auth/RegisterForm";
import {Metadata} from "next";
import { getServerUrl } from "@/utils/get-server-url";

const baseUrl = getServerUrl();

export const metadata: Metadata = {
    title: "Inscription Capybook",
    description: "Rejoignez Capybook pour suivre vos lectures, partager vos avis et découvrir de nouveaux livres.",
    robots: {
        index: false,
        follow: true,
    },
    openGraph: {
        title: "Inscription Capybook",
        description: "Rejoignez Capybook pour suivre vos lectures, partager vos avis et découvrir de nouveaux livres.",
        url: `${baseUrl}/register`,
        siteName: "CapyBook",
        type: "website",
        locale: "fr_FR",
    },
    alternates: {
        canonical: `${baseUrl}/register`,
    },
};

const Register = () => {
    return (
        <RegisterForm/>
    );
};

export default Register;
