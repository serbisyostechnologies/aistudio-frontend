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
import { useState, useRef, useEffect } from 'react';
import Toast from 'react-native-toast-message';
import { toastConfig } from '../../utils/toastConfig';
import Loader from '../../components/Loader';
import { globalStyles, colors, fonts } from '../../styles/globalStyles';

export default function ForgotPasswordScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [selected, setSelected] = useState('');
  const [mobileOtp, setMobileOtp] = useState(['', '', '', '']);
  const [emailOtp, setEmailOtp] = useState(['', '', '', '']);
  const [seconds, setSeconds] = useState(0);
  const [canResend, setCanResend] = useState(false);
  const [forgotData, setForgotData] = useState({
    mobile: '',
    email: '',
  });
  const mobileOtpInputs = useRef([]);
  const emailOtpInputs = useRef([]);

  useEffect(() => {
    let interval = null;

    if (seconds > 0) {
      interval = setInterval(() => {
        setSeconds(prev => prev - 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [seconds]);

  const formatTime = time => {
    const mins = Math.floor(time / 60);
    const secs = time % 60;

    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleMobileChange = (text, index) => {
    if (!/^[0-9]*$/.test(text)) return;

    const newOtp = [...mobileOtp];
    newOtp[index] = text;
    setMobileOtp(newOtp);

    if (text && index < 3) {
      mobileOtpInputs.current[index + 1].focus();
    }
  };

  const handleMobileKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !mobileOtp[index] && index > 0) {
      mobileOtpInputs.current[index - 1].focus();
    }
  };

  const handleEmailChange = (text, index) => {
    if (!/^[0-9]*$/.test(text)) return;

    const newOtp = [...emailOtp];
    newOtp[index] = text;
    setEmailOtp(newOtp);

    if (text && index < 3) {
      emailOtpInputs.current[index + 1].focus();
    }
  };

  const handleEmailKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !emailOtp[index] && index > 0) {
      emailOtpInputs.current[index - 1].focus();
    }
  };

  const clearForgotForm = () => {
    setForgotData({
      mobile: '',
      email: '',
    });
  };

  const sendOtps = () => {
    if (validateForm()) {
      setSeconds(60);
      setErrorMessage(
        'OTP send to registered mobile number and email address!',
        'success',
      );
      setShowOtp(true);
    }
  };

  const validateForm = () => {
    if (!forgotData.mobile.trim()) {
      setErrorMessage('Please enter mobile number!', 'error');
      return false;
    } else if (!validateMobile(forgotData.mobile)) {
      setErrorMessage(
        'Mobile number must start with 6, 7, 8, or 9 and contain 10 digits!',
        'error',
      );
      return false;
    }

    if (!forgotData.email.trim()) {
      setErrorMessage('Please enter email address!', 'error');
      return false;
    } else if (!validateEmail(forgotData.email)) {
      setErrorMessage('Enter a valid email address!', 'error');
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

  const handleChange = (key, value) => {
    setForgotData(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const setErrorMessage = (message, type) => {
    Toast.show({
      type: type,
      text1: message,
      position: 'bottom',
    });
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
              <Text style={globalStyles.subTitle}>
                Forgot your password? We’ve got you covered
              </Text>
            </View>
            <View style={styles.body}>
              <View style={styles.card}>
                <Text style={globalStyles.label}>Mobile Number</Text>
                <TextInput
                  placeholder="Mobile number"
                  style={globalStyles.input}
                  keyboardType="phone-pad"
                  autoCapitalize="words"
                  autoComplete="false"
                  value={forgotData.mobile}
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
                  value={forgotData.email}
                  onChangeText={text => handleChange('email', text)}
                />

                {showOtp && (
                  <>
                    <Text style={globalStyles.label}>Mobile OTP</Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        gap: 10,
                      }}
                    >
                      {mobileOtp.map((value, index) => (
                        <TextInput
                          key={index}
                          value={value}
                          placeholder="0"
                          ref={ref => (mobileOtpInputs.current[index] = ref)}
                          onChangeText={text => handleMobileChange(text, index)}
                          onKeyPress={e => handleMobileKeyPress(e, index)}
                          keyboardType="number-pad"
                          maxLength={1}
                          style={{
                            flex: 1,
                            borderWidth: 1,
                            borderColor: '#ccc',
                            backgroundColor: colors.secondary,
                            paddingVertical: 10,
                            textAlign: 'center',
                            borderRadius: 5,
                            color: colors.primary,
                            fontFamily: fonts.bold,
                            fontSize: 14,
                          }}
                        />
                      ))}
                    </View>

                    <Text style={globalStyles.label}>Email OTP</Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        gap: 10,
                      }}
                    >
                      {emailOtp.map((value, index) => (
                        <TextInput
                          key={index}
                          value={value}
                          placeholder="0"
                          ref={ref => (emailOtpInputs.current[index] = ref)}
                          onChangeText={text => handleEmailChange(text, index)}
                          onKeyPress={e => handleEmailKeyPress(e, index)}
                          keyboardType="number-pad"
                          maxLength={1}
                          style={{
                            flex: 1,
                            borderWidth: 1,
                            borderColor: '#ccc',
                            backgroundColor: colors.secondary,
                            paddingVertical: 10,
                            textAlign: 'center',
                            borderRadius: 5,
                            color: colors.primary,
                            fontFamily: fonts.bold,
                          }}
                        />
                      ))}
                    </View>
                  </>
                )}

                {showOtp &&
                  (seconds > 0 ? (
                    <Text style={styles.timerText}>
                      Resend OTP in {formatTime(seconds)}
                    </Text>
                  ) : (
                    <TouchableOpacity onPress={sendOtps}>
                      <Text style={styles.resendText}>Resend OTP</Text>
                    </TouchableOpacity>
                  ))}

                <View style={styles.buttons}>
                  <TouchableOpacity
                    style={[
                      styles.button,
                      selected == 'forgot' && styles.buttonPressed,
                    ]}
                    activeOpacity={0.9}
                    onPressIn={() => setSelected('forgot')}
                    onPressOut={() => setSelected('')}
                    onPress={sendOtps}
                  >
                    <Text
                      style={[
                        styles.buttonText,
                        selected == 'forgot' && styles.buttonTextPressed,
                      ]}
                    >
                      SEND OTP
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
                    onPress={clearForgotForm}
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
                  <TouchableOpacity onPress={() => navigation.replace('Login')}>
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
  timerText: {
    marginTop: 10,
    fontSize: 15,
    color: 'red',
    fontFamily: fonts.regular
  },

  resendText: {
    marginTop: 10,
    fontSize: 15,
    color: '#2563eb',
    fontWeight: 'bold',
    fontFamily: fonts.regular
  },
});