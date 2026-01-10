export const fontFamily = {
  clash: {
    regular: 'ClashDisplay-Regular',
    medium: 'ClashDisplay-Medium',
    semiBold: 'ClashDisplay-Semibold',
    bold: 'ClashDisplay-Bold',
  },
  redHat: {
    regular: 'RedHatDisplay-Regular',
    medium: 'RedHatDisplay-Medium',
    semiBold: 'RedHatDisplay-SemiBold',
    bold: 'RedHatDisplay-Bold',
  },
  maven: {
    regular: 'MavenPro-Regular',
    medium: 'MavenPro-Medium',
    semiBold: 'MavenPro-SemiBold',
    bold: 'MavenPro-Bold',
  },
} as const;

export const typography = {
  h1: {
    fontFamily: fontFamily.clash.bold,
    fontSize: 40,
    lineHeight: 49,
  },
  h2: {
    fontFamily: fontFamily.clash.bold,
    fontSize: 32,
    lineHeight: 39,
  },
  h3: {
    fontFamily: fontFamily.clash.bold,
    fontSize: 24,
    lineHeight: 29,
  },
  h4: {
    fontFamily: fontFamily.clash.medium,
    fontSize: 20,
    lineHeight: 25,
  },
  subtitle1: {
    fontFamily: fontFamily.redHat.semiBold,
    fontSize: 16,
    lineHeight: 21,
    fontWeight:'700',
  },
  subtitle2: {
    fontFamily: fontFamily.redHat.medium,
    fontSize: 14,
    lineHeight: 18,
  },
  body1: {
    fontFamily: fontFamily.redHat.regular,
    fontSize: 16,
    lineHeight: 21,
  },
  body2: {
    fontFamily: fontFamily.redHat.regular,
    fontSize: 12,
    lineHeight: 18,
  },
  caption: {
    fontFamily: fontFamily.redHat.medium,
    fontSize: 12,
    lineHeight: 16,
  },
  overline: {
    fontFamily: fontFamily.redHat.medium,
    fontSize: 10,
    lineHeight: 13,
    textTransform: 'uppercase',
  },
  button: {
    fontFamily: fontFamily.maven.semiBold,
    fontSize: 16,
    fontWeight:'600',
  },
} as const;

export type Typography = typeof typography;
export type TypographyKeys = keyof typeof typography;

export default typography; 