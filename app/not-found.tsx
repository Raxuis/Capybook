import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
    return (
        <div className="bg-background flex flex-col items-center justify-center md:mt-40">
            <Image src="/not-found.webp" alt="Page non trouvée" width={300} height={300}
                   className="w-1/2 md:w-[300px]"/>

            <h1 className="text-primary mb-4 text-4xl font-bold">404</h1>
            <h2 className="text-muted-foreground mb-8 text-2xl">Page non trouvée</h2>
            <p className="text-muted-foreground mb-4 max-w-md text-center max-md:px-2">
                Désolé, la page que vous recherchez n&#39;existe pas ou a été déplacée.
            </p>
            <Link
                href="/"
                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 transition-colors"
            >
                Retour à l&#39;accueil
            </Link>
        </div>
    );
}
