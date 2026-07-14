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
import { ABOUT_DINEWELL } from '../content/aboutDineWell';

type RootStackParamList = {
  AboutDineWell: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const AboutDineWellScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { missionLabel, title, tagline, story, values, team, company, bn } = ABOUT_DINEWELL;

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
            <Text style={styles.headerTitle}>About DineWell</Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroCard}>
          <Text style={styles.missionLabel}>{missionLabel}</Text>
          <Text style={styles.heroTitle}>{title}</Text>
          <Text style={styles.heroTagline}>{tagline}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{story.title}</Text>
          {story.paragraphs.map((paragraph) => (
            <Text key={paragraph} style={styles.sectionBody}>
              {paragraph}
            </Text>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{values.title}</Text>
          <Text style={styles.sectionSubtitle}>{values.subtitle}</Text>
          <View style={styles.cardGrid}>
            {values.items.map((value) => (
              <View key={value.title} style={styles.valueCard}>
                <Text style={styles.valueTitle}>{value.title}</Text>
                <Text style={styles.valueBody}>{value.body}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{team.title}</Text>
          <Text style={styles.sectionSubtitle}>{team.subtitle}</Text>
          <View style={styles.teamGrid}>
            {team.members.map((member) => (
              <View key={member.name} style={styles.teamCard}>
                <View style={styles.teamAvatar}>
                  <Text style={styles.teamInitials}>{member.initials}</Text>
                </View>
                <Text style={styles.teamName}>{member.name}</Text>
                <Text style={styles.teamRole}>{member.role}</Text>
              </View>
            ))}
          </View>
        </View>

        <Text style={styles.footer}>
          © 2026 {company} · BN: {bn}
        </Text>
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
  heroCard: {
    backgroundColor: colors.background.default,
    borderRadius: 16,
    borderWidth: 0.4,
    borderColor: colors.border.subtle,
    padding: 20,
    marginBottom: 24,
  },
  missionLabel: {
    ...typography.caption,
    color: colors.primary.main,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  heroTitle: {
    ...typography.h4,
    color: colors.text.primary,
    fontWeight: '700',
    marginBottom: 10,
  },
  heroTagline: {
    ...typography.body2,
    color: colors.text.secondary,
    lineHeight: 22,
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    ...typography.subtitle1,
    color: colors.text.primary,
    fontWeight: '700',
    marginBottom: 8,
  },
  sectionSubtitle: {
    ...typography.body2,
    color: colors.text.tertiary,
    marginBottom: 16,
    lineHeight: 22,
  },
  sectionBody: {
    ...typography.body2,
    color: colors.text.secondary,
    lineHeight: 22,
    marginBottom: 12,
  },
  cardGrid: {
    gap: 12,
  },
  valueCard: {
    backgroundColor: colors.background.default,
    borderRadius: 12,
    borderWidth: 0.4,
    borderColor: colors.border.subtle,
    padding: 16,
  },
  valueTitle: {
    ...typography.subtitle2,
    color: colors.text.primary,
    fontWeight: '700',
    marginBottom: 6,
  },
  valueBody: {
    ...typography.body2,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  teamGrid: {
    gap: 12,
  },
  teamCard: {
    backgroundColor: colors.background.default,
    borderRadius: 12,
    borderWidth: 0.4,
    borderColor: colors.border.subtle,
    padding: 16,
    alignItems: 'center',
  },
  teamAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.background.subtle,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  teamInitials: {
    ...typography.subtitle1,
    color: colors.primary.main,
    fontWeight: '700',
  },
  teamName: {
    ...typography.subtitle2,
    color: colors.text.primary,
    fontWeight: '700',
    marginBottom: 4,
  },
  teamRole: {
    ...typography.caption,
    color: colors.text.tertiary,
    textAlign: 'center',
  },
  footer: {
    ...typography.caption,
    color: colors.text.tertiary,
    textAlign: 'center',
    marginTop: 8,
  },
});

export default AboutDineWellScreen;
