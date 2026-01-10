import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { colors } from '../../theme/colors';

const ChevronDownIcon = ({ color = colors.secondary.main, width = 10, height = 6 }) => (
  <Svg width={width} height={height} viewBox="0 0 10 6" fill="none">
    <Path d="M1 1L5 5L9 1" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export default ChevronDownIcon;
