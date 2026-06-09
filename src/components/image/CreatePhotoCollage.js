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
  StatusBar,
  FlatList,
  Image,
  Dimensions,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useState, useEffect } from 'react';
import Toast from 'react-native-toast-message';
import { toastConfig } from '../../../src/utils/toastConfig';
import { createCollage } from '../../api/endPoints';
import { useSelector } from 'react-redux';
import { shareImage, downloadImage } from '../../utils/Utilities';
import { globalStyles, colors, fonts } from '../../styles/globalStyles';
import CustomGalleryModal from '../../utils/CustomGalleryModal';
import AnimatedTextLoader from '../AnimatedTextLoader';
import CustomAlert from '../CustomAlert';
import { useDispatch } from 'react-redux';
import { updateCredits } from '../../redux/slices/authSlice';

const screenWidth = Dimensions.get('window').width - 40;

export default function CreatePhotoCollage({ navigation }) {
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
  const [selectedImages, setSelectedImages] = useState([]);
  const [showGallery, setShowGallery] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
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
    'Artistic photo mosaic design',
    'Asymmetrical artistic composition',
    'Cinematic movie-poster layout',
    'Comic-book panel layout',
    'Cozy travel journal aesthetic',
    'Dark moody cinematic layout',
    'Dreamy pastel aesthetic composition',
    'Dynamic diagonal photo layout',
    'Editorial fashion collage aesthetic',
    'Elegant wedding photo collage',
    'Film-strip inspired composition',
    'Floating photo card layout',
    'Geometric photo composition',
    'Grid-based modern collage layout',
    'Handcrafted scrapbook arrangement',
    'Layered paper cutout composition',
    'Luxury brand campaign aesthetic',
    'Luxury Instagram collage design',
    'Minimal clean white-space layout',
    'Modern Canva-style collage template',
    'Modern magazine-style collage',
    'Neon cyberpunk collage style',
    'Pinterest aesthetic scrapbook style',
    'Polaroid overlapping photo style',
    'Premium social media poster design',
    'Retro vintage memory board style',
    'Soft beige aesthetic background',
    'Symmetrical gallery-style arrangement',
    'Torn paper scrapbook effect',
    'Vibrant vacation postcard style',
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
    setPrompt('');
  };

  const promptChanged = text => {
    setSubmitted(false);
    setPrompt(text);
  };

  const imageSizeSelected = image => {
    setSelectedImageSize(image.value);
    setSelectedImage(image.label);
  };

  const createPhotoCollageClicked = async () => {
    if (selectedImages.length == 0) {
      setToastMessage('Please select images to create collage!', 'error');
      return;
    }

    setNewImageUri('');
    setSubmitted(true);
    try {
      setLoading(true);
      const formData = new FormData();
      const cleanPrompt = prompt.replace(/\n/g, ' ');
      formData.append('prompt', cleanPrompt);
      formData.append('image_size', selectedImageSize);
      formData.append('user_id', user_id);

      selectedImages.forEach((img, index) => {
        formData.append('images', {
          uri: img.uri,
          type: img.type,
          name: img.fileName || `image-${index}.jpg`,
        });
      });
      const response = await createCollage(formData);
      setLoading(false);
      const data = response.data;
      if (data.success) {
        dispatch(updateCredits(data.credits));
        setSelectedImages([]);
        clearPrompt();
        setToastMessage('Image collage created successfully!', 'success');
        setNewImageUri(data.collage_url);
      } else {
        setNewImageUri('');
        setToastMessage('Failed to create image collage!', 'error');
      }
    } catch (error) {
      console.log(error.message)
      setNewImageUri('');
      setLoading(false);
      setToastMessage('Failed to create image collage!', 'error');
    }
  };

  const removeItem = uri => {
    setSelectedImages(selectedImages.filter(i => i.uri !== uri));
  };

  const openCustomGallery = () => {
    setShowConfirmation(false);
    setNewImageUri('');
    setShowGallery(true);
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

        <Text style={styles.title}>AI Collage</Text>
      </View>
      <KeyboardAvoidingView
        style={globalStyles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.scroll}>
          <View style={styles.content}>
            {!loading && !newImageUri && (
              <FlatList
                data={selectedImages}
                numColumns={3}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => removeItem(item.uri)}>
                    <Image source={{ uri: item.uri }} style={styles.image} />

                    <View style={styles.remove}>
                      <Text style={{ color: '#fff' }}>✕</Text>
                    </View>
                  </TouchableOpacity>
                )}
                style={{
                  width: '100%',
                  flex: 1,
                }}
                contentContainerStyle={{
                  paddingVertical: 10,
                  paddingHorizontal: 15,
                }}
                ListEmptyComponent={() => (
                  <Text
                    style={{
                      color: '#003a6b',
                      textAlign: 'center',
                      marginTop: 10,
                      fontFamily: fonts.regular,
                    }}
                  >
                    Please select images to create collage
                  </Text>
                )}
              />
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
            <View style={styles.iconRow}>
              {!loading && selectedImages.length == 0 && (
                <TouchableOpacity
                  style={styles.downloadBtn}
                  onPress={() => openCustomGallery()}
                >
                  <Ionicons name="add-outline" size={20} color="white" />
                </TouchableOpacity>
              )}
              {!loading && newImageUri && selectedImages.length > 0 && (
                <TouchableOpacity
                  style={styles.downloadBtn}
                  onPress={() => setShowConfirmation(true)}
                >
                  <Ionicons name="create-outline" size={20} color="white" />
                </TouchableOpacity>
              )}
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
              placeholder="Select from menu or enter your own collage style..."
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
        </View>
      </KeyboardAvoidingView>
      <Toast config={toastConfig} />
      <CustomGalleryModal
        selectedImages={selectedImages}
        setSelectedImages={setSelectedImages}
        visible={showGallery}
        onClose={() => setShowGallery(false)}
        onDone={images => setSelectedImages(images)}
        selectionLimit={20}
      />
      <CustomAlert
        visible={showConfirmation}
        message="Are you sure you want to change the images? Previouse results will be lost."
        cancelText="CANCEL"
        confirmText="CHANGE"
        onCancel={() => setShowConfirmation(false)}
        onConfirm={() => {
          openCustomGallery();
        }}
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
    flex: 1,
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
  image: {
    width: screenWidth / 3,
    height: screenWidth / 3,
    margin: 2,
    borderRadius: 5,
  },

  remove: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'red',
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subTitle: {
    color: colors.secondary,
    fontSize: 15,
    fontFamily: 'bitter-italic',
    textAlign: 'justify',
    padding: 20,
    lineHeight: 20,
  },
  headingTitle: {
    color: colors.secondary,
    fontFamily: fonts.bold,
  },
  menuHeading: {
    backgroundColor: colors.primary,
    padding: 15,
    fontSize: 15,
  },
});
