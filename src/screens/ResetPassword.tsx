import React, { useState, useEffect } from "react";
import { Text, StyleSheet, SafeAreaView, View, TextInput, TouchableOpacity, Dimensions, KeyboardAvoidingView, Platform, ActivityIndicator } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import colors from "../theme/colors";
import axios from "../api/axios";
import Toast from "react-native-toast-message";

const { width, height } = Dimensions.get("window");

const ResetPassword = ({navigation, route}:any) => {
  const { email: routeEmail, merchantId } = route?.params || {};
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    // If no email or merchantId from route, navigate back
    if (!routeEmail || !merchantId) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Missing verification information. Please verify OTP again.'
      });
      navigation.goBack();
    }
  }, [routeEmail, merchantId, navigation]);

  const handleResetPassword = async () => {
    // Validation
    if (!newPassword || !confirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'Fields Required',
        text2: 'Please enter both new password and confirm password'
      });
      return;
    }

    if (newPassword.length < 6) {
      Toast.show({
        type: 'error',
        text1: 'Password Error',
        text2: 'Password must be at least 6 characters long'
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'Password Mismatch',
        text2: 'New password and confirm password do not match'
      });
      return;
    }

    if (!merchantId || !routeEmail) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Missing verification information'
      });
      return;
    }

    try {
      setResetting(true);
      const response = await axios.post('/merchant/forgot-password/reset', {
        merchantId,
        email: routeEmail,
        newPassword
      });

      if (response.data.success) {
        Toast.show({
          type: 'success',
          text1: 'Password Reset',
          text2: response.data.message || 'Password reset successfully',
          onHide: () => {
            // Navigate to login screen
            navigation.navigate('Login');
          }
        });
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || 'Failed to reset password';
      Toast.show({
        type: 'error',
        text1: 'Reset Failed',
        text2: errorMessage
      });
    } finally {
      setResetting(false);
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
              <Text style={styles.title}>{"Reset\nPassword"}</Text>
            </View>
            <View style={styles.formWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Enter New Password"
                placeholderTextColor="#8B8B9A"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
                textContentType="password"
                autoCorrect={false}
                autoCapitalize="none"
              />

              <TextInput
                style={styles.input}
                placeholder="Confirm New Password"
                placeholderTextColor="#8B8B9A"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                textContentType="password"
                autoCorrect={false}
                autoCapitalize="none"
              />
           
            </View>

            <View style={styles.bottomWrapper}>
              <TouchableOpacity 
                style={[styles.button, resetting && styles.buttonDisabled]} 
                activeOpacity={0.8} 
                onPress={handleResetPassword} 
                disabled={resetting}
              >
                {resetting ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Reset Password</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default ResetPassword;

const styles = StyleSheet.create({

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
    marginBottom: 12,
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
});