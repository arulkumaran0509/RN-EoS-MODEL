import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { HeaderBar } from '../components/HeaderBar';
import { ImageFallback } from '../components/ImageFallback';
import { AppButton } from '../components/AppButton';
import { COLORS, FONTS, SHADOWS } from '../theme/colors';

export const EditProfileScreen = ({ navigation }) => {
  const { user, updateProfile } = useAuth();

  const [fullName, setFullName] = useState(user?.fullName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = () => {
    setErrorMessage('');
    setLoading(true);

    const result = updateProfile({
      fullName,
      email,
      phone,
    });

    setLoading(false);

    if (result.success) {
      Alert.alert('Profile Updated', 'Your profile details have been saved successfully!', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } else {
      setErrorMessage(result.error);
      Alert.alert('Update Failed', result.error);
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={[COLORS.paleMint, COLORS.cream]}
        style={styles.gradient}
      >
        {/* Header Bar */}
        <HeaderBar
          title="Edit Profile"
          showBack={true}
          onBackPress={handleCancel}
          showMenu={false}
        />

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Avatar Section */}
            <View style={styles.avatarSection}>
              <View style={styles.avatarWrapper}>
                <ImageFallback
                  source={{ uri: user?.avatar }}
                  fallbackEmoji="👤"
                  style={styles.avatar}
                />
              </View>
              <Text style={styles.avatarHint}>Customer Profile Picture</Text>
            </View>

            {/* Edit Card Form */}
            <View style={styles.card}>
              {errorMessage ? (
                <View style={styles.errorBox}>
                  <Ionicons name="alert-circle" size={18} color={COLORS.error} />
                  <Text style={styles.errorText}>{errorMessage}</Text>
                </View>
              ) : null}

              {/* Full Name */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Full Name *</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="person-outline" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
                  <TextInput
                    value={fullName}
                    onChangeText={setFullName}
                    placeholder="Enter your full name"
                    placeholderTextColor={COLORS.sage}
                    style={styles.textInput}
                    autoCapitalize="words"
                  />
                </View>
              </View>

              {/* Email Address */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email Address *</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="mail-outline" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
                  <TextInput
                    value={email}
                    onChangeText={setEmail}
                    placeholder="customer@grocery.com"
                    placeholderTextColor={COLORS.sage}
                    style={styles.textInput}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
              </View>

              {/* Phone Number */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Phone Number *</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="call-outline" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
                  <TextInput
                    value={phone}
                    onChangeText={setPhone}
                    placeholder="10-digit mobile number"
                    placeholderTextColor={COLORS.sage}
                    style={styles.textInput}
                    keyboardType="phone-pad"
                  />
                </View>
              </View>

              {/* Role Indicator (Read Only) */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Account Role</Text>
                <View style={[styles.inputWrapper, styles.disabledWrapper]}>
                  <Ionicons name="shield-outline" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
                  <Text style={styles.disabledText}>{user?.role || 'Customer'}</Text>
                  <View style={styles.verifiedTag}>
                    <Text style={styles.verifiedText}>Active</Text>
                  </View>
                </View>
              </View>

              {/* Buttons Row: Save and Cancel */}
              <View style={styles.buttonsRow}>
                <AppButton
                  title="Cancel"
                  variant="outline"
                  onPress={handleCancel}
                  style={styles.cancelButton}
                />
                <AppButton
                  title="Save Changes"
                  icon="checkmark"
                  variant="primary"
                  loading={loading}
                  onPress={handleSave}
                  style={styles.saveButton}
                />
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
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  avatarSection: {
    alignItems: 'center',
    marginVertical: 14,
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: COLORS.pistachio,
  },
  avatarHint: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 6,
  },
  card: {
    backgroundColor: COLORS.cream,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.medium,
  },
  errorBox: {
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
    marginBottom: 16,
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
  disabledWrapper: {
    backgroundColor: COLORS.softPistachio,
    borderColor: COLORS.border,
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
  disabledText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textPrimary,
    fontWeight: FONTS.medium,
  },
  verifiedTag: {
    backgroundColor: COLORS.pistachio,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  verifiedText: {
    fontSize: 11,
    color: COLORS.darkGreen,
    fontWeight: FONTS.bold,
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
  },
  cancelButton: {
    flex: 1,
  },
  saveButton: {
    flex: 1.3,
  },
});
