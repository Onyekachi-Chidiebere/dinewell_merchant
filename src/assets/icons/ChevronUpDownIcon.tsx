import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { colors } from '../../theme/colors';

const ChevronUpDownIcon = ({ color = colors.secondary.main, width = 10, height = 12 }) => (
  <Svg width={width} height={height} viewBox="0 0 10 12" fill="none">
    <Path d="M9 4L5 0L1 4" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M1 8L5 12L9 8" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export default ChevronUpDownIcon;
