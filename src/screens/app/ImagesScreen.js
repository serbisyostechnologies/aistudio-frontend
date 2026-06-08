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
import { pickImage } from '../../utils/ImagePicker';
import Toast from 'react-native-toast-message';
import { toastConfig } from '../../utils/toastConfig';

export default function ImagesScreen({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [operation, setOperation] = useState('');

  const selectMediaOption = option => {
    setOperation(option);
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

    navigation.push(operation === 'EDIT' ? 'EditImage' : 'AnalyseImage', {
      image: image
    });
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
                Create stunning AI-generated images, design beautiful photo
                collages, edit existing photos with powerful enhancement tools,
                and analyze images for detailed insights and intelligent
                improvements. All-in-one smart image processing built for
                creativity, editing, collage making, and advanced visual
                understanding.
              </Text>
            </View>
            <View style={styles.body}>
              <View style={styles.row}>
                <TouchableOpacity
                  style={styles.card}
                  onPress={() => navigation.push('CreateImage')}
                >
                  <LinearGradient
                    colors={['#7C3AED', '#A855F7']}
                    style={styles.iconContainer}
                  >
                    <Ionicons name="sparkles-outline" size={40} color="white" />
                  </LinearGradient>

                  <View style={styles.content}>
                    <Text style={styles.cardTitle}>Create Image</Text>

                    <Text style={styles.cardSubTitle}>
                      Generate stunning AI images from ideas with creative and
                      intelligent generation tools.
                    </Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.card}
                  onPress={() => navigation.push('CreatePhotoCollage')}
                >
                  <LinearGradient
                    colors={['#FF7E5F', '#FEB47B']}
                    style={styles.iconContainer}
                  >
                    <Ionicons name="grid-outline" size={40} color="white" />
                  </LinearGradient>

                  <View style={styles.content}>
                    <Text style={styles.cardTitle}>Create Photo Collage</Text>

                    <Text style={styles.cardSubTitle}>
                      Arrange and merge multiple images into stylish
                      high-quality collages effortlessly.
                    </Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.card}
                  onPress={() => selectMediaOption('EDIT')}
                >
                  <LinearGradient
                    colors={['#2563EB', '#3B82F6']}
                    style={styles.iconContainer}
                  >
                    <Ionicons name="brush-outline" size={40} color="white" />
                  </LinearGradient>

                  <View style={styles.content}>
                    <Text style={styles.cardTitle}>Edit Image</Text>

                    <Text style={styles.cardSubTitle}>
                      Edit and refine images with powerful tools for cropping,
                      adjustments, and precise enhancements.
                    </Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.card}
                  onPress={() => selectMediaOption('ANALYSE')}
                >
                  <LinearGradient
                    colors={['#16A34A', '#22C55E']}
                    style={styles.iconContainer}
                  >
                    <Ionicons
                      name="analytics-outline"
                      size={40}
                      color="white"
                    />
                  </LinearGradient>

                  <View style={styles.content}>
                    <Text style={styles.cardTitle}>Analyse Image</Text>

                    <Text style={styles.cardSubTitle}>
                      Analyze images with smart AI insights to understand
                      details, quality, and visual composition.
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
      <Toast config={toastConfig} />
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
    paddingBottom: 20
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
    fontFamily: 'saira-bold',
  },
});