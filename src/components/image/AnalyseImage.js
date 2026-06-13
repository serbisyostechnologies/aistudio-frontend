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
import { globalStyles, colors, fonts } from '../../styles/globalStyles';
import { useState, useEffect } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-toast-message';
import { toastConfig } from '../../utils/toastConfig';
import { useDispatch, useSelector } from 'react-redux';
import AnimatedTextLoader from '../AnimatedTextLoader';
import { pickImage } from '../../utils/ImagePicker';
import { requestPermissions } from '../RequestPermissions';
import { analyseImage } from '../api/endPoints';
import CustomAlert from '../CustomAlert';
import { updateCredits } from '../../redux/slices/authSlice';

export default function AnalyseImage({ navigation, route }) {
  const dispatch = useDispatch();
  const { image } = route.params;
  const user = useSelector(state => state.auth.user);
  const user_id = user._id;
  const [loading, setLoading] = useState(false);
  const [userImage, setUserImage] = useState(image);
  const [modalVisible, setModalVisible] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [analysisText, setAnalysisText] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  const loadingTexts = [
    'Analyzing your image...',
    'Detecting objects and details...',
    'Understanding image composition...',
    'Scanning colors and lighting...',
    'Identifying visual elements...',
    'Processing image features...',
    'Examining textures and patterns...',
    'Reading image structure...',
    'Analyzing depth and focus...',
    'Recognizing faces and objects...',
    'Inspecting image quality...',
    'Understanding scene context...',
    'Detecting edges and shapes...',
    'Reviewing visual balance...',
    'Analyzing artistic style...',
    'Extracting image insights...',
    'Checking brightness and contrast...',
    'Interpreting visual content...',
    'Running AI image analysis...',
    'Preparing smart image insights...',
  ];

  const prompts = [
    'Describe this image in detail',
    'Analyze the objects in this image',
    'Identify people and their actions',
    'Explain the scene and environment',
    'Detect emotions and expressions',
    'Analyze lighting and color tones',
    'Identify artistic style and composition',
    'Describe the background elements',
    'Detect text visible in the image',
    'Analyze image quality and clarity',
    'Identify fashion and clothing details',
    'Detect animals, vehicles, or landmarks',
    'Analyze mood and atmosphere',
    'Explain the visual storytelling',
    'Identify dominant colors and themes',
    'Analyze camera angle and perspective',
    'Detect facial expressions and poses',
    'Describe textures and patterns',
    'Identify possible location or setting',
    'Analyze cinematic or aesthetic elements',
    'Detect food items and ingredients',
    'Analyze interior or exterior design',
    'Identify technology or gadgets shown',
    'Explain the overall visual appeal',
    'Provide a caption for this image',
    'Generate hashtags based on the image',
    'Analyze social media aesthetic',
    'Identify potential editing improvements',
    'Estimate time of day and weather',
    'Analyze symmetry and composition balance',
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

  const selectMediaOption = () => {
    setShowConfirmation(false);
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
    setPrompt('');
    setSubmitted(false);
  };

  const analyseImageClicked = async () => {
    setAnalysisText('');
    setSubmitted(true);
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('prompt', prompt);
      formData.append('user_id', user_id);
      formData.append('userImage', {
        uri: userImage.uri,
        name: userImage.fileName,
        type: userImage.type,
      });

      const response = await analyseImage(formData);
      setLoading(false);
      const data = response.data;
      if (data.success) {
        dispatch(updateCredits(data.credits));
        setToastMessage('Image analysed successfully!', 'success');
        setAnalysisText(data.analysis_text);
      } else {
        setNewImageUri('');
        setToastMessage('Failed to analyse image!', 'error');
      }
    } catch (error) {
      setLoading(false);
      setToastMessage('Failed to analyse image!', 'error');
    }
  };

  const promptChanged = text => {
    setSubmitted(false);
    setPrompt(text);
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

        <Text style={styles.title}>AI Analyse Image</Text>
      </View>
      <KeyboardAvoidingView
        style={globalStyles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.container}>
          <View style={styles.content}>
            {loading && <AnimatedTextLoader texts={loadingTexts} />}
            {userImage && (
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
            <View style={styles.iconRow}>
              <TouchableOpacity
                style={styles.downloadBtn}
                onPress={() => setShowConfirmation(true)}
                disabled={loading}
              >
                <Ionicons name="create-outline" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Describe what you want to know about this image..."
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
              onPress={() => analyseImageClicked()}
              disabled={loading}
            >
              <Ionicons name="send" size={22} color="#003a6b" />
            </TouchableOpacity>
          </View>
          <View style={styles.inputContainer}>
            <ScrollView nestedScrollEnabled={true} style={styles.scrollBox}>
              <Text style={styles.analysisText}>{analysisText}</Text>
            </ScrollView>
          </View>
        </View>
      </KeyboardAvoidingView>
      {showMenu && (
        <View style={styles.menuWrapper}>
          <View style={styles.menuContainer}>
            <View style={styles.menuHeading}>
              <Text style={styles.headingTitle}>AI Prompts</Text>
              <TouchableOpacity onPress={() => setShowMenu(!showMenu)}>
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
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
      <CustomAlert
        visible={showConfirmation}
        message="Are you sure you want to change the image? Previouse results will be lost."
        cancelText="CANCEL"
        confirmText="CHANGE"
        onCancel={() => setShowConfirmation(false)}
        onConfirm={() => {
          selectMediaOption();
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
    fontSize: 18,
    marginLeft: 15,
    color: '#fff',
    fontFamily: fonts.bold,
  },
  content: {
    height: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    height: '25%',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
  },
  input: {
    height: '100%',
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
  analysisText: {
    fontSize: 16,
    color: '#003a6b',
    fontFamily: fonts.regular,
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
  headingTitle: {
    color: colors.secondary,
    fontFamily: fonts.bold,
  },
  menuHeading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.primary,
    padding: 10,
    fontSize: 15,
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
  scrollBox: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
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
    fontFamily: fonts.bold,
  },
});