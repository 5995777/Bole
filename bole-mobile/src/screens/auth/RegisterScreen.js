import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Text, HelperText, RadioButton, useTheme } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { register, clearError } from '../../store/slices/authSlice';
import { User } from '../../models/User';

const RegisterScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('JOBSEEKER');
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [confirmSecureTextEntry, setConfirmSecureTextEntry] = useState(true);
  
  // Form validation errors
  const [usernameError, setUsernameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const theme = useTheme();

  useEffect(() => {
    // Clear any previous errors
    dispatch(clearError());
  }, [dispatch]);

  const validateForm = () => {
    let isValid = true;

    // Username validation
    if (!username.trim()) {
      setUsernameError('Username is required');
      isValid = false;
    } else if (username.length < 3) {
      setUsernameError('Username must be at least 3 characters');
      isValid = false;
    } else {
      setUsernameError('');
    }

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

    // Password validation
    if (!password.trim()) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      isValid = false;
    } else {
      setPasswordError('');
    }

    // Confirm password validation
    if (!confirmPassword.trim()) {
      setConfirmPasswordError('Please confirm your password');
      isValid = false;
    } else if (confirmPassword !== password) {
      setConfirmPasswordError('Passwords do not match');
      isValid = false;
    } else {
      setConfirmPasswordError('');
    }

    return isValid;
  };

  const handleRegister = () => {
    if (validateForm()) {
      const userData = {
        username,
        email,
        password,
        role,
      };
      
      dispatch(register(userData))
        .unwrap()
        .then(() => {
          // Registration successful, navigate to login
          navigation.navigate('Login');
        })
        .catch(() => {
          // Error is handled in the reducer
        });
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.headerContainer}>
          <Text style={[styles.title, { color: theme.colors.primary }]}>创建账号</Text>
          <Text style={styles.subtitle}>加入伯乐招聘平台</Text>
        </View>

        <View style={styles.formContainer}>
          <TextInput
            label="用户名"
            value={username}
            onChangeText={setUsername}
            style={styles.input}
            autoCapitalize="none"
            error={!!usernameError}
          />
          {usernameError ? <HelperText type="error">{usernameError === 'Username is required' ? '请输入用户名' : '用户名至少需要3个字符'}</HelperText> : null}

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

          <TextInput
            label="密码"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={secureTextEntry}
            style={styles.input}
            right={
              <TextInput.Icon
                icon={secureTextEntry ? 'eye-off' : 'eye'}
                onPress={() => setSecureTextEntry(!secureTextEntry)}
              />
            }
            error={!!passwordError}
          />
          {passwordError ? <HelperText type="error">{passwordError === 'Password is required' ? '请输入密码' : '密码至少需要6个字符'}</HelperText> : null}

          <TextInput
            label="确认密码"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={confirmSecureTextEntry}
            style={styles.input}
            right={
              <TextInput.Icon
                icon={confirmSecureTextEntry ? 'eye-off' : 'eye'}
                onPress={() => setConfirmSecureTextEntry(!confirmSecureTextEntry)}
              />
            }
            error={!!confirmPasswordError}
          />
          {confirmPasswordError ? <HelperText type="error">{confirmPasswordError === 'Please confirm your password' ? '请确认密码' : '两次输入的密码不一致'}</HelperText> : null}

          <Text style={styles.roleLabel}>我是：</Text>
          <View style={styles.roleContainer}>
            <View style={styles.roleOption}>
              <RadioButton
                value="JOBSEEKER"
                status={role === 'JOBSEEKER' ? 'checked' : 'unchecked'}
                onPress={() => setRole('JOBSEEKER')}
                color={theme.colors.primary}
              />
              <Text onPress={() => setRole('JOBSEEKER')}>求职者</Text>
            </View>
            <View style={styles.roleOption}>
              <RadioButton
                value="RECRUITER"
                status={role === 'RECRUITER' ? 'checked' : 'unchecked'}
                onPress={() => setRole('RECRUITER')}
                color={theme.colors.primary}
              />
              <Text onPress={() => setRole('RECRUITER')}>招聘者</Text>
            </View>
          </View>

          {error ? <HelperText type="error">{error}</HelperText> : null}

          <Button
            mode="contained"
            onPress={handleRegister}
            style={styles.button}
            loading={loading}
            disabled={loading}
          >
            注册
          </Button>

          <View style={styles.loginContainer}>
            <Text>Already have an account? </Text>
            <Button
              mode="text"
              onPress={() => navigation.navigate('Login')}
              style={styles.loginButton}
              labelStyle={styles.loginButtonLabel}
            >
              Login
            </Button>
          </View>
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
    padding: 20,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  formContainer: {
    width: '100%',
  },
  input: {
    marginBottom: 10,
  },
  roleLabel: {
    marginTop: 10,
    marginBottom: 10,
    fontSize: 16,
  },
  roleContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  roleOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  button: {
    marginTop: 20,
    paddingVertical: 8,
  },
  loginContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  loginButton: {
    marginLeft: 0,
    paddingLeft: 0,
  },
  loginButtonLabel: {
    marginLeft: 0,
  },
});

export default RegisterScreen;