import { ViewStyle } from 'react-native';
import { StyleProp } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

export default function GradientCard({start, end, children, style, colors, locations }: { start?: { x: number, y: number }, end?: { x: number, y: number }, children: React.ReactNode, style?: StyleProp<ViewStyle>, colors?: string[], locations?: number[] }) {
  return (
    <LinearGradient
      locations={locations || [0, 0.75]} 
      colors={colors || ['#FF9890', '#FFFFFF']} 
      style={style}
      start={start || { x: 0.5, y: -0.5 }}
      end={end || { x: 0.5, y: 1 }}
    >
      {children}
    </LinearGradient>
  );
}
