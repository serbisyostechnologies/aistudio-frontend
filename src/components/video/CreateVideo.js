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
import {
  createVideoUsingPrompt,
  createVideoUsingImages,
} from '../../api/endPoints';
import { useSelector } from 'react-redux';
import { shareImage, downloadImage } from '../../utils/Utilities';
import { globalStyles, colors, fonts } from '../../styles/globalStyles';
import CustomGalleryModal from '../../utils/CustomGalleryModal';
import AnimatedTextLoader from '../AnimatedTextLoader';
import CustomAlert from '../CustomAlert';
import { useDispatch } from 'react-redux';
import { updateCredits } from '../../redux/slices/authSlice';
import { VIDEO_TEMPLATES } from "../../utils/AnimationTemplates";
import Video from 'react-native-video';

const screenWidth = Dimensions.get('window').width - 40;

export default function CreateVideo({ navigation, route }) {
  const { images, option } = route.params;
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  const user_id = user._id;
  const [loading, setLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [createdVideoUri, setCreatedVideoUri] = useState('');
  const [selectedImages, setSelectedImages] = useState(images);
  const [showGallery, setShowGallery] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showAnimList, setShowAnimList] = useState(false);
  const [selectedAnim, setSelectedAnim] = useState("");

  const prompts = [
    'A cinematic drone shot flying through snowy mountains at sunrise',
    'A futuristic cyberpunk city with neon lights and moving flying cars',
    'An astronaut slowly walking on Mars with dust storms and dramatic lighting',
    'A magical forest with glowing particles and flowing waterfalls',
    'A luxury sports car driving through rainy Tokyo streets at night',
    'A dragon flying above clouds with lightning and fire effects',
    'A peaceful beach with waves crashing and palm trees swaying in the wind',
    'A sci-fi spaceship traveling through deep space with glowing stars',
    'An anime-style girl walking under cherry blossoms with soft wind effects',
    'A tiger walking through a jungle in cinematic slow motion',
    'A medieval warrior standing on a battlefield with cinematic camera movement',
    'A cozy coffee shop during heavy rain with warm lights and relaxing atmosphere',
  ];

  const loadingTexts = [
    'Rendering cinematic scenes...',
    'Bringing your story to life...',
    'Generating AI-powered visuals...',
    'Creating smooth video magic...',
    'Animating your imagination...',
    'Building stunning motion effects...',
    'Crafting cinematic moments...',
    'Transforming ideas into video...',
    'Producing your AI masterpiece...',
    'Finalizing your video experience...',
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

  const createVideoWithPrompt = async () => {
    setSubmitted(true);
    if (!prompt.trim()) {
      setToastMessage('Please enter video description to create!', 'error');
      return;
    }
    try {
      setLoading(true);
      const response = await createVideoUsingPrompt({
        prompt,
        user_id,
      });
      setLoading(false);
      const data = response.data;
      if (data.success) {
        dispatch(updateCredits(data.credits));
        clearPrompt();
        setToastMessage('Video created successfully!', 'success');
        setCreatedVideoUri(data.video_url);
      } else {
        setToastMessage('Failed to create video!', 'error');
      }
    } catch (error) {
      setLoading(false);
      setToastMessage('Failed to create video!', 'error');
    }
  };

  const createViewWithImages = async () => {
    if (selectedImages.length == 0) {
      setToastMessage('Please select images to create video!', 'error');
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      selectedImages.forEach((img, index) => {
        formData.append('images', {
          uri: img.uri,
          name: `img${index}.jpg`,
          type: 'image/jpeg',
        });
      });

      formData.append('music', '');
      formData.append('templateId', selectedAnim);
      formData.append('user_id', user_id);

      const response = await createVideoUsingImages(formData);
      setLoading(false);
      const data = response.data;
      if (data.success) {
        setSelectedAnim("");
        setSelectedImages([]);
        dispatch(updateCredits(data.credits));
        setToastMessage('Video created successfully!', 'success');
        setCreatedVideoUri(data.video_url);
      } else {
        setToastMessage('Failed to create video!', 'error');
      }
    } catch (error) {
      setLoading(false);
      setToastMessage('Failed to create video!', 'error');
    }
  };

  const createVideoClicked = async () => {
    setCreatedVideoUri('');
    if (option == 'PROMPT') {
      createVideoWithPrompt();
    } else {
      createViewWithImages();
    }
  };

  const setToastMessage = (message, type) => {
    Toast.show({
      type: type,
      text1: message,
      position: 'bottom',
    });
  };

  const removeItem = uri => {
    setSelectedImages(selectedImages.filter(i => i.uri !== uri));
  };

  const addNewImages = () => {
    if( createdVideoUri ) {
      setShowConfirmation(true);
    } else {
      setShowConfirmation(false);
      setShowGallery(true);
    }
  }

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

        <Text style={styles.title}>AI Video</Text>
      </View>
      <KeyboardAvoidingView
        style={globalStyles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.scroll}>
          <View style={styles.content}>
            {!loading && option == 'IMAGES' && !createdVideoUri && (
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
                    Please select images to create video
                  </Text>
                )}
              />
            )}
            {loading && <AnimatedTextLoader texts={loadingTexts} />}
            {!loading && createdVideoUri && (
              <Video
                source={{
                  uri: createdVideoUri,
                }}
                style={{
                  width: '100%',
                  height: '80%',
                  paddingVertical: 10,
                  paddingHorizontal: 10,
                }}
                resizeMode="cover"
                controls
              />
            )}

            <View style={styles.iconRow}>
              {option == 'IMAGES' && (
                <>
                <TouchableOpacity
                  style={styles.downloadBtn}
                  onPress={() => setShowAnimList(!showAnimList)}
                >
                  <Ionicons name="list" size={20} color="white" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.downloadBtn}
                  onPress={() => {setShowConfirmation(false); addNewImages();}}
                >
                  <Ionicons name="add-outline" size={20} color="white" />
                </TouchableOpacity>
                </>
              )}
              {!loading && createdVideoUri && (
                <>
                  <TouchableOpacity
                    style={styles.downloadBtn}
                    onPress={() =>
                      shareImage(createdVideoUri, setToastMessage, 'video')
                    }
                  >
                    <Ionicons name="share-social" size={20} color="white" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.downloadBtn}
                    onPress={() =>
                      downloadImage(createdVideoUri, setToastMessage, 'video')
                    }
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

            {!loading && option == 'PROMPT' && !createdVideoUri && (
              <Ionicons name="film-outline" size={200} color="gray" />
            )}
          </View>
          <View style={styles.inputContainer}>
            {option == 'PROMPT' && (
              <>
                <TextInput
                  placeholder="Select from menu or enter your own description of video..."
                  multiline
                  style={[
                    styles.input,
                    submitted &&
                      !prompt.trim() &&
                      !loading &&
                      styles.inputError,
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
                  onPress={() => createVideoClicked()}
                  disabled={loading}
                >
                  <Ionicons name="send" size={22} color="#003a6b" />
                </TouchableOpacity>
              </>
            )}
            {option == 'IMAGES' && (
              <>
                <TouchableOpacity
                  style={styles.button}
                  activeOpacity={0.9}
                  disabled={loading}
                  onPress={() => createVideoClicked()}
                >
                  <Text style={styles.buttonText}>Create Video</Text>
                </TouchableOpacity>
              </>
            )}
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
          {showAnimList && (
            <View style={styles.menuWrapper}>
              <View style={styles.menuContainer}>
                <View style={styles.menuHeading}>
                  <Text style={styles.headingTitle}>Video Animations</Text>
                </View>
                <ScrollView
                  style={{ maxHeight: 400 }}
                  nestedScrollEnabled={true}
                  showsVerticalScrollIndicator={false}
                >
                  {VIDEO_TEMPLATES.map((item, index) => (
                    <TouchableOpacity
                      key={item.id}
                      style={{
                        paddingVertical: 10,
                        paddingHorizontal: 16,
                        borderBottomWidth: index !== prompts.length - 1 ? 1 : 0,
                        borderBottomColor: '#f2f2f2',
                      }}
                      onPress={() => {setShowAnimList(false); setSelectedAnim(item.id);}}
                    >
                      <Text
                        style={{
                          fontSize: 16,
                          color: '#003a6b',
                          fontFamily: 'saira-italic',
                        }}
                      >
                        {item.name}
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
        confirmText="CONFIRM"
        onCancel={() => setShowConfirmation(false)}
        onConfirm={() => {
          setShowConfirmation(false);
          setCreatedVideoUri('');
          setShowGallery(true);
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
    fontSize: 18,
    marginLeft: 15,
    color: '#fff',
    fontFamily: fonts.bold,
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
    fontFamily: fonts.bold,
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
  button: {
    backgroundColor: colors.primary,
    padding: 5,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: colors.secondary,
    borderWidth: 2,
    ...(Platform.OS === 'android' && {
      overflow: 'hidden',
    }),
    height: 50,
  },
  buttonText: {
    color: colors.secondary,
    fontSize: 18,
    fontFamily: fonts.bold,
  },
});