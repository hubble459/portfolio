import { defineConfig } from 'windicss/helpers';
import colors from 'windicss/colors';
import typography from 'windicss/plugin/typography';

export default defineConfig({
  darkMode: 'class',
  // https://windicss.org/posts/v30.html#attributify-mode
  attributify: true,
  preflight: false,

  plugins: [
    typography(),
    require('@windicss/plugin-question-mark'),
    require('windicss/plugin/line-clamp'),
    require('windicss/plugin/filters'),
    require('@windicss/plugin-scrollbar'),
    require('@windicss/plugin-animations')({
      settings: {
        animatedSpeed: 1000,
        heartBeatSpeed: 1000,
        hingeSpeed: 2000,
        bounceInSpeed: 750,
        bounceOutSpeed: 750,
        animationDelaySpeed: 1000,
      },
    }),
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#B00B69',
          50: '#F9A2D4',
          100: '#F88FCB',
          200: '#F669B9',
          300: '#F342A7',
          400: '#F11C95',
          500: '#D60D80',
          600: '#B00B69',
          700: '#7B084A',
          800: '#46042A',
          900: '#12010A',
        },
        background: {
          DEFAULT: '#121212',
          50: '#BFBFBF',
          100: '#B5B5B5',
          200: '#A1A1A1',
          300: '#8C8C8C',
          400: '#787878',
          500: '#646464',
          600: '#4F4F4F',
          700: '#3B3B3B',
          800: '#262626',
          900: '#121212',
        },
        secondary: {
          DEFAULT: '#2ADEDD',
          50: '#C9F7F6',
          100: '#B7F4F4',
          200: '#94EEEE',
          300: '#71E9E8',
          400: '#4DE3E3',
          500: '#2ADEDD',
          600: '#1CB4B3',
          700: '#148383',
          800: '#0D5352',
          900: '#052222',
        },
      },
      typography: {
        DEFAULT: {
          css: {
            color: 'inherit',
            a: {
              'color': 'inherit',
              'opacity': 0.75,
              'fontWeight': '500',
              'textDecoration': 'underline',
              '&:hover': {
                opacity: 1,
                color: colors.red[600],
              },
            },
            b: { color: 'inherit' },
            strong: { color: 'inherit' },
            em: { color: 'inherit' },
            h1: { color: 'inherit', fontSize: '2rem' },
            h2: { color: 'inherit' },
            h3: { color: 'inherit' },
            h4: { color: 'inherit' },
            code: { color: 'inherit' },
          },
        },
      },
    },
  },
});
