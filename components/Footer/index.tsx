import {footer} from "@/constants/footer";
import Image from "next/image";
import {Link} from "next-view-transitions";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer
            className="bg-gradient-to-br from-slate-50 to-slate-100 pb-32 pt-16 dark:from-slate-900 dark:to-slate-800">
            <div className="container mx-auto px-4">
                <div className="mb-12 flex flex-col items-center justify-between md:flex-row">
                    <div className="mb-8 max-w-md md:mb-0">
                        <div className="mb-4 flex items-center gap-2">
                            <Image
                                src={footer.iconUrl}
                                className="text-primary size-10"
                                width="42"
                                height="42"
                                alt={footer.title}
                            />
                            <span className="text-2xl font-bold tracking-tight">{footer.title}</span>
                        </div>
                        <p className="text-md text-slate-600 dark:text-slate-300">
                            {footer.description}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                        {footer.links
                            .filter((item, index, self) =>
                                (item.isAvailable ?? true) &&
                                index === self.findIndex((i) => i.label === item.label)
                            )
                            .map((item, index) => (
                                <Link
                                    key={index}
                                    href={item.href}
                                    className="group flex items-center transition-all duration-300"
                                    target={item.external ? "_blank" : "_self"}
                                    aria-label={item.label}
                                >
                                    <div
                                        className="group-hover:text-primary mr-2 rounded-full bg-white p-2 shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:shadow-md dark:bg-slate-800">
                                        {item.icon}
                                    </div>
                                    <span
                                        className="group-hover:text-primary text-sm font-medium text-slate-700 transition-colors duration-300 dark:text-slate-200">
                                        {item.label}
                                    </span>
                                </Link>
                            ))}
                    </div>
                </div>

                <div
                    className="flex flex-col items-center justify-between border-t border-slate-200 pt-8 md:flex-row dark:border-slate-700">
                    <p className="mb-4 text-sm text-slate-500 md:mb-0 dark:text-slate-400">
                        © {currentYear} Capybook. Tous droits réservés.
                    </p>
                    {
                        footer.socialNetworksLinks
                            .filter((social, index, self) =>
                                social.isAvailable &&
                                index === self.findIndex((s) => s.type === social.type)
                            ).length > 0 && (
                            <div className="flex space-x-6">
                                {
                                    footer.socialNetworksLinks
                                        .filter((social, index, self) =>
                                            social.isAvailable &&
                                            index === self.findIndex((s) => s.type === social.type)
                                        )
                                        .map((social) => (
                                            <a
                                                key={social.type}
                                                href={social.url}
                                                className="hover:text-primary text-sm text-slate-500 transition-colors duration-300"
                                            >
                                                {social.type}
                                            </a>
                                        ))
                                }
                            </div>
                        )
                    }
                </div>
            </div>
        </footer>
    );
};

export default Footer;