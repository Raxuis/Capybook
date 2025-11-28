// Interfaces pour les types
interface RGB {
    r: number;
    g: number;
    b: number;
}

interface GradientClasses {
    headerGradient: string;
    headerGradientStyle?: {
        backgroundImage: string;
    };
    avatarGradient: string;
    avatarGradientStyle?: {
        backgroundImage: string;
    };
}

// Utilitaires de manipulation de couleurs
export const colorUtils = {
    // Convertit un hex (avec ou sans #) en valeurs RGB
    hexToRGB: (hex: string): RGB => {
        const formattedHex = hex.startsWith('#') ? hex.substring(1) : hex;

        // Gérer les formats raccourcis (ex: #FFF)
        const r = formattedHex.length === 3
            ? parseInt(formattedHex[0] + formattedHex[0], 16)
            : parseInt(formattedHex.substring(0, 2), 16);

        const g = formattedHex.length === 3
            ? parseInt(formattedHex[1] + formattedHex[1], 16)
            : parseInt(formattedHex.substring(2, 4), 16);

        const b = formattedHex.length === 3
            ? parseInt(formattedHex[2] + formattedHex[2], 16)
            : parseInt(formattedHex.substring(4, 6), 16);

        return { r, g, b };
    },

    // Convertit des valeurs RGB en hex
    rgbToHex: (r: number, g: number, b: number): string => {
        return '#' + [r, g, b]
            .map(x => {
                const hex = Math.max(0, Math.min(255, Math.round(x))).toString(16);
                return hex.length === 1 ? '0' + hex : hex;
            })
            .join('');
    },

    // Ajuste la luminosité (positif = plus clair, négatif = plus foncé)
    adjustBrightness: (hex: string, amount: number): string => {
        const rgb = colorUtils.hexToRGB(hex);
        const newR = rgb.r + amount;
        const newG = rgb.g + amount;
        const newB = rgb.b + amount;
        return colorUtils.rgbToHex(newR, newG, newB);
    },

    // Crée une teinte complémentaire pour le gradient
    createComplementary: (hex: string, shift: number = 30): string => {
        const rgb = colorUtils.hexToRGB(hex);

        // Rotation de la teinte (version simplifiée)
        const max = Math.max(rgb.r, rgb.g, rgb.b);
        const min = Math.min(rgb.r, rgb.g, rgb.b);

        if (max === min) {
            // Pour les gris, créer un contraste
            return colorUtils.adjustBrightness(hex, 60);
        }

        // Sinon, décaler les valeurs RGB pour créer une couleur harmonieuse
        const newR = rgb.r + shift;
        const newG = rgb.g - shift;
        const newB = rgb.b + shift;

        return colorUtils.rgbToHex(newR, newG, newB);
    }
};

/**
 * Génère les classes CSS et styles pour les gradients basés sur la couleur favorite
 * @param favoriteColor - Couleur hexadécimale favorite de l'utilisateur (avec ou sans #)
 * @returns Objet contenant les classes et styles pour les gradients
 */
export const generateGradientClasses = (favoriteColor?: string | null): GradientClasses => {
    if (!favoriteColor) {
        // Valeurs par défaut si aucune couleur favorite n'est définie
        return {
            headerGradient: "bg-gradient-to-r from-blue-500 to-purple-600",
            avatarGradient: "bg-gradient-to-br from-blue-400 to-blue-600"
        };
    }

    try {
        const complementaryColor = colorUtils.createComplementary(favoriteColor);
        const lighterColor = colorUtils.adjustBrightness(favoriteColor, 20);

        return {
            headerGradient: "bg-gradient-to-r",
            headerGradientStyle: {
                backgroundImage: `linear-gradient(to right, ${favoriteColor}, ${complementaryColor})`
            },
            avatarGradient: "bg-gradient-to-br",
            avatarGradientStyle: {
                backgroundImage: `linear-gradient(to bottom right, ${lighterColor}, ${favoriteColor})`
            }
        };
    } catch (e) {
        console.error("Error generating gradient from favorite color:", e);
        // Fallback aux valeurs par défaut en cas d'erreur
        return {
            headerGradient: "bg-gradient-to-r from-blue-500 to-purple-600",
            avatarGradient: "bg-gradient-to-br from-blue-400 to-blue-600"
        };
    }
};