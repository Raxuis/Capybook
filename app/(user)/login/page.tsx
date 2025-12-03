import LoginForm from "@/components/Auth/LoginForm";
import {Metadata} from "next";
import { getServerUrl } from "@/utils/get-server-url";

const baseUrl = getServerUrl();

export const metadata: Metadata = {
    title: "Connexion Capybook",
    description: "Connectez-vous à votre compte Capybook pour accéder à vos livres et fonctionnalités personnalisées.",
    robots: {
        index: false,
        follow: true,
    },
    openGraph: {
        title: "Connexion Capybook",
        description: "Connectez-vous à votre compte Capybook pour accéder à vos livres et fonctionnalités personnalisées.",
        url: `${baseUrl}/login`,
        siteName: "CapyBook",
        type: "website",
        locale: "fr_FR",
    },
    alternates: {
        canonical: `${baseUrl}/login`,
    },
};

const SignIn = () => {
    return (
        <LoginForm/>
    );
};

export default SignIn;
