// Together We Ride - Login Screen
// Email/password authentication

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { signIn, signUp } from '../../services/authService';
import Button from '../../components/common/Button';
import { COLORS, SPACING, TYPOGRAPHY } from '../../config/constants';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (isSignUp && !displayName) {
      Alert.alert('Error', 'Please enter your display name');
      return;
    }

    setLoading(true);

    if (isSignUp) {
      const result = await signUp(email, password, displayName);

      if (result.success) {
        // Navigation handled by AuthContext
      } else {
        Alert.alert('Sign Up Failed', result.error);
      }
    } else {
      const result = await signIn(email, password);

      if (result.success) {
        // Navigation handled by AuthContext
      } else {
        Alert.alert('Login Failed', result.error);
      }
    }

    setLoading(false);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Together We Ride</Text>
        <Text style={styles.subtitle}>Turn Your Activity Into Youth Opportunity</Text>

        {isSignUp && (
          <TextInput
            style={styles.input}
            placeholder="Display Name"
            value={displayName}
            onChangeText={setDisplayName}
            autoCapitalize="words"
          />
        )}

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <Button
          title={isSignUp ? 'Sign Up' : 'Sign In'}
          onPress={handleAuth}
          loading={loading}
          fullWidth
          style={styles.button}
        />

        <Button
          title={isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          onPress={() => setIsSignUp(!isSignUp)}
          variant="text"
          fullWidth
        />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: SPACING.xl,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize.xxxl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.xxl,
  },
  input: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: SPACING.md,
    fontSize: TYPOGRAPHY.fontSize.base,
    marginBottom: SPACING.md,
  },
  button: {
    marginTop: SPACING.md,
    marginBottom: SPACING.md,
  },
});

export default LoginScreen;
