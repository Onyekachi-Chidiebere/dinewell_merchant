import React from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions, Alert, ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useCardContext } from '../context/CardContext';
import { CardField } from '@stripe/stripe-react-native';
import { useBottomSheet } from '../context/BottomSheetContext';

const { width } = Dimensions.get('window');

const AddCardContent = ({ onNext }: { onNext?: () => void }) => {
  const { addCard, loading } = useCardContext();
  const { closeSheet } = useBottomSheet();

  const handleNext = async () => {
    try {
      const result = await addCard();

      // On success, mirror AddDish behaviour: close the bottom sheet and then run any next callback
      if (result !== null && result !== undefined) {
        closeSheet();
        onNext?.();
      }
    } catch (e: any) {
      Alert.alert('Card Error', e?.message || 'Failed to add card');
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Card Preview */}
      <View style={styles.previewWrapper}>
        <View style={styles.previewCard}>
          <View style={styles.topBand}>
            <Text style={styles.brandText}>Dine<Text style={{ color: '#F59E0B' }}>Well</Text></Text>
          </View>
          <LinearGradient
            colors={["#E25520", "#D28F0D"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.bottomBand}
          >
            <Text style={styles.maskedNumber}>——— ———— ————</Text>
            <View style={styles.previewBottomRow}>
              <View>
                <Text style={styles.previewLabel}>Expiry Date</Text>
                <Text style={styles.previewValue}>DD/MM</Text>
              </View>
              <View style={{ flex: 1 }} />
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.previewLabel}>CVV</Text>
                <Text style={styles.previewValue}>***</Text>
              </View>
            </View>
          </LinearGradient>
        </View>
      </View>

      {/* Title */}
      <Text style={styles.title}>New Card</Text>

      {/* Stripe Card Element */}
      <CardField
        postalCodeEnabled={false}
        style={styles.cardField}
        placeholders={{ number: 'Card Number' }}
        cardStyle={{
          backgroundColor: '#FFFFFF',
          placeholderColor: '#8B8B9A',
          textColor: '#454B5E',
          borderRadius: 32,
        }}
      />

      {/* Button */}
      <Pressable style={styles.button} onPress={handleNext} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Saving…' : 'Next'}</Text>
      </Pressable>
    </ScrollView>
  );
};

const CARD_RADIUS = 24;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  previewWrapper: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 12,
  },
  previewCard: {
    width: width - 64,
    height: 180,
    borderRadius: CARD_RADIUS,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 8,
    backgroundColor: '#111827',
  },
  topBand: {
    height: 64,
    backgroundColor: '#111827',
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  brandText: {
    color: '#D1D5DB',
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  bottomBand: {
    flex: 1,
    justifyContent: 'space-between',
  },
  maskedNumber: {
    color: '#F3F4F6',
    opacity: 0.9,
    letterSpacing: 3,
    marginTop: 8,
    margin: 16,
  },
  previewBottomRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    margin: 16,
  },
  previewLabel: {
    color: '#F3F4F6',
    fontSize: 12,
    opacity: 0.9,
  },
  previewValue: {
    color: '#FFFFFF',
    fontWeight: '700',
    marginTop: 2,
  },
  title: {
    fontSize: 56,
    fontWeight: '700',
    color: '#454B5E',
    textAlign: 'center',
    letterSpacing: 0.5,
    lineHeight: 60,
    marginVertical: 8,
    textShadowColor: 'rgba(69, 75, 94, 0.18)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 8,
  },
  cardField: {
    width: '100%',
    height: 64,
    marginTop: 12,
    marginBottom: 12,
  },
  button: {
    marginTop: 12,
    marginBottom: 24,
    backgroundColor: '#EF7013',
    height: 64,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#F6BD87',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 4,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 20,
  },
});

export default AddCardContent;