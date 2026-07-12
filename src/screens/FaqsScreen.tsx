import React, { useState } from 'react';
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
import { ArrowLeftIcon, ChevronDownIcon } from '../assets/icons';
import { FAQS } from '../content/faqs';

type RootStackParamList = {
  Legal: undefined;
  Faqs: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const FaqsScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setExpandedIndex((current) => (current === index ? null : index));
  };

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
            <Text style={styles.headerTitle}>FAQs</Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionLabel}>{FAQS.label}</Text>
        <Text style={styles.title}>{FAQS.title}</Text>

        {FAQS.items.map((item, index) => {
          const isExpanded = expandedIndex === index;

          return (
            <View key={item.question} style={styles.faqItem}>
              <TouchableOpacity
                style={styles.faqQuestion}
                onPress={() => toggleItem(index)}
                activeOpacity={0.7}
              >
                <Text style={styles.questionText}>{item.question}</Text>
                <View style={isExpanded ? styles.chevronExpanded : undefined}>
                  <ChevronDownIcon
                    width={20}
                    height={20}
                    color={colors.text.secondary}
                  />
                </View>
              </TouchableOpacity>
              {isExpanded && (
                <Text style={styles.answerText}>{item.answer}</Text>
              )}
            </View>
          );
        })}
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
  sectionLabel: {
    ...typography.caption,
    color: colors.primary.middle,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  title: {
    ...typography.h3,
    color: colors.text.primary,
    fontWeight: '700',
    marginBottom: 24,
  },
  faqItem: {
    backgroundColor: colors.background.default,
    borderRadius: 12,
    borderWidth: 0.4,
    borderColor: colors.border.subtle,
    marginBottom: 12,
    overflow: 'hidden',
  },
  faqQuestion: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    gap: 12,
  },
  questionText: {
    ...typography.subtitle2,
    color: colors.text.primary,
    fontWeight: '600',
    flex: 1,
  },
  answerText: {
    ...typography.body2,
    color: colors.text.secondary,
    lineHeight: 22,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  chevronExpanded: {
    transform: [{ rotate: '180deg' }],
  },
});

export default FaqsScreen;
