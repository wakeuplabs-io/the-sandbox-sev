import { type Config } from "tailwindcss";
import daisyui from "daisyui";

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Colores personalizados que se integran con DaisyUI
        'custom-black': '#1b1921',
        'custom-secondary': {
          50: '#FDF9E6',
          100: '#FBF3CC',
          200: '#F7E799',
          300: '#F3DB66',
          400: '#EFCF33',
          500: '#E5C64A', // Color secundario principal
          600: '#B89E3B',
          700: '#8B762C',
          800: '#5E4F1D',
          900: '#31280E',
        },
        'custom-neutral': {
          50: '#F5F5F6',
          100: '#EBEBED',
          200: '#D7D8DB',
          300: '#C3C4C9',
          400: '#AFB0B7',
          500: '#A0A4A7',
          600: '#808388',
          700: '#606269',
          800: '#40414A',
          900: '#20212B',
        },
        'custom-success': {
          50: '#E6F7E6',
          100: '#CCEFCC',
          200: '#99DF99',
          300: '#66CF66',
          400: '#33BF33',
          500: '#04C940',
          600: '#03A133',
          700: '#027926',
          800: '#015119',
          900: '#01280C',
        },
        'custom-error': {
          50: '#FDE6E8',
          100: '#FBCCD1',
          200: '#F799A3',
          300: '#F36675',
          400: '#EF3347',
          500: '#DD4656',
          600: '#B13845',
          700: '#852A34',
          800: '#591C23',
          900: '#2D0E12',
        },
        // Color especial para transparencias
        'glass': '#ffffff1a',
      },
    },
  },
  plugins: [daisyui],
};

export default config;