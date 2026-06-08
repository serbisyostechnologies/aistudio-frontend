import {
  View,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  Text,
  Image,
  ScrollView,
  ImageBackground,
  Modal,
  Pressable,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useCallback, useEffect, useState } from 'react';
import { updateDeviceIdentitiesApi, getAllProjects } from '../../api/endPoints';
import { useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { globalStyles, colors, fonts } from '../../styles/globalStyles';
import { SafeAreaView } from 'react-native-safe-area-context';
import PremiumCard from '../../components/PremiumCard';
import LinearGradient from 'react-native-linear-gradient';
import Loader from '../../components/Loader';
import { getTimeAgo } from '../../utils/Utilities';
import { pickImage } from '../../utils/ImagePicker';
import { requestPermissions } from '../../components/RequestPermissions';
import Toast from 'react-native-toast-message';
import { toastConfig } from '../../utils/toastConfig';

export default function ProjectScreen({ navigation }) {
  const user = useSelector(state => state.auth.user);
  const credits = useSelector(state => state.auth.credits);
  const fcmToken = useSelector(state => state.auth.fcmToken);
  const deviceId = useSelector(state => state.auth.deviceId);
  const [creations, setCreations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [operation, setOperation] = useState('');

  const quickTools = [
    {
      id: 1,
      icon: 'sparkles-outline',
      title: 'AI Image',
      description: 'Generate stunning AI images',
      url: 'CreateImage',
    },
    {
      id: 2,
      icon: 'grid-outline',
      title: 'Create Collage',
      description: 'Arrange and merge multiple images',
      url: 'CreatePhotoCollage',
    },
    {
      id: 3,
      icon: 'brush-outline',
      title: 'Edit Image',
      description: 'Edit and refine images with AI',
      url: 'EDIT',
    },
    {
      id: 4,
      icon: 'analytics-outline',
      title: 'Analyse Image',
      description: 'Analyze images with smart AI',
      url: 'ANALYSE',
    },
    {
      id: 5,
      icon: 'videocam-outline',
      title: 'AI Video',
      description: 'Generate videos with AI',
      url: '',
    },
    {
      id: 6,
      icon: 'color-wand-outline',
      title: 'Edit Video',
      description: 'AI tools for fast video editing',
      url: '',
    },
    {
      id: 7,
      icon: 'eye-outline',
      title: 'Analyse Video',
      description: 'Get AI-powered video analysis',
      url: '',
    },
  ];

  const selectMediaOption = option => {
    setOperation(option);
    setModalVisible(true);
  };

  useFocusEffect(
    useCallback(() => {
      const fetchProjects = async () => {
        try {
          const userId = user._id;
          const response = await getAllProjects({ userId });
          setCreations(response.data.projects);
        } catch (error) {
          console.log(error.message);
        } finally {
          setLoading(false);
        }
      };

      fetchProjects();
    }, []),
  );

  useFocusEffect(() => {
    StatusBar.setBackgroundColor(colors.primary);
    StatusBar.setBarStyle('light-content');
  });

  const updateDeviceIdentities = async () => {
    try {
      const user_id = user._id;
      await updateDeviceIdentitiesApi({
        fcmToken,
        deviceId,
        user_id,
      });
    } catch (error) {}
  };

  useEffect(() => {
    if (!user.fcmToken && !user.deviceId) {
      updateDeviceIdentities();
    }
  }, []);

  const toolCardClicked = cardUrl => {
    switch (cardUrl) {
      case 'CreateImage':
        navigation.push(cardUrl);
        break;
      case 'CreatePhotoCollage':
        navigation.push(cardUrl);
        break;
      case 'EDIT':
      case 'ANALYSE':
        selectMediaOption(cardUrl);
        break;
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
    const image = await pickImage({
      type: media,
      requestPermissions,
      setToastMessage,
    });

    if (!image) return;

    navigation.push(operation === 'EDIT' ? 'EditImage' : 'AnalyseImage', {
      image: image,
    });
  };

  const ToolCard = ({ item, onPress }) => (
    <TouchableOpacity
      style={styles.toolCard}
      activeOpacity={0.9}
      onPress={() => onPress(item.url)}
    >
      <View style={styles.iconContainer}>
        <Ionicons name={item.icon} size={30} color={colors.secondary} />
      </View>
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </TouchableOpacity>
  );

  const CreationCard = ({ item }) => {
    return (
      <TouchableOpacity activeOpacity={0.9}>
        <LinearGradient
          colors={['#111633', '#0B0F26']}
          style={styles.creationCard}
        >
          <Image
            source={{
              uri: item.image_url,
            }}
            style={styles.image}
          />

          <View style={styles.footer}>
            <View style={{ flex: 1 }}>
              <Text style={styles.creationTitle}>{item.operation}</Text>
              <Text style={styles.time}>{getTimeAgo(item.createdAt)}</Text>
            </View>

            <TouchableOpacity>
              <Ionicons
                name="ellipsis-vertical"
                size={20}
                color={colors.secondary}
              />
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <ImageBackground
        source={require('../../assets/images/background/home.png')}
        style={styles.background}
        resizeMode="cover"
      >
        <SafeAreaView style={{ flex: 1 }}>
          <StatusBar
            backgroundColor={colors.primary}
            barStyle="light-content"
            translucent={false}
          />
          <View style={styles.header}>
            <Image
              source={require('../../assets/images/logos/home-logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />

            <Text style={styles.subTitle}>AI Serbisyos Studio</Text>

            <TouchableOpacity style={styles.circle}>
              <Ionicons name="diamond-outline" size={15} color="#fff" />
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1 }}>
            <KeyboardAvoidingView
              style={{ flex: 1 }}
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
              <ScrollView
                contentContainerStyle={styles.scroll}
                keyboardShouldPersistTaps="handled"
              >
                <Text style={styles.welcomeText}>Hello, {user.name}👋</Text>
                <Text style={styles.activityText}>
                  What would you like to create today?
                </Text>
                <View style={styles.toolContainer}>
                  <Text style={styles.toolTitle}>Quick Tools</Text>
                </View>
                <FlatList
                  horizontal
                  data={quickTools}
                  keyExtractor={item => item.id}
                  renderItem={({ item }) => (
                    <ToolCard item={item} onPress={toolCardClicked} />
                  )}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.listContainer}
                />
                <View style={styles.toolContainer}>
                  <Text style={[styles.toolTitle, { marginTop: 10 }]}>
                    Recent Creations
                  </Text>
                </View>
                <FlatList
                  horizontal
                  data={creations}
                  keyExtractor={item => item._id}
                  renderItem={({ item }) => <CreationCard item={item} />}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.listContainer}
                  ListEmptyComponent={() => (
                    <Text
                      style={{
                        color: '#003a6b',
                        textAlign: 'center',
                        fontFamily: fonts.regular,
                        width: '75%',
                        lineHeight: 25,
                      }}
                    >
                      No AI creations yet Generate images, videos, and more to
                      see them here.
                    </Text>
                  )}
                />
              </ScrollView>
              <View style={styles.cardContainer}>
                <PremiumCard credits={credits} />
              </View>
            </KeyboardAvoidingView>
          </View>
        </SafeAreaView>
      </ImageBackground>
      <Loader visible={loading} />
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
    padding: 10,
  },
  scroll: {
    backgroundColor: 'transparent',
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#003a6b',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  menuContainer: {
    position: 'absolute',
    bottom: 100,
    right: 25,
    alignItems: 'center',
    gap: 15,
  },

  menuButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#003a6b',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
    backgroundColor: colors.secondary,
  },
  title: {
    fontSize: 16,
    color: colors.secondary,
    fontFamily: fonts.bold,
  },

  content: {
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  projectHeader: {
    backgroundColor: colors.primary,
    padding: 10,
  },
  card: {
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  body: {
    backgroundColor: '#f5f5f5',
    paddingVertical: 10,
  },
  prompt: {
    fontFamily: fonts.bold,
    color: colors.primary,
    fontSize: 14,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 15,
    paddingHorizontal: 15,
    paddingBottom: 15,
  },
  subTitle: {
    color: colors.secondary,
    fontSize: 18,
    fontFamily: fonts.bold,
  },
  logo: {
    width: 35,
    height: 35,
    marginRight: 10,
    tintColor: colors.secondary,
  },
  circle: {
    position: 'absolute',
    top: 28,
    right: 15,
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  cardContainer: {
    backgroundColor: 'transparent',
  },
  welcomeText: {
    color: colors.primary,
    paddingHorizontal: 15,
    marginTop: 15,
    fontFamily: fonts.bold,
    fontSize: 22,
  },
  activityText: {
    color: colors.primary,
    paddingHorizontal: 15,
    fontFamily: fonts.regular,
    fontSize: 13,
  },
  toolContainer: {
    padding: 15,
    paddingTop: 15,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  toolTitle: {
    color: colors.primary,
    fontSize: 18,
    fontFamily: fonts.bold,
  },

  seeAll: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  seeAllText: {
    color: '#4D9DFF',
    fontSize: 16,
    marginRight: 4,
    fontFamily: fonts.bold,
  },

  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 0,
  },

  toolCard: {
    width: 160,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 4,
    },
  },

  iconContainer: {
    width: 75,
    height: 75,
    borderRadius: 18,
    backgroundColor: '#385f88',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },

  cardTitle: {
    fontSize: 16,
    color: colors.secondary,
    marginBottom: 6,
    fontFamily: fonts.bold,
  },

  description: {
    fontSize: 13,
    color: colors.secondary,
    lineHeight: 20,
    fontFamily: fonts.regular,
    textAlign: 'center',
  },

  creationCard: {
    width: 160,
    borderRadius: 18,
    marginRight: 12,
  },

  image: {
    width: '100%',
    height: 170,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
  },

  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    paddingHorizontal: 10,
    paddingBottom: 15,
  },

  creationTitle: {
    color: colors.secondary,
    fontSize: 16,
    fontFamily: fonts.bold,
  },

  time: {
    color: colors.secondary,
    fontSize: 13,
    marginTop: 2,
    fontFamily: fonts.regular,
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