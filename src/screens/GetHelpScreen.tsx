import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
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
      title: 'Email',
      subtitle: 'hello@dinewell.ca',
      note: 'Reply within 24 hrs',
      icon: EmailIcon,
      onPress: () => Linking.openURL('mailto:hello@dinewell.ca'),
    },
    {
      id: 2,
      title: 'Phone',
      subtitle: '+1 (306) 555-1234',
      note: 'Mon – Fri, 9 AM – 6 PM CST',
      icon: PhoneIcon,
      onPress: () => Linking.openURL('tel:+13065551234'),
    },
    {
      id: 3,
      title: 'Office',
      subtitle: '3502 Green Brook Rd, Regina, SK S4V 1R5',
      note: 'Canada',
      icon: LocationIcon,
    },
    {
      id: 4,
      title: 'Partnerships',
      subtitle: 'hello@dinewell.ca',
      note: 'Venue & business inquiries',
      icon: EmailIcon,
      onPress: () => Linking.openURL('mailto:hello@dinewell.ca'),
    },
  ];

  const renderHelpItem = (item: typeof helpItems[0]) => (
    <TouchableOpacity
      key={item.id}
      style={styles.helpItem}
      onPress={item.onPress}
      disabled={!item.onPress}
      activeOpacity={item.onPress ? 0.7 : 1}
    >
      <View style={styles.helpItemLeft}>
        <View style={styles.iconContainer}>
          <item.icon width={24} height={24} color={colors.primary.middle} />
        </View>
        <View style={styles.helpItemContent}>
          <Text style={styles.helpItemTitle}>{item.title}</Text>
          <Text style={styles.helpItemSubtitle}>{item.subtitle}</Text>
          {item.note ? <Text style={styles.helpItemNote}>{item.note}</Text> : null}
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
    color: colors.text.secondary,
    fontWeight: '500',
  },
  helpItemNote: {
    ...typography.caption,
    color: colors.text.tertiary,
  },
});

export default GetHelpScreen; 