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
  Modal,
  Pressable,
} from 'react-native';
import { globalStyles, colors, fonts } from '../styles/globalStyles';
import { useState, useEffect } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-toast-message';
import { toastConfig } from '../../src/utils/toastConfig';
import { shareImage, downloadImage } from '../utils/Utilities';
import { useSelector } from 'react-redux';
import AnimatedTextLoader from '../components/AnimatedTextLoader';
import { pickImage } from '../utils/ImagePicker';
import { requestPermissions } from '../components/RequestPermissions';
import { editImage } from '../api/endPoints';

export default function EditImage({ navigation, route }) {
  const { image } = route.params;
  const user = useSelector(state => state.auth.user);
  const user_id = user._id;
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [newImageUri, setNewImageUri] = useState('');
  const [selectedImageSize, setSelectedImageSize] = useState('1024x1024');
  const [selectedImage, setSelectedImage] = useState('Square');
  const [modalVisible, setModalVisible] = useState(false);
  const [userImage, setUserImage] = useState(image);
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

  const prompts = [
    'Add cinematic lighting',
    'Add dramatic shadows',
    'Add neon glow effect',
    'Add realistic rain effect',
    'Add snow winter atmosphere',
    'Add luxury golden aesthetic',
    'Add dreamy pastel tones',
    'Add vintage film effect',
    'Add retro 90s aesthetic',
    'Add cyberpunk neon style',
    'Add anime art style',
    'Add Studio Ghibli-inspired look',
    'Add watercolor painting effect',
    'Add oil painting texture',
    'Add realistic fire effects',
    'Add glowing aura effect',
    'Add bokeh background blur',
    'Add depth-of-field effect',
    'Add cinematic movie color grading',
    'Add professional studio lighting',
    'Add fantasy magical atmosphere',
    'Add futuristic sci-fi background',
    'Add luxury fashion editorial style',
    'Add comic-book illustration style',
    'Add realistic reflections',
    'Add glossy premium finish',
    'Add soft aesthetic lighting',
    'Add sunset golden-hour lighting',
    'Add moody dark atmosphere',
    'Add vibrant tropical colors',
    'Convert into cartoon style',
    'Convert into realistic 3D render',
    'Convert into pixel art style',
    'Convert into sketch drawing',
    'Convert into clay art style',
    'Convert into low-poly art',
    'Convert into fantasy artwork',
    'Convert into cinematic portrait',
    'Convert into futuristic avatar',
    'Remove background cleanly',
    'Replace background with beach',
    'Replace background with mountains',
    'Replace background with city skyline',
    'Replace background with luxury interior',
    'Enhance image sharpness',
    'Enhance facial details',
    'Enhance overall image quality',
    'Improve colors and contrast',
    'Make image ultra realistic',
    'Make image look professional',
  ];

  const loadingTexts = [
    'Analyzing your image...',
    'Applying creative enhancements...',
    'Transforming your photo beautifully...',
    'Adding cinematic effects...',
    'Enhancing colors and lighting...',
    'Creating stunning visual edits...',
    'Improving image quality...',
    'Generating artistic transformations...',
    'Refining every detail...',
    'Adding premium visual effects...',
    'Reimagining your image...',
    'Applying aesthetic styling...',
    'Upgrading your photo creatively...',
    'Crafting your edited masterpiece...',
    'Enhancing textures and depth...',
    'Adding realistic lighting effects...',
    'Building your perfect edit...',
    'Creating professional-grade visuals...',
    'Stylizing your image artistically...',
    'Making your image extraordinary...',
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

  const selectMediaOption = option => {
    setModalVisible(true);
  };

  const openPicker = async media => {
    setModalVisible(false);
    const image = await pickImage({
      type: media,
      requestPermissions,
      setToastMessage,
    });

    if (!image) return;

    setUserImage(image);
  };

  const clearPrompt = () => {
    setSubmitted(false);
    setPrompt('');
  };

  const promptChanged = text => {
    setSubmitted(false);
    setPrompt(text);
  };

  const selectPrompt = text => {
    setPrompt(text);
    setShowMenu(false);
  };

  const clearImagePrompt = () => {
    setPrompt('');
    setSubmitted(false);
  };

  const imageSizeSelected = image => {
    setSelectedImageSize(image.value);
    setSelectedImage(image.label);
  };

  const editImageClicked = async () => {
    setNewImageUri('');
    setSubmitted(true);
    try {
      setLoading(true);
      console.log(userImage);
      const formData = new FormData();
      formData.append('prompt', prompt);
      formData.append('image_size', selectedImageSize);
      formData.append('user_id', user_id);
      formData.append('userImage', {
        uri: userImage.uri,
        name: userImage.fileName,
        type: userImage.type,
      });

      const response = await editImage(formData);
      console.log(response.data);
      setLoading(false);
      const data = response.data;
      if (data.success) {
        clearImagePrompt();
        clearImagePrompt();
        setToastMessage('Image edited successfully!', 'success');
        setNewImageUri(data.edited_url);
      } else {
        setNewImageUri('');
        setToastMessage('Failed to edit image!', 'error');
      }
    } catch (error) {
      setLoading(false);
      setToastMessage('Failed to edit image!', 'error');
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
      <View
        style={{
          height: 0,
          backgroundColor: colors.primary,
        }}
      />
      <StatusBar backgroundColor={colors.primary} barStyle="light-content" />
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          disabled={loading}
        >
          <Ionicons name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.title}>Edit Image</Text>
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
            {loading && <AnimatedTextLoader texts={loadingTexts} />}
            {!loading && !newImageUri && userImage && (
              <Image
                source={{
                  uri: userImage.uri,
                }}
                style={{
                  width: '90%',
                  height: '90%',
                  paddingVertical: 10,
                  paddingHorizontal: 10,
                }}
                resizeMode="contain"
              />
            )}
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
            <View style={styles.iconRow}>
              <TouchableOpacity
                style={styles.downloadBtn}
                onPress={() => selectMediaOption()}
              >
                <Ionicons name="create-outline" size={20} color="white" />
              </TouchableOpacity>
              {!loading && newImageUri && (
                <>
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
                    <Ionicons
                      name="arrow-down-outline"
                      size={20}
                      color="white"
                    />
                  </TouchableOpacity>
                </>
              )}
            </View>
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
              placeholder="Describe/select from menu edits like background, lighting, style, colors..."
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
              onPress={() => editImageClicked()}
              disabled={loading}
            >
              <Ionicons name="send" size={22} color="#003a6b" />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      {showMenu && (
        <View style={styles.menuWrapper}>
          <View style={styles.menuContainer}>
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
      <Toast config={toastConfig} />
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
          </View>
        </View>
      </Modal>
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
    zIndex: 9999,
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