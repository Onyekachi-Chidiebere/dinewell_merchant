import React, { useState } from "react";
import { Text, StyleSheet, SafeAreaView, View, TextInput, TouchableOpacity, Dimensions, KeyboardAvoidingView, Platform, Alert, Pressable, ActivityIndicator } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import colors from "../theme/colors";
import { useAppContext } from "../context/AppContext";
import axios from "../api/axios";
import Toast from "react-native-toast-message";

const { width, height } = Dimensions.get("window");

const PasswordResetOtp = ({navigation, route}:any) => {
  const [email, setEmail] = useState(route?.params?.email || "");
  const [otp, setOtp] = useState("");
  const [sendingOTP, setSendingOTP] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const handleSendOTP = async () => {
    if (!email) {
      Toast.show({
        type: 'error',
        text1: 'Email Required',
        text2: 'Please enter your email address'
      });
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Toast.show({
        type: 'error',
        text1: 'Invalid Email',
        text2: 'Please enter a valid email address'
      });
      return;
    }

    try {
      setSendingOTP(true);
      const response = await axios.post('/merchant/forgot-password/send-otp', { email });
      
      if (response.data.success) {
        Toast.show({
          type: 'success',
          text1: 'OTP Sent',
          text2: response.data.message || 'OTP has been sent to your email'
        });
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || 'Failed to send OTP';
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: errorMessage
      });
    } finally {
      setSendingOTP(false);
    }
  };

  const onSubmit = async () => {
    if (!email || !otp) {
      Toast.show({
        type: 'error',
        text1: 'Fields Required',
        text2: 'Please enter both email and OTP'
      });
      return;
    }

    try {
      setVerifying(true);
      const response = await axios.post('/merchant/forgot-password/verify-otp', { 
        email, 
        otp 
      });

      if (response.data.success) {
        Toast.show({
          type: 'success',
          text1: 'OTP Verified',
          text2: response.data.message || 'OTP verified successfully'
        });
        
        // Navigate to reset password screen with merchant info
        navigation.navigate('ResetPassword', {
          email: response.data.email,
          merchantId: response.data.merchantId
        });
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || 'Failed to verify OTP';
      Toast.show({
        type: 'error',
        text1: 'Verification Failed',
        text2: errorMessage
      });
    } finally {
      setVerifying(false);
    }
  };

  return (
    <LinearGradient
      colors={["#F6BD87", "#FFF6ED", "#FFFFFF"]}
      locations={[0, 0.45, 1]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.container}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View style={styles.outerWrapper}>
            <View style={styles.headerWrapper}>
              <Text style={styles.title}>{"Verify\nEmail"}</Text>
            </View>
            <View style={styles.formWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Enter Email"
                placeholderTextColor="#8B8B9A"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                textContentType="emailAddress"
                autoCorrect={false}
              />
              <View style={styles.forgotPasswordHolder}>
                <Pressable 
                  onPress={handleSendOTP} 
                  disabled={sendingOTP}
                  style={sendingOTP && styles.disabledButton}
                >
                  {sendingOTP ? (
                    <ActivityIndicator size="small" color={colors.primary.main} />
                  ) : (
                    <Text style={styles.forgotPasswordText}>Get Otp</Text>
                  )}
                </Pressable>
              </View>
              <TextInput
                style={styles.input}
                placeholder="Enter OTP"
                placeholderTextColor="#8B8B9A"
                value={otp}
                onChangeText={setOtp}
                keyboardType="number-pad"
                maxLength={5}
                autoCorrect={false}
              />

            </View>

            <View style={styles.bottomWrapper}>
              <TouchableOpacity 
                style={[styles.button, (verifying || sendingOTP) && styles.buttonDisabled]} 
                activeOpacity={0.8} 
                onPress={onSubmit} 
                disabled={verifying || sendingOTP}
              >
                {verifying ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Verify</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default PasswordResetOtp;

const styles = StyleSheet.create({
  forgotPasswordText: {
    color: colors.primary.main
  },
  forgotPasswordHolder: {
    alignItems: 'flex-end',
    width: '100%',
    paddingHorizontal: 40
  },
  container: {
    flex: 1,
  },
  outerWrapper: {
    flex: 1,
    justifyContent: "space-between",
  },
  headerWrapper: {
    alignItems: "center",
    marginTop: height * 0.09, // push title high up
  },
  title: {
    fontSize: 64,
    fontWeight: "700",
    color: "#454B5E",
    textAlign: "center",
    letterSpacing: 0.5,
    lineHeight: 63,
    textShadowColor: "rgba(69, 75, 94, 0.18)",
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 8,
  },
  formWrapper: {
    alignItems: "center",
    marginTop: height * 0.04, // large gap after title
  },
  input: {
    width: width - 40,
    height: 64,
    backgroundColor: "#fff",
    borderRadius: 32,
    borderWidth: 1,
    borderColor: "#EAD9D1",
    paddingHorizontal: 28,
    fontSize: 20,
    fontStyle: "italic",
    color: "#454B5E",
    marginTop: 12,
    marginBottom:5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  bottomWrapper: {
    alignItems: "center",
    marginBottom: height * 0.06, // large margin at the bottom
  },
  button: {
    width: width - 32,
    backgroundColor: colors.primary.main,
    borderRadius: 40,
    paddingVertical: 22,
    alignItems: "center",
    shadowColor: "#F6BD87",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 4,
  },
  buttonText: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  disabledButton: {
    opacity: 0.6,
  },
});