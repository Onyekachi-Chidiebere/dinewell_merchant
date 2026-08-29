import React from 'react';
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
  Alert,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import colors from '../theme/colors';
import { useSignupContext } from '../context/SignupContext';

const { width, height } = Dimensions.get('window');
const titleSize = Math.min(48, width * 0.11);

const RestaurantDetails = ({ navigation }: { navigation: any }) => {
  const {
    restaurantDetails,
    handleRestaurantDetails,
    submitDetails,
    checkIncompleteSignupByEmail,
    applySignupProgress,
    loading,
  } = useSignupContext();

  const goNext = (result: { merchantId?: any; nextScreen?: string } | null) => {
    navigation.navigate(result?.nextScreen || 'RestaurantAddress', {
      merchantId: result?.merchantId,
    });
  };

  const handleNext = async () => {
    const email = restaurantDetails.email?.trim();
    if (!email) {
      try {
        const result = await submitDetails();
        goNext(result);
      } catch {
        // Toast already shown
      }
      return;
    }

    try {
      const existing = await checkIncompleteSignupByEmail(email);
      if (existing) {
        Alert.alert(
          'Unfinished signup found',
          `You already started creating an account with ${email}. Do you want to continue that signup or update it with the details you just entered?`,
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Continue previous',
              onPress: async () => {
                try {
                  const nextScreen = await applySignupProgress(existing, {
                    password: restaurantDetails.password || '',
                  });
                  navigation.navigate(nextScreen || 'RestaurantAddress', {
                    merchantId: existing.merchantId,
                  });
                } catch {
                  // Toast / stay
                }
              },
            },
            {
              text: 'Use these details',
              onPress: async () => {
                try {
                  const result = await submitDetails();
                  goNext(result);
                } catch {
                  // Toast already shown
                }
              },
            },
          ]
        );
        return;
      }

      const result = await submitDetails();
      goNext(result);
    } catch {
      // Toast already shown
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
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            <View style={styles.headerWrapper}>
              <Text style={styles.title}>{'Your\nRestaurant\nDetails'}</Text>
            </View>
            <View style={styles.formWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Name of Restaurant"
                placeholderTextColor="#8B8B9A"
                value={restaurantDetails.name}
                onChangeText={(value) => handleRestaurantDetails({ name: 'name', value })}
                autoCapitalize="words"
                autoCorrect={false}
              />
              <TextInput
                style={styles.input}
                placeholder="Phone Number"
                placeholderTextColor="#8B8B9A"
                value={restaurantDetails.phone}
                onChangeText={(value) => handleRestaurantDetails({ name: 'phone', value })}
                keyboardType="phone-pad"
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#8B8B9A"
                value={restaurantDetails.email}
                onChangeText={(value) => handleRestaurantDetails({ name: 'email', value })}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TextInput
                style={styles.input}
                placeholder="Location eg. Montreal"
                placeholderTextColor="#8B8B9A"
                value={restaurantDetails.location}
                onChangeText={(value) => handleRestaurantDetails({ name: 'location', value })}
                autoCapitalize="words"
                autoCorrect={false}
              />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#8B8B9A"
                value={restaurantDetails.password}
                onChangeText={(value) => handleRestaurantDetails({ name: 'password', value })}
                secureTextEntry
                textContentType="password"
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

export default RestaurantDetails;

const styles = StyleSheet.create({
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
    marginTop: Math.min(height * 0.06, 48),
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
