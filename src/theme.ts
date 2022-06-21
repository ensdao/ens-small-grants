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
      initialColorMode: 'system',
    },
    components: { Button, Link },
    colors: {
      'primary-purple': '#8D6EFF',
      'purple-medium': '#EEEEF7',
      'purple-light': '#F8F7FC',
      'secondary-green': '#67B195',
    },
  },
  withDefaultColorScheme({ colorScheme: 'blue' })
);
