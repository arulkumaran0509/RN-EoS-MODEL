import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth, DEMO_ACCOUNTS } from '../context/AuthContext';
import { AppLogo } from '../components/AppLogo';
import { AppButton } from '../components/AppButton';
import { COLORS, FONTS, SHADOWS } from '../theme/colors';

export const WelcomeScreen = () => {
  const { signIn, signUp } = useAuth();

  // Mode: 'sign_in' or 'sign_up'
  const [authMode, setAuthMode] = useState('sign_in');

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Quick helper to fill demo credentials
  const fillDemoCredentials = (demoRole) => {
    setErrorMessage('');
    if (demoRole === 'Admin') {
      setEmail(DEMO_ACCOUNTS.admin.email);
      setPassword(DEMO_ACCOUNTS.admin.password);
      setFullName(DEMO_ACCOUNTS.admin.fullName);
      setPhone(DEMO_ACCOUNTS.admin.phone);
      setConfirmPassword(DEMO_ACCOUNTS.admin.password);
    } else {
      setEmail(DEMO_ACCOUNTS.customer.email);
      setPassword(DEMO_ACCOUNTS.customer.password);
      setFullName(DEMO_ACCOUNTS.customer.fullName);
      setPhone(DEMO_ACCOUNTS.customer.phone);
      setConfirmPassword(DEMO_ACCOUNTS.customer.password);
    }
  };

  const handleSignIn = () => {
    setErrorMessage('');
    setLoading(true);

    const result = signIn({ email, password });
    setLoading(false);

    if (!result.success) {
      setErrorMessage(result.error);
      Alert.alert('Sign In Failed', result.error);
    }
  };

  const handleSignUp = () => {
    setErrorMessage('');
    setLoading(true);

    // Public signup is strictly Customer
    const result = signUp({
      fullName,
      email,
      phone,
      password,
      confirmPassword,
    });
    setLoading(false);

    if (!result.success) {
      setErrorMessage(result.error);
      Alert.alert('Registration Failed', result.error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={[COLORS.paleMint, COLORS.cream]}
        style={styles.gradient}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Header Hero Section with AppLogo */}
            <View style={styles.heroSection}>
              <AppLogo size={84} showBadge={true} style={styles.logoMargin} />

              <Text style={styles.appTitle}>Daily Grocery Food</Text>
              <Text style={styles.appSubtitle}>
                Fresh, organic fruits &amp; vegetables delivered from local farms straight to your kitchen.
              </Text>
            </View>

            {/* Quick Demo Credentials Bar for Evaluator Convenience */}
            <View style={styles.demoBox}>
              <View style={styles.demoHeaderRow}>
                <Ionicons name="sparkles" size={16} color={COLORS.freshLeaf} />
                <Text style={styles.demoTitle}>Quick Demo Login (1-Tap Fill):</Text>
              </View>
              <View style={styles.demoButtonsRow}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => fillDemoCredentials('Customer')}
                  style={[
                    styles.demoPill,
                    email.toLowerCase() === DEMO_ACCOUNTS.customer.email && styles.demoPillActive,
                  ]}
                >
                  <Text style={styles.demoPillEmoji}>👤</Text>
                  <Text style={styles.demoPillText}>Demo Customer</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => fillDemoCredentials('Admin')}
                  style={[
                    styles.demoPill,
                    email.toLowerCase() === DEMO_ACCOUNTS.admin.email && styles.demoPillActive,
                  ]}
                >
                  <Text style={styles.demoPillEmoji}>🛡️</Text>
                  <Text style={styles.demoPillText}>Demo Admin</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Auth Mode Toggle Tabs (Sign In vs Sign Up) */}
            <View style={styles.tabSwitchContainer}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  setAuthMode('sign_in');
                  setErrorMessage('');
                }}
                style={[
                  styles.tabSwitchButton,
                  authMode === 'sign_in' && styles.tabSwitchActive,
                ]}
              >
                <Text
                  style={[
                    styles.tabSwitchText,
                    authMode === 'sign_in' && styles.tabSwitchTextActive,
                  ]}
                >
                  Sign In
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  setAuthMode('sign_up');
                  setErrorMessage('');
                }}
                style={[
                  styles.tabSwitchButton,
                  authMode === 'sign_up' && styles.tabSwitchActive,
                ]}
              >
                <Text
                  style={[
                    styles.tabSwitchText,
                    authMode === 'sign_up' && styles.tabSwitchTextActive,
                  ]}
                >
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>

            {/* Form Container Card */}
            <View style={styles.card}>
              {/* Registration notice for Public Sign Up */}
              {authMode === 'sign_up' ? (
                <View style={styles.publicNotice}>
                  <Ionicons name="information-circle" size={16} color={COLORS.darkGreen} />
                  <Text style={styles.publicNoticeText}>
                    Public registration creates Customer accounts. Admin accounts are managed by administrators.
                  </Text>
                </View>
              ) : null}

              {/* Error Alert Box if any */}
              {errorMessage ? (
                <View style={styles.errorBanner}>
                  <Ionicons name="alert-circle" size={18} color={COLORS.error} />
                  <Text style={styles.errorText}>{errorMessage}</Text>
                </View>
              ) : null}

              {/* Full Name Field (Sign Up Only) */}
              {authMode === 'sign_up' && (
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Full Name</Text>
                  <View style={styles.inputWrapper}>
                    <Ionicons name="person-outline" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
                    <TextInput
                      value={fullName}
                      onChangeText={setFullName}
                      placeholder="e.g. Priya Sharma"
                      placeholderTextColor={COLORS.sage}
                      style={styles.textInput}
                      autoCapitalize="words"
                    />
                  </View>
                </View>
              )}

              {/* Email Address Field */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email Address</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="mail-outline" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
                  <TextInput
                    value={email}
                    onChangeText={setEmail}
                    placeholder="e.g. customer@grocery.com"
                    placeholderTextColor={COLORS.sage}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    style={styles.textInput}
                  />
                </View>
              </View>

              {/* Phone Number Field (Sign Up Only) */}
              {authMode === 'sign_up' && (
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Phone Number</Text>
                  <View style={styles.inputWrapper}>
                    <Ionicons name="call-outline" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
                    <TextInput
                      value={phone}
                      onChangeText={setPhone}
                      placeholder="e.g. 9876543210"
                      placeholderTextColor={COLORS.sage}
                      keyboardType="phone-pad"
                      style={styles.textInput}
                    />
                  </View>
                </View>
              )}

              {/* Password Field */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Password</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="lock-closed-outline" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
                  <TextInput
                    value={password}
                    onChangeText={setPassword}
                    placeholder="At least 6 characters"
                    placeholderTextColor={COLORS.sage}
                    secureTextEntry={!showPassword}
                    style={styles.textInput}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeIcon}
                  >
                    <Ionicons
                      name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                      size={20}
                      color={COLORS.textSecondary}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Confirm Password Field (Sign Up Only) */}
              {authMode === 'sign_up' && (
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Confirm Password</Text>
                  <View style={styles.inputWrapper}>
                    <Ionicons name="shield-outline" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
                    <TextInput
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      placeholder="Re-enter password"
                      placeholderTextColor={COLORS.sage}
                      secureTextEntry={!showPassword}
                      style={styles.textInput}
                    />
                  </View>
                </View>
              )}

              {/* Action Button */}
              <AppButton
                title={authMode === 'sign_in' ? 'Sign In to Store' : 'Create Customer Account'}
                onPress={authMode === 'sign_in' ? handleSignIn : handleSignUp}
                variant="primary"
                loading={loading}
                style={styles.submitButton}
              />

              {/* Information Footnote */}
              <View style={styles.disclaimerBox}>
                <Ionicons name="leaf-outline" size={14} color={COLORS.freshLeaf} />
                <Text style={styles.disclaimerText}>
                  Natural Pistachio Green Edition • Daily Grocery Store
                </Text>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.paleMint,
  },
  gradient: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  heroSection: {
    alignItems: 'center',
    marginVertical: 12,
  },
  logoMargin: {
    marginBottom: 12,
  },
  appTitle: {
    fontSize: 26,
    fontWeight: FONTS.bold,
    color: COLORS.darkGreen,
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  appSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 16,
  },
  demoBox: {
    backgroundColor: COLORS.cream,
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.small,
  },
  demoHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 6,
  },
  demoTitle: {
    fontSize: 12,
    fontWeight: FONTS.bold,
    color: COLORS.darkGreen,
  },
  demoButtonsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  demoPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.paleMint,
    paddingVertical: 9,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 6,
  },
  demoPillActive: {
    backgroundColor: COLORS.softPistachio,
    borderColor: COLORS.pistachio,
  },
  demoPillEmoji: {
    fontSize: 14,
  },
  demoPillText: {
    fontSize: 12,
    fontWeight: FONTS.bold,
    color: COLORS.textPrimary,
  },
  tabSwitchContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.softPistachio,
    borderRadius: 24,
    padding: 4,
    marginBottom: 16,
  },
  tabSwitchButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 20,
  },
  tabSwitchActive: {
    backgroundColor: COLORS.cream,
    ...SHADOWS.small,
  },
  tabSwitchText: {
    fontSize: 15,
    fontWeight: FONTS.semiBold,
    color: COLORS.textSecondary,
  },
  tabSwitchTextActive: {
    color: COLORS.darkGreen,
    fontWeight: FONTS.bold,
  },
  card: {
    backgroundColor: COLORS.cream,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.medium,
  },
  publicNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.softPistachio,
    padding: 10,
    borderRadius: 12,
    marginBottom: 14,
    gap: 8,
  },
  publicNoticeText: {
    flex: 1,
    fontSize: 12,
    color: COLORS.darkGreen,
    fontWeight: FONTS.medium,
    lineHeight: 16,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFEBEE',
    padding: 10,
    borderRadius: 12,
    marginBottom: 14,
    gap: 8,
    borderWidth: 1,
    borderColor: '#FFCDD2',
  },
  errorText: {
    flex: 1,
    fontSize: 12,
    color: COLORS.error,
    fontWeight: FONTS.medium,
  },
  inputGroup: {
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: FONTS.semiBold,
    color: COLORS.darkGreen,
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.paleMint,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 12,
    height: 48,
  },
  inputIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textPrimary,
    height: '100%',
  },
  eyeIcon: {
    padding: 6,
  },
  submitButton: {
    marginTop: 8,
    marginBottom: 12,
    backgroundColor: COLORS.pistachio,
  },
  disclaimerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 4,
  },
  disclaimerText: {
    fontSize: 11,
    color: COLORS.sage,
    textAlign: 'center',
  },
});
