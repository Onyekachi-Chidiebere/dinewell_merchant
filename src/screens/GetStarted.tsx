import * as React from "react";
import { Dimensions, Image, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSharedValue } from "react-native-reanimated";
import manage from '../assets/images/manage.png'
import track from '../assets/images/track.png'
import loyal from '../assets/images/loyal.png'
import Carousel, {
  ICarouselInstance,
  Pagination,
} from "react-native-reanimated-carousel";
import colors from "../theme/colors";
import LinearGradient from "react-native-linear-gradient";
const data = [
  {
    id: 1,
    title: "Reward Loyal Customers",
    description: "Easily scan, assign points, and keep diners coming back with a rewarding experience.",
    image: loyal,
  },
  {
    id: 2,
    title: "Track Visits & Redemptions",
    description: "Monitor customer activity and redemptions with real-time insights that boost retention.",
    image: track,
  },
  {
    id: 3,
    title: "Manage Your Loyalty",
    description: "Set up custom rewards, control point values, and grow your brand — all in one place.",
    image: manage,
  },
];
const width = Dimensions.get("window").width;

function GetStarted({ navigation }: { navigation: any }) {
  const ref = React.useRef<ICarouselInstance>(null);
  const progress = useSharedValue<number>(0);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const insets = useSafeAreaInsets();
  const height = Dimensions.get("window").height;
  const usableHeight = height - insets.top - insets.bottom;
  const carouselHeight = Math.min(usableHeight * 0.72, height * 0.75);
  const imageHeight = Math.min(usableHeight * 0.42, height * 0.45);

  const onPressPagination = (index: number) => {
    ref.current?.scrollTo({
      count: index - progress.value,
      animated: true,
    });
  };


  const backgroundColors = ['#9B87F6', '#FFE4AB', '#D4FFC4']
  const gradientColors = ['#FFFFFF', '#FFFFFF', backgroundColors[currentIndex]]
  return (
    <LinearGradient
      colors={gradientColors}
      locations={[0, 0.5, 1]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1.2 }}
      style={{ flex: 1, paddingTop: insets.top, paddingBottom: Math.max(insets.bottom, 8) }}
    >
      <Carousel
        ref={ref}
        width={width}
        height={carouselHeight}
        data={data}
        autoPlay={true}
        autoPlayInterval={3000}
        loop={true}
        onSnapToItem={setCurrentIndex}
        onProgressChange={progress}
        renderItem={({ index, item }) => (
          <View
            style={{
              justifyContent: "space-between",
              alignItems: "center",
              flex: 1,
            }}
          >
            <View style={{ width: width, height: imageHeight, borderBottomEndRadius: 40, borderBottomStartRadius: 40, overflow: "hidden" }}>
              <Image
                source={item.image}
                style={{ width: '100%', height: '100%', objectFit: "cover" }}
              />
            </View>
            <View style={{ flex: 1, justifyContent: "flex-end", alignItems: "center", paddingBottom: 8 }}>
              <Text style={{ fontSize: Math.min(28, width * 0.07), fontWeight: "600", marginHorizontal: 20, textAlign: "center" }}>{item.title}</Text>
              <Text style={{ fontSize: Math.min(16, width * 0.04), color: colors.text.secondary, marginHorizontal: 40, fontWeight: "400", textAlign: "center", marginVertical: 10 }}>{item.description}</Text>
            </View>
          </View>
        )}
      />
      <Pagination.Basic
        progress={progress}
        data={data}
        dotStyle={{ backgroundColor: "#C4CBF2", borderRadius: 50 }}
        activeDotStyle={{ backgroundColor: colors.primary.main }}
        containerStyle={{ gap: 20, marginTop: 10 }}
        onPress={onPressPagination}
      />
      <Pressable style={{ backgroundColor: colors.background.paper, borderRadius: 40, marginHorizontal: 24, marginTop: 12, marginBottom: 12, padding: 15, elevation: 5, shadowColor: colors.text.primary, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84 }} onPress={() => navigation.navigate('Landing')}   >
        <Text style={{ fontSize: 18, color: colors.text.primary, fontWeight: "400", textAlign: "center" }}>Get Started</Text>
      </Pressable>
    </LinearGradient>
  );
}

export default GetStarted;
