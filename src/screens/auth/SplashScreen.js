import React, { useRef, useEffect } from 'react';
import { View, Text, Animated, StatusBar, Platform } from 'react-native';
import { useSelector } from 'react-redux';
import { globalStyles, colors } from '../../styles/globalStyles';
import DeviceInfo from 'react-native-device-info';
import { useDispatch } from 'react-redux';
import { updateDeviceId, updateFcmToken } from '../../redux/slices/authSlice';
import { getFcmToken } from "../../utils/NotificationPermission";

export default function SplashScreen({ navigation }) {
  const dispatch = useDispatch();
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn);


  const getDeviceId = async () => {
    const deviceId = await DeviceInfo.getUniqueId();
    dispatch(updateDeviceId(deviceId));
  };

  const storeFcmToken = async () => {
    const fcmToken = await getFcmToken();
    dispatch(updateFcmToken(fcmToken));
  }

  useEffect(() => {
    getDeviceId();
    storeFcmToken();
  }, [])

  useEffect(() => {
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();

    setTimeout(() => {
      if (isLoggedIn) {
        navigation.replace('AppHome');
      } else {
        navigation.replace('Welcome');
      }
    }, 2000);
  }, []);

  return (
    <View style={globalStyles.welcomeContainer}>
      <StatusBar
        backgroundColor={colors.primary}
        barStyle="light-content"
        translucent={false}
      />
      <Animated.View
        style={{
          transform: [{ scale: scaleAnim }],
        }}
      >
        <Text style={globalStyles.welcomeText}>AISerbisyosStudio</Text>
      </Animated.View>
    </View>
  );
}