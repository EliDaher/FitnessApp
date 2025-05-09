import { create } from 'twrnc';
import {
  primaryColors,
  secondaryColors,
  warningColors,
  dangerColors
} from './assets/theme/colors'; // غيّر المسار حسب مكان الملف

export const twDark = create({
  theme: {
    extend: {
      colors: {
        primary: primaryColors,
        secondary: secondaryColors,
        warning: warningColors,
        danger: dangerColors,
        background: {
          500: '#000314',
        },
        text: {
          500: '#EEEEFF',
        },
        white: '#000000',
        black: '#ffffff',
      },
      fontFamily: {
        'urbanist': ['Urbanist', 'sans-serif'],
        'urbanist-bold': ['Urbanist-Bold', 'sans-serif'],
        'urbanist-italic': ['Urbanist-Italic', 'sans-serif'],
      },
    },
  },
});

export const twLight = create({
  theme: {
    extend: {
      colors: {
        primary: primaryColors,
        secondary: secondaryColors,
        warning: warningColors,
        danger: dangerColors,
        background: {
          500: '#EEEEFF',
        },
        text: {
          500: '#000314',
        },
      },
      fontFamily: {
        'urbanist': ['Urbanist', 'sans-serif'],
        'urbanist-bold': ['Urbanist-Bold', 'sans-serif'],
        'urbanist-italic': ['Urbanist-Italic', 'sans-serif'],
      },
    },
  },
});
