// gluestack-ui.config.ts
import { config as defaultConfig } from '@gluestack-ui/themed';

export const config = {
  ...defaultConfig,
  tokens: {
    ...defaultConfig.tokens,
    colors: {
      ...defaultConfig.tokens.colors,
      // Brand colors
      primary: '#007AFF',
      primary50: '#E5F1FF',
      primary100: '#CCE3FF',
      primary200: '#99C7FF',
      primary300: '#66ABFF',
      primary400: '#338FFF',
      primary500: '#007AFF',
      primary600: '#0062CC',
      primary700: '#004999',
      primary800: '#003166',
      primary900: '#001833',

      // Custom colors
      brand: {
        50: '#f0f9ff',
        500: '#0ea5e9',
        900: '#0c4a6e',
      },
    },
    fonts: {
      heading: 'Inter-Bold',
      body: 'Inter-Regular',
      mono: 'Courier',
    },
    fontSizes: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 20,
      '2xl': 24,
      '3xl': 30,
      '4xl': 36,
    },
    space: {
      xs: 4,
      sm: 8,
      md: 12,
      lg: 16,
      xl: 20,
      '2xl': 24,
    },
    radii: {
      none: 0,
      sm: 4,
      md: 8,
      lg: 12,
      full: 9999,
    },
  },
  // Component-specific variants
  components: {
    Button: {
      variants: {
        solid: {
          bg: '$primary500',
          _text: {
            color: '$white',
          },
          _hover: {
            bg: '$primary600',
          },
          _pressed: {
            bg: '$primary700',
          },
        },
        outline: {
          borderWidth: 1,
          borderColor: '$primary500',
          bg: 'transparent',
          _text: {
            color: '$primary500',
          },
        },
        ghost: {
          bg: 'transparent',
          _text: {
            color: '$primary500',
          },
        },
      },
    },
  },
};
