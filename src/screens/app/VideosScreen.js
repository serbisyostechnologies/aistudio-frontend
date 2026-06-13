import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  StatusBar,
  Modal,
  Pressable,
} from 'react-native';
import { globalStyles, colors, fonts } from '../../styles/globalStyles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { useState } from 'react';
import { requestPermissions } from '../../components/RequestPermissions';
import Toast from 'react-native-toast-message';
import { toastConfig } from '../../utils/toastConfig';
import { pickImage } from '../../utils/ImagePicker';
import CustomGalleryModal from '../../utils/CustomGalleryModal';

export default function VideosScreen({ navigation }) {
  const [visible, setVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [operation, setOperation] = useState('');
  const [showGallery, setShowGallery] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);

  const selectMediaOption = option => {
    setOperation(option);
    setVisible(true);
  };

  const openPicker = async media => {
    setVisible(false);
    const video = await pickImage({
      type: media,
      fileType: 'video',
      requestPermissions,
      setToastMessage,
    });

    if (!video) return;

    navigation.push(operation === 'EDIT' ? 'EditVideo' : 'AnalyseVideo', {
      video: video
    });
  };

  const setToastMessage = (message, type) => {
    Toast.show({
      type: type,
      text1: message,
      position: 'bottom',
    });
  };

  const navigateToCreateVideo = () => {
    setVisible(false);
    navigation.push('CreateVideo', { option: 'PROMPT', video: null });
  };

  const onImagesSelected = () => {
    if( selectedImages.length == 0 ) {
      setToastMessage("Please select images to create video", "info")
      return;
    }
    navigation.push('CreateVideo', { option: 'IMAGES', images: selectedImages })
  }

  return (
    <>
      <KeyboardAvoidingView
        style={globalStyles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={globalStyles.container}>
            <StatusBar
              backgroundColor={colors.primary}
              barStyle="light-content"
            />
            <View style={styles.header}>
              <Text style={styles.subTitle}>
                Create cinematic AI-generated videos, edit and enhance existing
                footage with powerful smart tools, generate stunning visual
                effects and transitions, analyze videos for deep insights and
                intelligent improvements, and transform ideas into
                professional-quality content. All-in-one smart video processing
                built for creativity, editing, storytelling, enhancement, and
                advanced visual understanding.
              </Text>
            </View>
            <View style={styles.body}>
              <View style={styles.row}>
                <TouchableOpacity
                  style={styles.card}
                  onPress={() => setModalVisible(!modalVisible)}
                >
                  <LinearGradient
                    colors={['#f26a8d', '#f49cbb']}
                    style={styles.iconContainer}
                  >
                    <Ionicons name="videocam-outline" size={40} color="white" />
                  </LinearGradient>

                  <View style={styles.content}>
                    <Text style={styles.cardTitle}>Create Video</Text>

                    <Text style={styles.cardSubTitle}>
                      Generate stunning AI videos from ideas with creative and
                      intelligent video generation tools.
                    </Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.card}
                  onPress={() => selectMediaOption('EDIT')}
                >
                  <LinearGradient
                    colors={['#6A11CB', '#2575FC']}
                    style={styles.iconContainer}
                  >
                    <Ionicons
                      name="color-wand-outline"
                      size={40}
                      color="white"
                    />
                  </LinearGradient>

                  <View style={styles.content}>
                    <Text style={styles.cardTitle}>Edit Video</Text>

                    <Text style={styles.cardSubTitle}>
                      Edit and enhance videos with AI-powered tools for
                      stunning, smooth, and professional-quality results.
                    </Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.card}
                  onPress={() => selectMediaOption('ANALYSE')}
                >
                  <LinearGradient
                    colors={['#2a850e', '#27a300']}
                    style={styles.iconContainer}
                  >
                    <Ionicons name="eye-outline" size={40} color="white" />
                  </LinearGradient>

                  <View style={styles.content}>
                    <Text style={styles.cardTitle}>Analyse Video</Text>

                    <Text style={styles.cardSubTitle}>
                      Analyze videos with AI-powered tools for smart insights,
                      scene detection, and intelligent enhancements.
                    </Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.card}
                  onPress={() => navigation.push('CreateImage')}
                ></TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <Modal visible={visible} transparent animationType="slide">
        <View style={mstyles.overlay}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => setVisible(false)}
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
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={mstyles.overlay}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => setVisible(false)}
          />

          <View style={mstyles.modal}>
            <Pressable
              style={mstyles.option}
              onPress={() => {setModalVisible(false); navigation.push('CreateVideo', {option: 'PROMPT', images: []})}}
            >
              <Ionicons name="sparkles" size={26} color="#003a6b" />
              <Text style={mstyles.text}>Using an AI prompt</Text>
            </Pressable>

            <Pressable
              style={mstyles.option}
              onPress={() => {setModalVisible(false); setShowGallery(true)}}
            >
              <Ionicons name="images" size={26} color="#003a6b" />
              <Text style={mstyles.text}>Using images in mobile</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <Toast config={toastConfig} />
      <CustomGalleryModal
        selectedImages={selectedImages}
        setSelectedImages={setSelectedImages}
        visible={showGallery}
        onClose={() => {setSelectedImages([]); setShowGallery(false);}}
        onDone={images => onImagesSelected()}
        selectionLimit={10}
      />
    </>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
  },
  header: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  body: {
    flex: 9,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    width: '100%',
    padding: 10,
  },
  subTitle: {
    color: colors.secondary,
    fontSize: 15,
    fontFamily: 'bitter-italic',
    textAlign: 'justify',
    paddingHorizontal: 20,
    lineHeight: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  row: {
    flex: 1,
    gap: 10,
  },
  card: {
    flex: 1,
    width: '92%',
    height: '100%',
    backgroundColor: colors.secondary,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    marginVertical: 10,
  },

  iconContainer: {
    width: 70,
    height: '100%',
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },

  content: {
    flex: 1,
    padding: 10,
  },

  cardTitle: {
    fontSize: 15,
    color: colors.primary,
    marginBottom: 5,
    fontFamily: fonts.bold,
  },

  cardSubTitle: {
    fontSize: 13,
    color: colors.primary,
    fontFamily: fonts.regular,
    lineHeight: 15,
    textAlign: 'left',
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
    paddingHorizontal: 20,
    paddingVertical: 10,
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
    paddingVertical: 10,
    gap: 10,
  },

  text: {
    fontSize: 14,
    color: '#003a6b',
    fontFamily: fonts.bold,
  },
});