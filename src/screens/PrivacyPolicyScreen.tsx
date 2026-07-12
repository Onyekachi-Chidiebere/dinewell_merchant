import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import colors from '../theme/colors';
import typography from '../theme/typography';
import { ArrowLeftIcon } from '../assets/icons';
import { PRIVACY_POLICY } from '../content/privacyPolicy';

type RootStackParamList = {
  Legal: undefined;
  PrivacyPolicy: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const PrivacyPolicyScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { lastUpdated, sections } = PRIVACY_POLICY;

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
            <Text style={styles.headerTitle}>Privacy Policy</Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.lastUpdated}>Last updated: {lastUpdated}</Text>

        {sections.map((section) => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <Text style={styles.sectionBody}>{section.body}</Text>
          </View>
        ))}
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  lastUpdated: {
    ...typography.caption,
    color: colors.text.tertiary,
    marginBottom: 24,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    ...typography.subtitle2,
    color: colors.text.primary,
    fontWeight: '700',
    marginBottom: 8,
  },
  sectionBody: {
    ...typography.body2,
    color: colors.text.secondary,
    lineHeight: 22,
  },
});

export default PrivacyPolicyScreen;
