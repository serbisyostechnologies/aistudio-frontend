import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  Image,
  StatusBar,
} from 'react-native';
import React, { useState } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-toast-message';
import { toastConfig } from '../../utils/toastConfig';
import Loader from '../../components/Loader';
import { resiger } from '../../api/endPoints';
import { globalStyles, colors, fonts } from '../../styles/globalStyles';
import { useSelector } from 'react-redux';

export default function Register({ navigation }) {
  const fcmToken = useSelector(state => state.auth.fcmToken);
  const deviceId = useSelector(state => state.auth.deviceId);
  const [secure, setSecure] = useState(true);
  const [selected, setSelected] = useState('');
  const [loading, setLoading] = useState(false);
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    role: 'USER',
  });

  const handleChange = (key, value) => {
    setRegisterData(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const getPasswordStrength = () => {
    if (registerData.password.length === 0) {
      return '';
    }

    if (registerData.password.length < 6) {
      return 'Weak password';
    }

    if (
      registerData.password.length >= 6 &&
      /[A-Z]/.test(registerData.password) &&
      /[a-z]/.test(registerData.password) &&
      /[0-9]/.test(registerData.password) &&
      /[!@#$%^&*(),.?":{}|<>]/.test(registerData.password)
    ) {
      return 'Strong password';
    }

    return 'Medium password';
  };

  const getStrengthColor = () => {
    if (registerData.password.length < 6) {
      return '#ef4444';
    }

    if (
      registerData.password.length >= 6 &&
      /[A-Z]/.test(registerData.password) &&
      /[a-z]/.test(registerData.password) &&
      /[0-9]/.test(registerData.password) &&
      /[!@#$%^&*(),.?":{}|<>]/.test(registerData.password)
    ) {
      return '#22c55e';
    }

    return '#f59e0b';
  };

  const clearRegisterForm = () => {
    setRegisterData({
      name: '',
      email: '',
      mobile: '',
      password: '',
      role: 'USER',
    });
  };

  const validateForm = () => {
    if (!registerData.name.trim()) {
      setToastMessage('Please enter full name!', 'error');
      return false;
    }

    if (!registerData.mobile.trim()) {
      setToastMessage('Please enter mobile number!', 'error');
      return false;
    } else if (!validateMobile(registerData.mobile)) {
      setToastMessage(
        'Mobile number must start with 6, 7, 8, or 9 and contain 10 digits!',
        'error',
      );
      return false;
    }

    if (!registerData.email.trim()) {
      setToastMessage('Please enter email address!', 'error');
      return false;
    } else if (!validateEmail(registerData.email)) {
      setToastMessage('Enter a valid email address!', 'error');
      return false;
    }

    if (!registerData.password.trim()) {
      setToastMessage('Please enter password!', 'error');
      return false;
    }
    return true;
  };

  const validateMobile = mobile => {
    const mobileRegex = /^[6-9][0-9]{9}$/;
    return mobileRegex.test(mobile);
  };

  const validateEmail = email => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const submitRegisterForm = async () => {
    if (validateForm()) {
      try {
        setLoading(true);
        const request = {
          ...registerData,
          fcmToken: fcmToken ? fcmToken : '',
          deviceId: deviceId ? deviceId : '',
        };
        const response = await resiger(request);
        setLoading(false);
        const data = response.data;
        if (data.success) {
          clearRegisterForm();
          setToastMessage('User registered successfully!', 'success');
        } else {
          setToastMessage('Failed to register user!', 'error');
        }
      } catch (error) {
        setLoading(false);
        setToastMessage('Failed to register user!', 'error');
      }
    }
  };

  const setToastMessage = (message, type) => {
    Toast.show({
      type: type,
      text1: message,
      position: 'bottom',
    });
  };

  return (
    <>
      <StatusBar
        backgroundColor="#ffffff"
        barStyle="dark-content"
        translucent={false}
      />
      <KeyboardAvoidingView
        style={globalStyles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={globalStyles.container}>
            <View style={styles.header}>
              <Image
                source={require('../../assets/images/logos/logo.png')}
                style={globalStyles.logo}
                resizeMode="contain"
              />
              <Text style={globalStyles.title}>AISerbisyosStudio</Text>
              <Text style={globalStyles.subTitle}>
                Create an account to continue
              </Text>
            </View>
            <View style={styles.body}>
              <View style={styles.card}>
                <Text style={globalStyles.label}>Full Name</Text>
                <TextInput
                  placeholder="Full name"
                  style={globalStyles.input}
                  keyboardType="default"
                  autoCapitalize="words"
                  autoComplete="false"
                  value={registerData.name}
                  onChangeText={text => handleChange('name', text)}
                />

                <Text style={globalStyles.label}>Mobile Number</Text>
                <TextInput
                  placeholder="Mobile number"
                  style={globalStyles.input}
                  keyboardType="phone-pad"
                  autoCapitalize="words"
                  autoComplete="false"
                  value={registerData.mobile}
                  maxLength={10}
                  onChangeText={text => handleChange('mobile', text)}
                />

                <Text style={globalStyles.label}>Email</Text>
                <TextInput
                  placeholder="Email address"
                  style={globalStyles.input}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="false"
                  value={registerData.email}
                  onChangeText={text => handleChange('email', text)}
                />

                <Text style={globalStyles.label}>Password</Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    placeholder="Enter password"
                    secureTextEntry={secure}
                    style={styles.passwordInput}
                    value={registerData.password}
                    autoCapitalize="none"
                    onChangeText={text => handleChange('password', text)}
                  />
                  <TouchableOpacity onPress={() => setSecure(!secure)}>
                    <Ionicons
                      name={secure ? 'eye-off-outline' : 'eye-outline'}
                      size={22}
                      color="#94a3b8"
                    />
                  </TouchableOpacity>
                </View>
                {!!registerData.password && (
                  <Text style={[styles.hint, { color: getStrengthColor() }]}>
                    {getPasswordStrength()}
                  </Text>
                )}

                <View style={styles.buttons}>
                  <TouchableOpacity
                    style={[
                      styles.button,
                      selected == 'register' && styles.buttonPressed,
                    ]}
                    activeOpacity={0.9}
                    onPressIn={() => setSelected('register')}
                    onPressOut={() => setSelected('')}
                    onPress={submitRegisterForm}
                    disabled={loading}
                  >
                    <Text
                      style={[
                        styles.buttonText,
                        selected == 'register' && styles.buttonTextPressed,
                      ]}
                    >
                      REGISTER
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.button,
                      selected == 'clear' && styles.buttonPressed,
                    ]}
                    activeOpacity={0.9}
                    onPressIn={() => setSelected('clear')}
                    onPressOut={() => setSelected('')}
                    onPress={clearRegisterForm}
                    disabled={loading}
                  >
                    <Text
                      style={[
                        styles.buttonText,
                        selected == 'clear' && styles.buttonTextPressed,
                      ]}
                    >
                      CLEAR
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.footer}>
                  <Text style={styles.footerText}>
                    Already have an account?
                  </Text>
                  <TouchableOpacity
                    onPress={() => navigation.replace('Login')}
                    disabled={loading}
                  >
                    <Text style={globalStyles.clickableText}> LOGIN</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <Toast config={toastConfig} />
      <Loader visible={loading} />
    </>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
  },
  header: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.secondary,
    marginTop: 40,
  },
  body: {
    flex: 9,
    backgroundColor: colors.primary,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    alignItems: 'center',
    width: '100%',
  },
  logo: {
    width: 60,
    height: 60,
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    color: colors.primary,
    textAlign: 'center',
    fontFamily: fonts.bold,
  },
  subTitle: {
    fontSize: 15,
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 30,
  },
  card: {
    paddingTop: 40,
    width: '100%',
    paddingHorizontal: 15,
    paddingBottom: 40,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondary,
    borderRadius: 5,
    paddingHorizontal: 12,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 2,
    paddingVertical: 10,
    color: colors.primary,
    fontFamily: fonts.regular,
  },
  toggle: {
    color: '#60a5fa',
    fontWeight: '600',
  },
  forgot: {
    alignSelf: 'flex-end',
    marginTop: 8,
  },
  forgotText: {
    color: colors.secondary,
    fontSize: 12,
    fontFamily: fonts.bold,
  },
  button: {
    flex: 1,
    backgroundColor: colors.primary,
    padding: 5,
    borderRadius: 5,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: colors.secondary,
    borderWidth: 2,
    ...(Platform.OS === 'android' && {
      overflow: 'hidden',
    }),
  },
  buttonText: {
    color: colors.secondary,
    fontSize: 18,
    fontFamily: fonts.bold,
  },
  buttonTextPressed: {
    color: colors.secondary,
    fontSize: 18,
    fontFamily: fonts.bold,
  },
  buttonPressed: {
    backgroundColor: colors.primary,
    transform: [{ scale: 0.97 }],
    opacity: 0.9,
    borderColor: colors.secondary,
    borderWidth: 2,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15,
  },
  footerText: {
    color: '#94a3b8',
    fontFamily: fonts.regular,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 10,
  },
});