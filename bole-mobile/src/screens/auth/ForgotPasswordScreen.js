import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { TextInput, Button, Text, HelperText, useTheme } from 'react-native-paper';
import axios from 'axios';

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const theme = useTheme();

  const validateForm = () => {
    let isValid = true;

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address');
      isValid = false;
    } else {
      setEmailError('');
    }

    return isValid;
  };

  const handleResetPassword = async () => {
    if (validateForm()) {
      setLoading(true);
      setError('');
      setMessage('');

      try {
        // Replace with your actual API endpoint
        const response = await axios.post('http://localhost:8080/api/auth/reset-password', { email });
        setMessage('Password reset instructions have been sent to your email.');
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to send reset instructions. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.headerContainer}>
          <Text style={[styles.title, { color: theme.colors.primary }]}>忘记密码</Text>
          <Text style={styles.subtitle}>输入您的邮箱以重置密码</Text>
        </View>

        <View style={styles.formContainer}>
          <TextInput
            label="邮箱"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
            error={!!emailError}
          />
          {emailError ? <HelperText type="error">{emailError === 'Email is required' ? '请输入邮箱' : '请输入有效的邮箱地址'}</HelperText> : null}

          {error ? <HelperText type="error">{error}</HelperText> : null}
          {message ? <HelperText type="info" style={styles.successMessage}>{message === 'Password reset instructions have been sent to your email.' ? '密码重置说明已发送至您的邮箱。' : message}</HelperText> : null}

          <Button
            mode="contained"
            onPress={handleResetPassword}
            style={styles.button}
            loading={loading}
            disabled={loading}
          >
            重置密码
          </Button>

          <Button
            mode="text"
            onPress={() => navigation.navigate('Login')}
            style={styles.backButton}
          >
            返回登录
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
  },
  input: {
    marginBottom: 10,
  },
  button: {
    marginTop: 20,
    paddingVertical: 8,
  },
  backButton: {
    marginTop: 10,
  },
  successMessage: {
    color: 'green',
  },
});

export default ForgotPasswordScreen;