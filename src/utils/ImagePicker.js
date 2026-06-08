import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

export const pickImage = async ({
  type = 'GALLERY',
  fileType = 'image',
  requestPermissions,
  setToastMessage,
}) => {
  try {
    const permission = await requestPermissions();

    if (!permission) {
      setToastMessage('Camera & Gallery permissions required', 'error');
      return null;
    }

    let result;

    if (type === 'CAMERA') {
      result = await launchCamera({
        mediaType: fileType,
        quality: 1,
        saveToPhotos: true,
      });
    } else {
      result = await launchImageLibrary({
        mediaType: fileType,
        quality: 1,
      });
    }

    if (result?.didCancel || !result?.assets?.length) {
      return null;
    }

    return result.assets[0];
  } catch (error) {
    console.log(error);
    return null;
  }
};