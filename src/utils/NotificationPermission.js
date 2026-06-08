import { Alert, Platform, PermissionsAndroid } from 'react-native';
import { getApp } from '@react-native-firebase/app';
import {
  getMessaging,
  getToken,
  requestPermission,
  AuthorizationStatus,
} from '@react-native-firebase/messaging';

const messaging = getMessaging(getApp());

export const requestUserPermission = async () => {
  try {
    if (Platform.OS === 'android' && Platform.Version >= 33) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );

      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        Alert.alert('Permission denied');
        return false;
      }
    }

    const authStatus = await requestPermission(messaging);
    const enabled =
      authStatus === AuthorizationStatus.AUTHORIZED ||
      authStatus === AuthorizationStatus.PROVISIONAL;
    if (enabled) {
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
};

export const getFcmToken = async () => {
  try {
    const hasPermission = await requestUserPermission();
    if (!hasPermission) {
      return null;
    }

    const token = await getToken(messaging);
    return token;
  } catch (error) {
    console.log('FCM token error:', error);
    return null;
  }
};