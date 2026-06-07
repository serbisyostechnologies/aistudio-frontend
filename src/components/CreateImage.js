import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  BackHandler,
  Image,
  StatusBar,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useState, useEffect } from 'react';
import Toast from 'react-native-toast-message';
import { toastConfig } from '../../src/utils/toastConfig';
import AnimatedTextLoader from '../components/AnimatedTextLoader';
import { createImage } from '../../src/api/endPoints';
import { useSelector } from 'react-redux';
import { shareImage, downloadImage } from '../utils/Utilities';
import { globalStyles, colors, fonts } from '../styles/globalStyles';
import { useDispatch } from 'react-redux';
import { updateCredits } from '../redux/slices/authSlice';

export default function CreateImage({ navigation }) {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  const user_id = user._id;
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [newImageUri, setNewImageUri] = useState('');
  const [selectedImageSize, setSelectedImageSize] = useState('1024x1024');
  const [selectedImage, setSelectedImage] = useState('Square');
  const imageSizes = [
    {
      key: 'square',
      label: 'Square',
      value: '1024x1024',
    },
    {
      key: 'landscape',
      label: 'Landscape',
      value: '1536x1024',
    },
    {
      key: 'portrait',
      label: 'Portrait',
      value: '1024x1536',
    },
  ];

  const loadingTexts = [
    'Dreaming in pixels...',
    'Building your imagination...',
    'Turning ideas into art...',
    'Creating something amazing...',
    'Visualizing your prompt...',
  ];

  const prompts = [
    'A majestic dragon flying over snowy mountains at sunset',
    'A magical forest with glowing trees and floating lights',
    'A futuristic cyberpunk city with neon lights and flying cars',
    'An astronaut walking on Mars with Earth visible in the sky',
    'A peaceful lake surrounded by mountains during sunrise',
    'A tropical beach with crystal clear water and palm trees',
    'A realistic portrait of a warrior queen wearing golden armor',
    'A smiling child in a colorful raincoat standing in the rain',
    'Anime boy standing under cherry blossoms in Tokyo',
    'Cute cartoon cat wearing sunglasses and a hoodie',
    'A panda working on a laptop in a modern office',
    'A tiny village inside a glass bottle',
  ];

  useEffect(() => {
    const backAction = () => {
      if (loading) {
        return true;
      }

      return false;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [loading]);

  const createImageClicked = async () => {
    setNewImageUri('');
    setSubmitted(true);
    if (!prompt.trim()) {
      setToastMessage('Please enter image description to create!', 'error');
      return;
    }
    try {
      setLoading(true);
      const response = await createImage({
        prompt,
        user_id,
        image_size: selectedImageSize,
      });
      setLoading(false);
      const data = response.data;
      console.log(data);
      if (data.success) {
        dispatch(updateCredits(data.credits));
        clearPrompt();
        setToastMessage('Image created successfully!', 'success');
        setNewImageUri(data.image_url);
      } else {
        setToastMessage('Failed to create image!', 'error');
      }
    } catch (error) {
      setLoading(false);
      setToastMessage('Failed to create image!', 'error');
    }
  };

  const setToastMessage = (message, type) => {
    Toast.show({
      type: type,
      text1: message,
      position: 'bottom',
    });
  };

  const promptChanged = text => {
    setSubmitted(false);
    setPrompt(text);
  };

  const selectPrompt = text => {
    setPrompt(text);
    setShowMenu(false);
  };

  const clearPrompt = () => {
    setPrompt('');
    setSubmitted(false);
  };

  const imageSizeSelected = image => {
    setSelectedImageSize(image.value);
    setSelectedImage(image.label);
  };

  return (
    <>
      <View
        style={{
          height: 0,
          backgroundColor: colors.primary,
        }}
      />
      <StatusBar backgroundColor={colors.primary} barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          disabled={loading}
        >
          <Ionicons name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.title}>AI Image</Text>
      </View>
      <KeyboardAvoidingView
        style={globalStyles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          nestedScrollEnabled={true}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
            {!loading && newImageUri && (
              <View style={styles.iconRow}>
                <TouchableOpacity
                  style={styles.downloadBtn}
                  onPress={() => shareImage(newImageUri, setToastMessage)}
                >
                  <Ionicons name="share-social" size={20} color="white" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.downloadBtn}
                  onPress={() => downloadImage(newImageUri, setToastMessage)}
                >
                  <Ionicons name="arrow-down-outline" size={20} color="white" />
                </TouchableOpacity>
              </View>
            )}
            {loading && <AnimatedTextLoader texts={loadingTexts} />}
            {!loading && newImageUri && (
              <Image
                source={{
                  uri: newImageUri,
                }}
                style={{
                  width: '100%',
                  height: '100%',
                  paddingVertical: 10,
                  paddingHorizontal: 10,
                }}
                resizeMode="contain"
              />
            )}
            {!loading && !newImageUri && (
              <Ionicons name="image-outline" size={200} color="gray" />
            )}
          </View>

          <View style={styles.row}>
            {imageSizes.map((item, index) => (
              <TouchableOpacity
                style={[
                  styles.box,
                  selectedImage == item.label && styles.selectedBox,
                  ,
                  index === 0 && {
                    borderTopLeftRadius: 10,
                    borderBottomLeftRadius: 10,
                  },

                  index === imageSizes.length - 1 && {
                    borderTopRightRadius: 10,
                    borderBottomRightRadius: 10,
                  },
                ]}
                key={item.key}
                onPress={() => imageSizeSelected(item)}
                disabled={loading}
              >
                <View>
                  <Text
                    style={{
                      color: selectedImage == item.label ? '#003a6b' : '#fff',
                      fontFamily: 'saira-bold',
                      fontSize: 16,
                    }}
                  >
                    {item.label}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Describe the image you want to create..."
              multiline
              style={[
                styles.input,
                submitted && !prompt.trim() && !loading && styles.inputError,
              ]}
              textAlignVertical="top"
              numberOfLines={4}
              value={prompt}
              onChangeText={text => promptChanged(text)}
              editable={!loading}
            />
            <TouchableOpacity
              style={styles.listButton}
              onPress={() => setShowMenu(!showMenu)}
              disabled={loading}
            >
              <Ionicons name="list" size={22} color="#003a6b" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => clearPrompt()}
              disabled={loading}
            >
              <Ionicons name="close-outline" size={22} color="#003a6b" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.sendButton}
              onPress={() => createImageClicked()}
              disabled={loading}
            >
              <Ionicons name="send" size={22} color="#003a6b" />
            </TouchableOpacity>
          </View>

          {showMenu && (
            <View style={styles.menuWrapper}>
              <View style={styles.menuContainer}>
                <View style={styles.menuHeading}>
                  <Text style={styles.headingTitle}>AI Prompts</Text>
                </View>
                <ScrollView
                  style={{ maxHeight: 400 }}
                  nestedScrollEnabled={true}
                  showsVerticalScrollIndicator={false}
                >
                  {prompts.map((item, index) => (
                    <TouchableOpacity
                      key={index}
                      style={{
                        paddingVertical: 10,
                        paddingHorizontal: 16,
                        borderBottomWidth: index !== prompts.length - 1 ? 1 : 0,
                        borderBottomColor: '#f2f2f2',
                      }}
                      onPress={() => selectPrompt(item)}
                    >
                      <Text
                        style={{
                          fontSize: 16,
                          color: '#003a6b',
                          fontFamily: 'saira-italic',
                        }}
                      >
                        {item}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
      <Toast config={toastConfig} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scroll: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 15,
    backgroundColor: '#003a6b',
  },
  title: {
    fontSize: 20,
    marginLeft: 15,
    color: '#fff',
    fontFamily: 'saira-bold',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 550,
  },
  inputContainer: {
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
  },

  input: {
    minHeight: 120,
    maxHeight: 120,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 12,
    fontSize: 16,
    color: '#003a6b',
    fontFamily: 'saira',
    paddingTop: 25,
    textAlignVertical: 'top',
  },
  sendButton: {
    position: 'absolute',
    bottom: 10,
    right: 8,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearButton: {
    position: 'absolute',
    top: 10,
    right: 8,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listButton: {
    position: 'absolute',
    top: 10,
    right: 50,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputError: {
    borderColor: 'red',
    borderWidth: 1,
  },
  menuWrapper: {
    position: 'absolute',
    bottom: 130,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 9999
  },
  menuContainer: {
    width: '95%',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingVertical: 10,
    elevation: 8,
    shadowColor: '#003a6b',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    overflow: 'scroll',
    marginBottom: 50,
  },
  row: {
    flexDirection: 'row',
    width: '100%',
    paddingHorizontal: 12,
  },
  box: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: '#003a6b',
    backgroundColor: '#003a6b',
    color: '#fff',
  },
  selectedBox: {
    borderColor: '#003a6b',
    backgroundColor: '#fff',
  },
  downloadBtn: {
    backgroundColor: '#003a6b',
    padding: 10,
    borderRadius: 100,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'saira-bold',
  },
  iconRow: {
    position: 'absolute',
    bottom: 5,
    right: 20,
    zIndex: 10,
    borderRadius: 100,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    gap: 10,
  },
  headingTitle: {
    color: colors.secondary,
    fontFamily: fonts.bold
  },
  menuHeading: {
    backgroundColor: colors.primary,
    padding: 15,
    fontSize: 15
  },
});