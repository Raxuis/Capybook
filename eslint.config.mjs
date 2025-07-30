import tailwind from "eslint-plugin-tailwindcss";
import {dirname} from "path";
import {fileURLToPath} from "url";
import {FlatCompat} from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
});

// Combine all config entries into one export
export default [
    // Next.js + TypeScript rules
    ...compat.extends("next/core-web-vitals", "next/typescript"),

    // TailwindCSS plugin with flat config
    ...tailwind.configs["flat/recommended"],

    // Tailwind settings override/customization
    {
        settings: {
            tailwindcss: {
                callees: ["classnames", "clsx", "ctl"],
                config: "tailwind.config.js",
                cssFiles: [
                    "**/*.css",
                    "!**/node_modules",
                    "!**/.*",
                    "!**/dist",
                    "!**/build",
                ],
                cssFilesRefreshRate: 5_000,
                removeDuplicates: true,
                skipClassAttribute: false,
                whitelist: [],
                tags: [],
                classRegex: "^class(Name)?$",
            },
        },
    },
];
