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
import CustomGalleryModal from "../utils/CustomGalleryModal";

export default function CreatePhotoCollage({ navigation }) {
  const defaultPrompt =
    'Create a beautiful modern photo collage using the uploaded images.\n\nRequirements:\n- Professional layout\n- Clean spacing\n- Instagram style collage\n- High quality\n- Balanced composition\n- Add subtle shadows\n- Smooth rounded corners\n\nReturn only the final collage image.';
  const user = useSelector(state => state.auth.user);
  const user_id = user._id;
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState(defaultPrompt);
  const [submitted, setSubmitted] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [newImageUri, setNewImageUri] = useState('');
  const [selectedImageSize, setSelectedImageSize] = useState('1024x1024');
  const [selectedImage, setSelectedImage] = useState('Square');
  const [showGallery, setShowGallery] = useState(false);
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
    'Gathering your memories...',
    'Arranging photos beautifully...',
    'Creating your perfect collage...',
    'Blending moments together...',
    'Designing your photo story...',
    'Crafting a stunning layout...',
    'Combining images creatively...',
    'Building your collage masterpiece...',
    'Styling your photo collection...',
    'Making every picture shine...',
  ];

  const prompts = [
    'A stylish travel collage with beach photos, sunsets, and tropical vibes',
    'A family memories collage with warm tones and polaroid-style frames',
    'A birthday party collage with balloons, cake, and colorful decorations',
    'A romantic photo collage with roses, heart shapes, and soft lighting',
    'A modern aesthetic collage with fashion photos and minimal design',
    'A vacation collage featuring mountains, lakes, and adventure moments',
    'A scrapbook-style collage with stickers, handwritten notes, and memories',
    'A pet photo collage with cute paw prints and playful backgrounds',
    'A wedding memories collage with elegant floral decorations',
    'A music festival collage with neon lights and concert moments',
    'A nature-themed collage with forests, waterfalls, and wildlife',
    'A colorful friendship collage with fun selfies and vibrant patterns',
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

  const setToastMessage = (message, type) => {
    Toast.show({
      type: type,
      text1: message,
      position: 'bottom',
    });
  };

  const selectPrompt = text => {
    setPrompt(text);
    setShowMenu(false);
  };

  const clearPrompt = () => {
    setSubmitted(false);
    setPrompt(defaultPrompt);
  };

  const promptChanged = text => {
    setSubmitted(false);
    setPrompt(text);
  };

  const imageSizeSelected = image => {
    setSelectedImageSize(image.value);
    setSelectedImage(image.label);
  };

  const createPhotoCollageClicked = () => {};

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

        <Text style={styles.title}>Create Photo Collage using AI</Text>
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
            <View style={styles.iconRow}>
              {!loading && !newImageUri && (
                <TouchableOpacity
                  style={styles.downloadBtn}
                  onPress={() => setShowGallery(true)}
                >
                  <Ionicons name="add-outline" size={20} color="white" />
                </TouchableOpacity>
              )}
              {!loading && newImageUri && (
                <>
                  <TouchableOpacity
                    style={styles.downloadBtn}
                    onPress={() => downloadImage(newImageUri, setToastMessage)}
                  >
                    <Ionicons name="create-outline" size={20} color="white" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.downloadBtn}
                    onPress={() => shareImage(newImageUri)}
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
              onPress={() => createPhotoCollageClicked()}
              disabled={loading}
            >
              <Ionicons name="send" size={22} color="#003a6b" />
            </TouchableOpacity>
          </View>

          {showMenu && (
            <View style={styles.menuWrapper}>
              <View style={styles.menuContainer}>
                <ScrollView
                  style={{ maxHeight: 200 }}
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
      <CustomGalleryModal
        visible={showGallery}
        onClose={() => setShowGallery(false)}
        onDone={(images) => console.log(images)}
        selectionLimit={6}
      />
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
    bottom: 100,
    left: 0,
    right: 0,
    alignItems: 'center',
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
    borderRadius: 10,
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