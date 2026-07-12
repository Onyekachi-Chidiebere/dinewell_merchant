import React, { useState, useCallback, useRef } from "react";
import { Text, StyleSheet, SafeAreaView, View, TextInput, TouchableOpacity, Dimensions, KeyboardAvoidingView, Platform, Pressable, ActivityIndicator } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import LinearGradient from "react-native-linear-gradient";
import colors from "../theme/colors";
import { FaceIdIcon } from "../assets/icons";
import { useAppContext } from "../context/AppContext";
import {
  canUseBiometricLogin,
  getLoginCredentials,
} from "../services/biometricAuth";

const { width, height } = Dimensions.get("window");

const Login = ({navigation}:any) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loginLoading } = useAppContext();
  const [canBiometricLogin, setCanBiometricLogin] = useState(false);
  const [biometricLabel, setBiometricLabel] = useState('Biometrics');
  const hasAutoBiometricLogin = useRef(false);

  const handleBiometricLogin = useCallback(async () => {
    try {
      const credentials = await getLoginCredentials(
        `Sign in to DineWell Merchant with ${biometricLabel}`,
      );
      if (!credentials) {
        return;
      }

      await login({
        email: credentials.email,
        password: credentials.password,
      });
    } catch (e) {
      console.error('Biometric login error:', e);
    }
  }, [biometricLabel, login]);

  useFocusEffect(
    useCallback(() => {
      hasAutoBiometricLogin.current = false;

      const initBiometricLogin = async () => {
        const status = await canUseBiometricLogin();
        setCanBiometricLogin(status.available);
        setBiometricLabel(status.label);

        if (status.available && !hasAutoBiometricLogin.current) {
          hasAutoBiometricLogin.current = true;
          handleBiometricLogin();
        }
      };

      initBiometricLogin();
    }, [handleBiometricLogin]),
  );

  const onLogin = async () => {
    try {
      await login({ email, password });
    } catch (e) {
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
              <Text style={styles.title}>{"Login\nDetails"}</Text>
            </View>
            <View style={styles.formWrapper}>
              {canBiometricLogin && (
                <TouchableOpacity
                  style={[styles.biometricButton, loginLoading && styles.buttonDisabled]}
                  activeOpacity={0.8}
                  onPress={handleBiometricLogin}
                  disabled={loginLoading}
                >
                  {loginLoading ? (
                    <ActivityIndicator color={colors.primary.main} />
                  ) : (
                    <>
                      <FaceIdIcon width={24} height={24} color={colors.primary.main} />
                      <Text style={styles.biometricButtonText}>Sign in with {biometricLabel}</Text>
                    </>
                  )}
                </TouchableOpacity>
              )}

              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#8B8B9A"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                textContentType="emailAddress"
                autoCorrect={false}
              />

              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#8B8B9A"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                textContentType="password"
                autoCorrect={false}
              />
              <View style={styles.forgotPasswordHolder}>
                <Pressable onPress={()=>{navigation.navigate('PasswordResetOtp')}}><Text style={styles.forgotPasswordText}>Forgot Passwprd?</Text></Pressable>
              </View>
            </View>

            <View style={styles.bottomWrapper}>
              <TouchableOpacity style={styles.button} activeOpacity={0.8} onPress={onLogin} disabled={loginLoading}>
                <Text style={styles.buttonText}>{loginLoading ? 'Logging in...' : 'Login'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default Login;

const styles = StyleSheet.create({
  forgotPasswordText:{
    color:colors.primary.main
  },
  forgotPasswordHolder:{
    alignItems:'flex-end',
    width:'100%',
    paddingHorizontal:20
  },
  container: {
    flex: 1,
  },
  outerWrapper: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: height * 0.08,
    paddingBottom: 40,
  },
  headerWrapper: {
    marginBottom: 24,
  },
  title: {
    fontSize: 40,
    fontWeight: "700",
    color: "#18181B",
    lineHeight: 48,
  },
  formWrapper: {
    gap: 16,
  },
  input: {
    width: width - 48,
    backgroundColor: "#fff",
    borderRadius: 40,
    borderWidth: 1,
    borderColor: "#C4CBF2",
    paddingVertical: 22,
    paddingHorizontal: 20,
    fontSize: 16,
    color: "#18181B",
  },
  bottomWrapper: {
    alignItems: "center",
  },
  button: {
    width: width - 48,
    backgroundColor: colors.primary.main,
    borderRadius: 40,
    paddingVertical: 22,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  biometricButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    width: width - 48,
    backgroundColor: "#fff",
    borderRadius: 40,
    borderWidth: 1,
    borderColor: "#C4CBF2",
    paddingVertical: 22,
    marginBottom: 8,
  },
  biometricButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.primary.main,
  },
});
