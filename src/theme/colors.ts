export const colors = {
  // Primary Colors
  primary: {
    main: '#EF7013',
    secondary: '#FF9890',
    light: '#F9F1EC',
    middle: '#5D47C1',
    dark: '#1A0736',
  },

  // Secondary Colors
  secondary: {
    main: '#9B87F6',
    light: '#E8E3FF',
    middle:'#FFFCF4'
  },

  // Background Colors
  background: {
    default: '#FBF9F9',
    paper: '#FFFFFF',
    subtle: '#F4F4F4',
    darksubtle: '#FFEFDD',
    dark: '#EAEEF2',
  },

  // Border Colors
  border: {
    fade: '#EFDCDA',
    default: '#EBEEFF',
    secondary: '#F2D9C4',
    dark: '#D99994',
    subtle: '#D2D3F3',
    primary: '#DCC2FF',
  },

  // Text Colors
  text: {
    primary: '#050505',
    secondary: '#49526A',
    tertiary: '#828DA9',
    white: '#FFFFFF',
    black:'#191F2D'
  },

  // Status Colors
  status: {
    success: '#2FB763',
    error: '#FC4C5D',
    warning: '#FFB547',
    info: '#3F8CFF',
  },

  // Gradient Colors
  gradient: {
    primary: ['#2B0B4F', '#5D47C1'],
    secondary: ['#E8E3FF', '#F6F8FA'],
  },
} as const;

export type Colors = typeof colors;
export type ColorKeys = keyof typeof colors;

// Helper function to get nested color values
export const getColor = (path: string) => {
  return path.split('.').reduce((obj, key) => obj[key], colors as any);
};

export default colors; 