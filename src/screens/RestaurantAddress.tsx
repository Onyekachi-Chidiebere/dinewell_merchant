import React, { useEffect } from 'react';
import {
  Text,
  StyleSheet,
  SafeAreaView,
  View,
  TextInput,
  TouchableOpacity,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import colors from '../theme/colors';
import BackButton from '../components/BackButton';
import { useSignupContext } from '../context/SignupContext';

const { width, height } = Dimensions.get('window');
const titleSize = Math.min(48, width * 0.11);

const RestaurantAddress = ({ navigation, route }: { navigation: any; route?: any }) => {
  const {
    restaurantDetails,
    handleRestaurantDetails,
    submitAddress,
    ensureMerchantId,
    loading,
  } = useSignupContext();
  const routeMerchantId = route?.params?.merchantId;

  useEffect(() => {
    ensureMerchantId(routeMerchantId);
  }, [routeMerchantId, ensureMerchantId]);

  const handleNext = async () => {
    try {
      const result = await submitAddress(routeMerchantId);
      navigation.navigate('RestaurantPictures', {
        merchantId: result?.merchantId ?? routeMerchantId,
      });
    } catch (err) {
      // Toast already shown in hook
    }
  };

  return (
    <LinearGradient
      colors={['#F6BD87', '#FFF6ED', '#FFFFFF']}
      locations={[0, 0.45, 1]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.container}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 8 : 0}
        >
          <View style={styles.backButtonWrapper}>
            <BackButton />
          </View>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            <View style={styles.headerWrapper}>
              <Text style={styles.title}>{'Your\nAddress'}</Text>
            </View>
            <View style={styles.formWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Street Number"
                placeholderTextColor="#8B8B9A"
                value={restaurantDetails.streetNumber || ''}
                onChangeText={(value) => handleRestaurantDetails({ name: 'streetNumber', value })}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TextInput
                style={styles.input}
                placeholder="Street Name"
                placeholderTextColor="#8B8B9A"
                value={restaurantDetails.streetName || ''}
                onChangeText={(value) => handleRestaurantDetails({ name: 'streetName', value })}
                autoCapitalize="words"
                autoCorrect={false}
              />
              <TextInput
                style={styles.input}
                placeholder="Area"
                placeholderTextColor="#8B8B9A"
                value={restaurantDetails.area || ''}
                onChangeText={(value) => handleRestaurantDetails({ name: 'area', value })}
                autoCapitalize="words"
                autoCorrect={false}
              />
            </View>
            <View style={styles.bottomWrapper}>
              <TouchableOpacity
                onPress={handleNext}
                style={[styles.button, loading && styles.buttonDisabled]}
                activeOpacity={0.8}
                disabled={loading}
              >
                <Text style={styles.buttonText}>{loading ? 'Loading...' : 'Next'}</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default RestaurantAddress;

const styles = StyleSheet.create({
  backButtonWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingBottom: 24,
  },
  headerWrapper: {
    alignItems: 'center',
    marginTop: Math.min(height * 0.05, 40),
    paddingHorizontal: 16,
  },
  title: {
    fontSize: titleSize,
    fontWeight: '700',
    color: '#454B5E',
    textAlign: 'center',
    letterSpacing: 0.5,
    lineHeight: titleSize + 4,
    textShadowColor: 'rgba(69, 75, 94, 0.18)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 8,
  },
  formWrapper: {
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 16,
  },
  input: {
    width: width - 40,
    minHeight: 56,
    backgroundColor: '#fff',
    borderRadius: 28,
    borderWidth: 1,
    borderColor: '#EAD9D1',
    paddingHorizontal: 24,
    fontSize: 17,
    fontStyle: 'italic',
    color: '#454B5E',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  bottomWrapper: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 16,
  },
  button: {
    width: width - 32,
    backgroundColor: colors.primary.main,
    borderRadius: 40,
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: '#F6BD87',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
});
