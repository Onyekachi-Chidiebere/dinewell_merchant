declare module 'react-native-chart-kit' {
  import { ViewStyle } from 'react-native';

  interface ChartConfig {
    backgroundColor?: string;
    backgroundGradientFrom?: string;
    backgroundGradientTo?: string;
    color?: (opacity?: number) => string;
    style?: ViewStyle;
  }

  interface Dataset {
    data: number[];
    color?: (opacity?: number) => string;
    strokeWidth?: number;
  }

  interface ChartData {
    labels: string[];
    datasets: Dataset[];
  }

  interface LineChartProps {
    data: ChartData;
    width: number;
    height: number;
    chartConfig: ChartConfig;
    bezier?: boolean;
    style?: ViewStyle;
  }

  export class LineChart extends React.Component<LineChartProps> {}
} 