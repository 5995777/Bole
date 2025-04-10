import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Text, HelperText, RadioButton } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import globalStyles from '../../styles/globalStyles';
import { register, clearError } from '../../store/slices/authSlice';
import { User } from '../../models/User';

const RegisterScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('123456');
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
        <View style={styles.titleContainer}>
          <Text style={styles.title}>创建账号</Text>
          <Text style={styles.subtitle}>加入伯乐招聘平台</Text>
        </View>

        <View style={styles.form}>
          <TextInput
            label="用户名"
            value={username}
            onChangeText={setUsername}
            style={styles.input}
            autoCapitalize="none"
            error={!!usernameError}
          />
          {usernameError ? <Text style={styles.errorText}>{usernameError === 'Username is required' ? '请输入用户名' : '用户名至少需要3个字符'}</Text> : null}

          <TextInput
            label="邮箱"
            value={email}
            onChangeText={(text) => setEmail(text.toLowerCase())} // Convert email to lowercase
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
            error={!!emailError}
          />
          {emailError ? <Text style={styles.errorText}>{emailError === 'Email is required' ? '请输入邮箱' : '请输入有效的邮箱地址'}</Text> : null}

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
          {passwordError ? <Text style={styles.errorText}>{passwordError === 'Password is required' ? '请输入密码' : '密码至少需要6个字符'}</Text> : null}

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
          {confirmPasswordError ? <Text style={styles.errorText}>{confirmPasswordError === 'Please confirm your password' ? '请确认密码' : '两次输入的密码不一致'}</Text> : null}

          <View style={styles.roleSelection}>
            <Text style={styles.roleLabel}>注册为：</Text>
            <View style={styles.roleOptions}>
              <TouchableOpacity
                style={[styles.roleOption, role === 'JOBSEEKER' && styles.selectedRole]}
                onPress={() => setRole('JOBSEEKER')}
              >
                <Text style={[styles.roleText, role === 'JOBSEEKER' && styles.selectedRoleText]}>求职者</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.roleOption, role === 'RECRUITER' && styles.selectedRole]}
                onPress={() => setRole('RECRUITER')}
              >
                <Text style={[styles.roleText, role === 'RECRUITER' && styles.selectedRoleText]}>招聘者</Text>
              </TouchableOpacity>
            </View>
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <View style={styles.buttonContainer}>
            <Button
              mode="contained"
              onPress={handleRegister}
              loading={loading}
              disabled={loading}
            >
              注册
            </Button>
          </View>

          <View style={styles.loginLinkContainer}>
            <Text style={styles.loginText}>已经有账号了？</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLink}>登录</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({ // Apply global container style
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,\n    paddingVertical: 50,\n  },\n  titleContainer: {\n    alignItems: 'center',\n    marginBottom: 30,\n  },\n  title: {\n    ...globalStyles.headerTitle,\n    fontSize: 32,\n    marginBottom: 10,\n  },\n  subtitle: {\n    ...globalStyles.subtitle,\n    fontSize: 18,\n    color: globalStyles.lightTextColor,\n  },\n  form: {\n    width: '100%',\n    ...globalStyles.cardContainer,\n    paddingTop: 30,\n    paddingBottom: 30,\n  },\n  roleSelection: {\n    marginBottom: 20,\n  },\n  roleLabel: {\n    ...globalStyles.text,\n    fontSize: 16,\n    marginBottom: 10,\n  },\n  roleOptions: {\n    flexDirection: 'row',\n    justifyContent: 'space-around',\n  },\n  roleOption: {\n    flexDirection: 'row',\n    alignItems: 'center',\n    backgroundColor: globalStyles.secondaryBackgroundColor,\n    paddingVertical: 12,\n    paddingHorizontal: 20,\n    borderRadius: 25,\n    borderWidth: 1,\n    borderColor: 'transparent', // Use transparent border by default\n  },\n  roleText: {\n    ...globalStyles.text,\n    fontSize: 16,\n  },\n  selectedRole: {\n    backgroundColor: globalStyles.primaryColor,\n  },\n  selectedRoleText: {\n    color: globalStyles.white,\n  },\n  buttonContainer: {\n    marginTop: 20,\n  },\n  loginLinkContainer: {\n    flexDirection: 'row',\n    alignItems: 'center',\n    justifyContent: 'center',\n    marginTop: 30,\n  },\n  loginText: {\n    ...globalStyles.smallText,\n    marginRight: 5,\n  },\n  loginLink: {\n    ...globalStyles.linkText,\n  },\n  errorText: {\n    ...globalStyles.errorText,\n    marginBottom: 10,\n    textAlign: 'center',\n  },\n  container: {\n    ...globalStyles.container,\n    backgroundColor: globalStyles.white,\n    padding: 0,\n  },\n  input: {\n    ...globalStyles.input,\n    marginBottom: 20,\n  },\n  button: {\n    ...globalStyles.button,\n  },\n  bottomTextContainer: {\n    flexDirection: 'row',\n    alignItems: 'center',\n    justifyContent: 'center',\n    marginTop: 20,\n  },\n  registerButtonText: {\n    ...globalStyles.linkText,\n  },\n  headerContainer: {\n    alignItems: 'center',\n    marginBottom: 20,\n  },\n  formContainer: {\n    width: '100%',\n  },\n  roleContainer: {\n    flexDirection: 'row',\n    justifyContent: 'space-around',\n    marginBottom: 20, // Increased margin\n  },\n  button: {\n    ...globalStyles.button,\n    marginTop: 10,\n    marginBottom: 15,\n  },\n  bottomTextContainer: {\n    flexDirection: 'row',\n    alignItems: 'center',\n    justifyContent: 'center',\n    marginTop: 20, // Increased margin\n  },\n});\n
  },
  input: {
    ...globalStyles.input,
    marginBottom: 15,
    fontSize: 16,
  },
  roleLabel: {
    ...globalStyles.text,
    fontSize: 18,
    marginBottom: 10,
  },
  roleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20, // Increased margin
  },
  roleOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: globalStyles.borderColor,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  button: {
    ...globalStyles.button,
    marginTop: 10,
    marginBottom: 15,
  },
  bottomTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20, // Increased margin
  },
});

export default RegisterScreen;