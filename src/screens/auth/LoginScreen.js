import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  StatusBar,
} from 'react-native';
import React, { useState } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-toast-message';
import { toastConfig } from '../../utils/toastConfig';
import Loader from '../../components/Loader';
import { login } from '../../api/endPoints';
import { useDispatch } from 'react-redux';
import { loginSuccess, updateCredits } from '../../redux/slices/authSlice';
import { globalStyles, colors, fonts } from '../../styles/globalStyles';

export default function LoginScreen({ navigation }) {
  const dispatch = useDispatch();
  const [secure, setSecure] = useState(true);
  const [selected, setSelected] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginData, setLoginData] = useState({
    emailMobile: '',
    password: '',
  });

  const validateEmailOrMobile = value => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobileRegex = /^[6-9][0-9]{9}$/;
    return emailRegex.test(value) || mobileRegex.test(value);
  };

  const validateForm = () => {
    if (!loginData.emailMobile.trim()) {
      setToastMessage('Please enter mobile number/email address!', 'error');
      return false;
    } else if (!validateEmailOrMobile(loginData.emailMobile)) {
      setToastMessage(
        'Enter valid email address or 10 digit mobile number!',
        'error',
      );
      return false;
    }

    if (!loginData.password.trim()) {
      setToastMessage('Please enter password!', 'error');
      return false;
    }
    return true;
  };

  const setToastMessage = (message, type) => {
    Toast.show({
      type: type,
      text1: message,
      position: 'bottom',
    });
  };

  const submitLoginForm = async () => {
    if (validateForm()) {
      try {
        setLoading(true);
        const response = await login(loginData);
        setLoading(false);
        const data = response.data;
        if (data.success) {
          if (data.user.is_active) {
            dispatch(updateCredits(data.user.credits));
            dispatch(
              loginSuccess({
                user: data.user,
                token: data.access_token,
              }),
            );
            clearLoginForm();
            setToastMessage('Loggedin successfully!', 'success');
            navigation.replace('AppHome');
          } else {
            navigation.replace('InactiveUser');
          }
        } else {
          setToastMessage(data.message, 'error');
        }
      } catch (error) {
        setLoading(false);
        setToastMessage('Failed to login!', 'error');
      }
    }
  };

  const clearLoginForm = () => {
    setLoginData({
      emailMobile: '',
      password: '',
    });
  };

  const handleChange = (key, value) => {
    setLoginData(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <>
      <KeyboardAvoidingView
        style={globalStyles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={globalStyles.container}>
            <StatusBar
              backgroundColor="#ffffff"
              barStyle="dark-content"
              translucent={false}
            />
            <View style={styles.header}>
              <Image
                source={require('../../assets/images/logos/logo.png')}
                style={globalStyles.logo}
                resizeMode="contain"
              />
              <Text style={globalStyles.title}>AISerbisyosStudio</Text>
              <Text style={globalStyles.subTitle}>Login to continue</Text>
            </View>
            <View style={styles.body}>
              <View style={styles.card}>
                <Text style={globalStyles.label}>Email/Mobile Number</Text>
                <TextInput
                  placeholder="Mobile n]umber or email address"
                  style={globalStyles.input}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="false"
                  maxLength={10}
                  value={loginData.emailMobile}
                  onChangeText={text => handleChange('emailMobile', text)}
                />

                <Text style={globalStyles.label}>Password</Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    placeholder="Enter password"
                    value={loginData.password}
                    secureTextEntry={secure}
                    style={styles.passwordInput}
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

                <TouchableOpacity
                  style={styles.forgot}
                  onPress={() => navigation.replace('ForgotPassword')}
                  disabled={loading}
                >
                  <Text style={globalStyles.clickableText}>
                    Forgot Password?
                  </Text>
                </TouchableOpacity>

                <View style={styles.buttons}>
                  <TouchableOpacity
                    style={styles.button}
                    activeOpacity={0.9}
                    onPressIn={() => setSelected('login')}
                    onPressOut={() => setSelected('')}
                    onPress={submitLoginForm}
                    disabled={loading}
                  >
                    <Text
                      style={styles.buttonText}
                    >
                      LOGIN
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.button}
                    activeOpacity={0.9}
                    onPressIn={() => setSelected('clear')}
                    onPressOut={() => setSelected('')}
                    onPress={clearLoginForm}
                    disabled={loading}
                  >
                    <Text
                      style={styles.buttonText}
                    >
                      CLEAR
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.footer}>
                  <Text style={styles.footerText}>Don't have an account?</Text>
                  <TouchableOpacity
                    onPress={() => navigation.replace('Register')}
                    disabled={loading}
                  >
                    <Text style={globalStyles.clickableText}> REGISTER</Text>
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
    flex: 3,
    alignItems: 'center',
    backgroundColor: colors.secondary,
    paddingTop: 50
  },
  body: {
    flex: 7,
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
    fontFamily: 'saira-bold',
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