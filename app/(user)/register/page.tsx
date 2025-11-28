import RegisterForm from "@/components/Auth/RegisterForm";
import {Metadata} from "next";

export const metadata: Metadata = {
    title: "Inscription Capybook",
    description: "Rejoignez Capybook pour suivre vos lectures, partager vos avis et découvrir de nouveaux livres.",
};

const Register = () => {
    return (
        <RegisterForm/>
    );
};

export default Register;
