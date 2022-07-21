import { extendTheme, withDefaultColorScheme } from '@chakra-ui/react';
import type { ComponentStyleConfig } from '@chakra-ui/theme';

const Button: ComponentStyleConfig = {
  baseStyle: {
    // For some reason I need both of these to get the gradient
    background: 'linear-gradient(90deg, #8E6FFF 0%, #B87AFF 100%)',
    bgGradient: 'linear(to-r, #8E6FFF, #B87AFF)',

    fontWeight: 'bold',
    borderRadius: 8,
  },
  sizes: {
    sm: {
      fontSize: 'sm',
      py: 2,
      px: 4,
    },
    md: {
      fontSize: 'md',
      py: 3,
      px: 6,
    },
  },
  variants: {
    secondary: {
      background: '#E8E8EA',
      bgGradient: 'none',
      color: '#515152',
      _hover: { background: '#C3C3C3' },
    },
    link: {
      background: 'none',
      bgGradient: 'none',
      color: '#6496F8',
      borderRadius: 0,
      fontWeight: 600,
    },
    connectWallet: {
      color: '#FFF',
      background: 'primary-purple',
      bgGradient: 'none',
      borderRadius: '12px',
      boxShadow: 'rgb(232 232 235) 0px 2px 12px',
      '&:hover': {
        transform: 'translateY(-1px)',
        filter: 'brightness(1.05)',
      },
      '&:active': {
        transform: 'translateY(0px)',
        filter: 'brightness(1)',
      },
      '&:focus': {
        boxShadow: 'rgb(232 232 235) 0px 2px 12px',
      },
    },
    accountButton: {
      background: '#FFF',
      bgGradient: 'none',
      borderRadius: '12px',
      boxShadow: 'rgb(232 232 235) 0px 2px 12px',
      '&:hover': {
        transform: 'translateY(-1px)',
        filter: 'brightness(1.05)',
      },
      '&:active': {
        transform: 'translateY(0px)',
        filter: 'brightness(1)',
      },
      '&:focus': {
        boxShadow: 'rgb(232 232 235) 0px 2px 12px',
      },
    },
  },
};

const Link: ComponentStyleConfig = {
  baseStyle: {
    color: '#6496F8',
    fontSize: '14px',
    fontWeight: 'bold',
  },
};

export const theme = extendTheme(
  {
    config: {
      initialColorMode: 'light',
    },
    components: { Button, Link },
    fonts: {
      heading: "'Satoshi-Variable', sans-sarif",
      body: "'Satoshi-Variable', sans-sarif",
    },
    semanticTokens: {
      colors: {
        white: {
          default: '#FFFFFF',
          _dark: '#000000',
        },
        'primary-purple': '#8D6EFF',
        'purple-medium': {
          default: '#EEEEF7',
          _dark: '#140C14',
        },
        'purple-light': {
          default: '#F8F7FC',
          _dark: '#140C14',
        },
        'secondary-green': '#67B195',
      },
    },
  },
  withDefaultColorScheme({ colorScheme: 'blue' })
);
