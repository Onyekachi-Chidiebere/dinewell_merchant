import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import colors from '../theme/colors';
import typography from '../theme/typography';
import { ArrowLeftIcon, EmailIcon, PhoneIcon, LocationIcon } from '../assets/icons';

type RootStackParamList = {
  Profile: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const GetHelpScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  const helpItems = [
    {
      id: 1,
      title: 'Have feedback or need support? Send us an Email',
      subtitle: 'support@dinewell.com',
      icon: EmailIcon,
    },
    {
      id: 2,
      title: 'Our agents are available 9am - 5pm',
      subtitle: '09530838430, 048280242',
      icon: PhoneIcon,
    },
    {
      id: 3,
      title: 'Whatsapp support is available 24/7',
      subtitle: '00221144336655',
      icon: PhoneIcon,
    },
    {
      id: 4,
      title: 'Visit us at our Office Address',
      subtitle: 'Somewhere within Ontario, Canada',
      icon: LocationIcon,
    },
  ];

  const renderHelpItem = (item: typeof helpItems[0]) => (
    <TouchableOpacity
      key={item.id}
      style={styles.helpItem}
    >
      <View style={styles.helpItemLeft}>
        <View style={styles.iconContainer}>
          <item.icon width={24} height={24} color={colors.primary.middle} />
        </View>
        <View style={styles.helpItemContent}>
          <Text style={styles.helpItemTitle}>{item.title}</Text>
          <Text style={styles.helpItemSubtitle}>{item.subtitle}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <ArrowLeftIcon width={24} height={24} color={colors.border.subtle} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Get Help</Text>
        </View>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.helpSection}>
          {helpItems.map(renderHelpItem)}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.paper,
  },
  header: {
    backgroundColor: colors.background.darksubtle,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    
    paddingBottom: 16,
  },
  headerContent: {
    paddingTop: 80,
    backgroundColor: colors.background.subtle,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 8,
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.background.paper,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    ...typography.subtitle1,
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: '700',
  },
  content: {
    flex: 1,
  },
  helpSection: {
    padding: 16,
    gap: 8,
  },
  helpItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  helpItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 40,
    backgroundColor: colors.background.subtle,
    justifyContent: 'center',
    alignItems: 'center',
  },
  helpItemContent: {
    gap: 4,
  },
  helpItemTitle: {
    ...typography.subtitle2,
    color: colors.text.primary,
    fontWeight: '600',
  },
  helpItemSubtitle: {
    ...typography.caption,
    color: colors.text.tertiary,
  },
});

export default GetHelpScreen; 