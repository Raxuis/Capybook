import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
    return (
        <div className="md:mt-40 flex flex-col items-center justify-center bg-background">
            <Image src="/not-found.webp" alt="Page non trouvée" width={300} height={300}
                   className="w-1/2 md:w-[300px]"/>

            <h1 className="text-4xl font-bold text-primary mb-4">404</h1>
            <h2 className="text-2xl text-muted-foreground mb-8">Page non trouvée</h2>
            <p className="text-muted-foreground mb-4 text-center max-w-md max-md:px-2">
                Désolé, la page que vous recherchez n&#39;existe pas ou a été déplacée.
            </p>
            <Link
                href="/"
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
                Retour à l&#39;accueil
            </Link>
        </div>
    );
}
