/**
 * Color utility functions for generating gradients and manipulating colors
 */

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

/**
 * Color manipulation utilities
 */
export const colorUtils = {
  /**
   * Convert hex color (with or without #) to RGB values
   */
  hexToRGB: (hex: string): RGB => {
    const formattedHex = hex.startsWith('#') ? hex.substring(1) : hex;

    // Handle short formats (e.g., #FFF)
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

  /**
   * Convert RGB values to hex
   */
  rgbToHex: (r: number, g: number, b: number): string => {
    return '#' + [r, g, b]
      .map(x => {
        const hex = Math.max(0, Math.min(255, Math.round(x))).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
      })
      .join('');
  },

  /**
   * Adjust brightness (positive = lighter, negative = darker)
   */
  adjustBrightness: (hex: string, amount: number): string => {
    const rgb = colorUtils.hexToRGB(hex);
    const newR = rgb.r + amount;
    const newG = rgb.g + amount;
    const newB = rgb.b + amount;
    return colorUtils.rgbToHex(newR, newG, newB);
  },

  /**
   * Create complementary color for gradient
   */
  createComplementary: (hex: string, shift: number = 30): string => {
    const rgb = colorUtils.hexToRGB(hex);

    // Hue rotation (simplified version)
    const max = Math.max(rgb.r, rgb.g, rgb.b);
    const min = Math.min(rgb.r, rgb.g, rgb.b);

    if (max === min) {
      // For grays, create contrast
      return colorUtils.adjustBrightness(hex, 60);
    }

    // Otherwise, shift RGB values to create harmonious color
    const newR = rgb.r + shift;
    const newG = rgb.g - shift;
    const newB = rgb.b + shift;

    return colorUtils.rgbToHex(newR, newG, newB);
  }
};

/**
 * Generate CSS classes and styles for gradients based on favorite color
 * @param favoriteColor - User's favorite hexadecimal color (with or without #)
 * @returns Object containing classes and styles for gradients
 */
export const generateGradientClasses = (favoriteColor?: string | null): GradientClasses => {
  if (!favoriteColor) {
    // Default values if no favorite color is defined
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
    // Fallback to default values on error
    return {
      headerGradient: "bg-gradient-to-r from-blue-500 to-purple-600",
      avatarGradient: "bg-gradient-to-br from-blue-400 to-blue-600"
    };
  }
};
