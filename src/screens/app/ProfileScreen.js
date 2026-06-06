import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Image,
  StatusBar,
  Modal,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import CustomAlert from '../../components/CustomAlert';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { toastConfig } from '../../utils/toastConfig';
import Loader from '../../components/Loader';
import {
  removeProfilePhotoApi,
  uploadProfilePhotoApi,
} from '../../api/endPoints';
import {
  updateProfilePhotoUrl,
  removeProfilePhotoUrl,
} from '../../redux/slices/authSlice';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { requestPermissions } from '../../components/RequestPermissions';
import ProCropper from '../../components/ProCropper';

export default function ProfileScreen({ navigation }) {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  const profilePhoto = useSelector(state => state.auth.user.profile_url);
  const [modalVisible, setModalVisible] = useState(false);
  const [showLogoutAlert, setShowLogoutAlert] = useState(false);
  const [cropModalVisible, setCropModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profilePhotoUrl, setProfilePhotoUrl] = useState(profilePhoto);
  const [selectedImageUrl, setSelectedImageUrl] = useState(null);
  const options = [
    { title: 'Edit Profile', icon: 'create-outline', action: 'editProfile' },
    {
      title: 'Reset Password',
      icon: 'refresh-outline',
      action: 'resetPassword',
    },
    {
      title: 'Help & Support',
      icon: 'help-circle-outline',
      action: 'helpSupport',
    },
    {
      title: 'Privacy Policy',
      icon: 'lock-closed-outline',
      action: 'privacyPolicy',
    },
    {
      title: 'Logout',
      icon: 'log-out-outline',
      danger: true,
      action: 'logout',
    },
  ];

  const selectMediaOption = () => {
    setModalVisible(true);
  };

  const handleAction = action => {
    switch (action) {
      case 'editProfile':
        break;
      case 'resetPassword':
        break;
      case 'helpSupport':
        break;
      case 'privacyPolicy':
        break;
      case 'logout':
        userLogout();
        break;
    }
  };

  const userLogout = () => {
    setShowLogoutAlert(true);
  };

  const logoutClicked = () => {
    try {
    } catch (error) {}
    dispatch(logout());
    navigation.replace('Welcome');
  };

  const onRemovePhotoClicked = async () => {
    setModalVisible(false);
    try {
      setLoading(true);
      const response = await removeProfilePhotoApi({ user_id: user.id });
      const data = response.data;
      setLoading(false);
      if (data.success) {
        dispatch(removeProfilePhotoUrl(''));
        setProfilePhotoUrl(null);
        setToastMessage('Profile photo removed successfully!', 'success');
      } else {
        setToastMessage('Failed to remove profile photo!', 'error');
      }
    } catch (error) {
      setLoading(false);
      setToastMessage('Failed to remove profile photo!', 'error');
    }
  };

  const setToastMessage = (message, type) => {
    Toast.show({
      type: type,
      text1: message,
      position: 'bottom',
    });
  };

  const openPicker = async media => {
    setModalVisible(false);
    const permission = await requestPermissions();

    if (!permission) {
      setToastMessage('Camera & Gallery permissions required', 'error');
      return;
    }

    if (media == 'CAMERA') {
      openCamera();
    } else {
      openGallery();
    }
  };

  const openCamera = async () => {
    const result = await launchCamera({
      mediaType: 'photo',
      quality: 1,
      saveToPhotos: true,
    });

    if (!result.didCancel) {
      setSelectedImageUrl(result.assets[0].uri);
      setCropModalVisible(true);
    }
  };

  const openGallery = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 1,
    });

    if (!result.didCancel) {
      setSelectedImageUrl(result.assets[0].uri);
      setCropModalVisible(true);
    }
  };

  const saveProfilePhoto = async croppedUri => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('user_id', user._id);
      formData.append('avatar', {
        uri: croppedUri,
        name: user.id + '.jpg',
        type: 'image/jpeg',
      });

      const response = await uploadProfilePhotoApi(formData);
      const updatedUrl = response.data.profile_url;

      setProfilePhotoUrl(updatedUrl);
      dispatch(updateProfilePhotoUrl(updatedUrl));
      setLoading(false);
      setToastMessage('Profile photo uploaded successfully!', 'success');
    } catch (error) {
      setLoading(false);
      setToastMessage('Failed to update profile photo!', 'error');
    }
  };

  return (
    <>
      <StatusBar backgroundColor="#003a6b" barStyle="light-content" />
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <View style={styles.header}>
            <Pressable onPress={() => selectMediaOption()}>
              <View style={styles.avatar}>
                {!profilePhotoUrl && (
                  <Text style={styles.avatarText}>
                    {user?.name[0].toUpperCase()}
                  </Text>
                )}
                {profilePhotoUrl && (
                  <Image
                    source={{ uri: profilePhotoUrl }}
                    style={styles.avatarImage}
                    resizeMode="contain"
                  />
                )}
              </View>
            </Pressable>

            <Text style={styles.name}>{user?.name}</Text>
            <Text style={styles.email}>{user?.email}</Text>
          </View>

          <View style={styles.section}>
            {options.map((item, index) => (
              <Pressable
                key={index}
                style={styles.option}
                onPress={() => handleAction(item.action)}
              >
                <View style={styles.optionLeft}>
                  <Ionicons
                    name={item.icon}
                    size={22}
                    color={item.danger ? 'red' : '#003a6b'}
                  />
                  <Text
                    style={[styles.optionText, item.danger && { color: 'red' }]}
                  >
                    {item.title}
                  </Text>
                </View>

                <Ionicons name="chevron-forward" size={20} color="#999" />
              </Pressable>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
      <Toast config={toastConfig} />
      <Loader visible={loading} />
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={mstyles.overlay}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => setModalVisible(false)}
          />

          <View style={mstyles.modal}>
            <Pressable
              style={mstyles.option}
              onPress={() => openPicker('CAMERA')}
            >
              <Ionicons name="camera" size={26} color="#003a6b" />
              <Text style={mstyles.text}>Camera</Text>
            </Pressable>

            <Pressable
              style={mstyles.option}
              onPress={() => openPicker('GALLERY')}
            >
              <Ionicons name="images" size={26} color="#003a6b" />
              <Text style={mstyles.text}>Gallery</Text>
            </Pressable>

            <Pressable style={mstyles.option} onPress={onRemovePhotoClicked}>
              <Ionicons name="close-circle-outline" size={26} color="#003a6b" />
              <Text style={mstyles.text}>Remove photo</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <CustomAlert
        visible={showLogoutAlert}
        message="Are you sure you want to logout?"
        cancelText="CANCEL"
        confirmText="LOGOUT"
        onCancel={() => setShowLogoutAlert(false)}
        onConfirm={() => {
          logoutClicked();
        }}
      />
      <ProCropper
        visible={cropModalVisible}
        imageUri={selectedImageUrl}
        onClose={() => setCropModalVisible(false)}
        onUpload={croppedUri => {
          setCropModalVisible(false);
          saveProfilePhoto(croppedUri);
        }}
        onChange={() => setModalVisible(true)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fb',
  },

  header: {
    backgroundColor: '#003a6b',
    paddingVertical: 30,
    alignItems: 'center',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },

  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    overflow: 'hidden',
  },

  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#003a6b',
  },

  avatarImage: {
    width: '100%',
    height: '100%',
  },

  name: {
    fontSize: 20,
    color: '#fff',
    fontFamily: 'saira-bold',
  },

  email: {
    fontSize: 14,
    color: '#dbe9ff',
    marginTop: 2,
    fontFamily: 'saira-bold',
  },

  section: {
    marginTop: 10,
    paddingHorizontal: 15,
  },

  option: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    elevation: 2,
  },

  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  optionText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#003a6b',
    fontFamily: 'saira-bold',
  },
});

const mstyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  button: {
    backgroundColor: '#000',
    padding: 12,
    borderRadius: 10,
  },

  image: {
    width: 200,
    height: 200,
    marginTop: 20,
    borderRadius: 10,
  },

  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },

  modal: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
  },

  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 10,
  },

  text: {
    fontSize: 14,
    color: '#003a6b',
    fontFamily: 'saira-bold',
  },
});