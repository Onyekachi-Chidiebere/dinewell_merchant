import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import colors from '../theme/colors';
import typography from '../theme/typography';
import { ArrowLeftIcon, ArrowRightIcon } from '../assets/icons';

type RootStackParamList = {
  Legal: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const LegalScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  const menuItems = [
    {
      id: 1,
      title: 'Terms & Conditions',
    },
    {
      id: 2,
      title: 'Policies',
    },
    {
      id: 3,
      title: 'Disclaimer',
    },
    {
      id: 4,
      title: 'FAQs',
    },
  ];

  return (
    <View style={styles.container}>
      
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <ArrowLeftIcon width={24} height={24} color={colors.border.subtle} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Legal</Text>
          </View>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.menuGroup}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
            >
              <View style={styles.menuItemContent}>
                <Text style={styles.menuItemTitle}>{item.title}</Text>
              </View>
                <ArrowRightIcon width={16} height={16} color={colors.border.subtle} />
            </TouchableOpacity>
          ))}
        </View>
      </View>
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
    paddingBottom: 15,
  },
  headerContent: {
    backgroundColor: colors.background.subtle,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 20,
    paddingTop: 80,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 24,
    backgroundColor: colors.background.default,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    ...typography.subtitle1,
    color: colors.text.secondary,
    fontSize: 16,
    fontWeight: '700',
  },
  content: {
    padding: 16,
  },
  menuGroup: {
    gap: 16,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.background.default,
    padding: 12,
    borderRadius: 12,
    borderWidth: 0.4,
    borderColor: colors.border.subtle,
  },
  menuItemContent: {
    gap: 4,
  },
  menuItemTitle: {
    ...typography.subtitle2,
    color: colors.text.primary,
    fontWeight: '600',
  },
 
});

export default LegalScreen; 