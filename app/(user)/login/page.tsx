import LoginForm from "@/components/Auth/LoginForm";
import {Metadata} from "next";

export const metadata: Metadata = {
    title: "Connexion Capybook",
    description: "Connectez-vous à votre compte Capybook pour accéder à vos livres et fonctionnalités personnalisées."
};

const SignIn = () => {
    return (
        <LoginForm/>
    );
};

export default SignIn;
