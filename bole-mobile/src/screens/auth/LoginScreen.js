import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import globalStyles from '../../styles/globalStyles';
import { login, clearError } from '../../store/slices/authSlice';
import SafeAreaWrapper from '../../components/SafeAreaWrapper';

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('123456');
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const dispatch = useDispatch();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    // Clear any previous errors
    dispatch(clearError());
  }, [dispatch]);

  // 监听认证状态变化
  useEffect(() => {
    console.log('LoginScreen - Authentication state changed:', isAuthenticated);
    if (isAuthenticated) {
      console.log('LoginScreen - User authenticated, navigating to Main');
      // 使用replace而不是navigate，确保不能返回到登录页
      navigation.reset({
        index: 0,
        routes: [{ name: 'Main' }],
      });
    }
  }, [isAuthenticated, navigation]);

  const validateForm = () => {
    let isValid = true;

    if (!username.trim()) {
      setUsernameError('Username is required');
      isValid = false;
    } else {
      setUsernameError('');
    }

    if (!password.trim()) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      isValid = false;
    } else {
      setPasswordError('');
    }

    return isValid;
  };

  const handleLogin = () => {
    if (validateForm()) {
      dispatch(login({ username, password }));
    }
  };

  return (
    <SafeAreaWrapper backgroundColor="#ffffff">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={globalStyles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.logoContainer}>
            <Image
              source={require('../../../assets/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.title}>伯乐招聘</Text>
          </View>

          <View style={styles.formContainer}>
            <TextInput
              label="用户名"
              value={username}
              onChangeText={setUsername}
              style={globalStyles.input}
              autoCapitalize="none"
              error={!!usernameError}
            />
            {usernameError ? <Text style={styles.errorText}>{usernameError === 'Username is required' ? '请输入用户名' : '用户名至少需要3个字符'}</Text> : null}

            <TextInput
              label="密码（默认123456）"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={secureTextEntry}
              style={globalStyles.input}
              right={
                <TextInput.Icon
                  icon={secureTextEntry ? 'eye-off' : 'eye'}
                  onPress={() => setSecureTextEntry(!secureTextEntry)}
                />
              }
              error={!!passwordError}
            />
            {passwordError ? <HelperText type="error" style={globalStyles.errorText}>{passwordError === 'Password is required' ? '请输入密码' : '密码至少需要6个字符'}</HelperText> : null}

            {error ? <HelperText type="error" style={globalStyles.errorText}>{error}</HelperText> : null}

            <Button
              mode="contained"
              onPress={handleLogin}
              style={styles.loginButton}
              loading={loading}
              disabled={loading}
            >
              登录
            </Button>

            <Button
              mode="text"
              onPress={() => navigation.navigate('ForgotPassword')}
              style={styles.forgotPasswordButton}
              labelStyle={styles.forgotPasswordButtonText}
            >
              忘记密码？
            </Button>

            <View style={styles.registerContainer}>
              <Text style={globalStyles.smallText}>还没有账号？</Text>
              <Button
                mode="text"
                onPress={() => navigation.navigate('Register')}
                labelStyle={styles.registerButtonText}
              >
                注册
              </Button>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  title: {
    ...globalStyles.headerTitle,
    fontSize: 32, // Prominent title
    marginBottom: 30,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  formContainer: {
    width: '100%',
  },
  loginButton: {
    ...globalStyles.button,
    marginTop: 20,
  },
  forgotPasswordButton: {
    marginTop: 10,
  },
  forgotPasswordButtonText: {
    ...globalStyles.linkText,
  },

  registerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
  },
  registerButtonText: {
    ...globalStyles.linkText,
  },

});
export default LoginScreen;