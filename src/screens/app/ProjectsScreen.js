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
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useEffect, useState } from 'react';
import { getAllProjects, updateDeviceIdentitiesApi } from '../../api/endPoints';
import { useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { globalStyles, colors, fonts } from '../../styles/globalStyles';
import Loader from '../../components/Loader';
import ProjectExapandableView from '../../components/ProjectExpandableView';
import Toast from 'react-native-toast-message';
import { toastConfig } from '../../utils/toastConfig';

export default function ProjectScreen({ navigation }) {
  const user = useSelector(state => state.auth.user);
  const fcmToken = useSelector(state => state.auth.fcmToken);
  const deviceId = useSelector(state => state.auth.deviceId);
  const [open, setOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [disableExpand, setDisableExpand] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const getProjects = async () => {
    try {
      const userId = user._id;
      const response = await getAllProjects({ userId });
      setProjects(response.data.projects);
    } catch (error) {
      setLoading(false);
      setProjects([]);
    }
  };

  const updateDeviceIdentities = async () => {
    try {
      const user_id = user._id;
      const response = await updateDeviceIdentitiesApi({
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

  useEffect(() => {
    getProjects();
  }, [refresh]);

  useFocusEffect(
    useCallback(() => {
      const fetchProjects = async () => {
        try {
          setProjects([]);
          setLoading(true);

          await getProjects();

          setExpandedId(null);
        } finally {
          setLoading(false);
        }
      };

      fetchProjects();
    }, []),
  );

  const navigateTo = url => {
    setOpen(false);
    navigation.navigate(url);
  };

  const handleExpand = id => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  const showMessage = (message, type) => {
    Toast.show({
      type: type,
      text1: message,
      position: 'bottom',
    });
  };

  return (
    <>
      <StatusBar backgroundColor={colors.primary} barStyle="light-content" />
      <KeyboardAvoidingView
        style={{
          flex: 1,
          marginBottom: 80,
        }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <Image
            source={require('../../assets/images/logos/home-logo.png')} // adjust path
            style={styles.logo}
            resizeMode="contain"
          />

          <Text style={styles.subTitle}>AI Serbisyos Studio</Text>
        </View>
        <FlatList
          data={projects}
          keyExtractor={item => item._id}
          renderItem={({ item }) => (
            <ProjectExapandableView
              project={item}
              expanded={expandedId === item._id}
              onExpand={() => handleExpand(item._id)}
              onDisable={isDisable => setDisableExpand(isDisable)}
              disableExpand={disableExpand}
              showMessage={showMessage}
              setRefresh={setRefresh}
            />
          )}
        />
      </KeyboardAvoidingView>
      {open && (
        <View style={styles.menuContainer}>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => navigateTo('Images')}
          >
            <Ionicons name="images-outline" size={22} color="white" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => navigateTo('Videos')}
          >
            <Ionicons name="videocam-outline" size={22} color="white" />
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity style={styles.fab}>
        <Ionicons
          name="add"
          style={{ fontWeight: 'bold' }}
          size={30}
          color="white"
          onPress={() => setOpen(!open)}
        />
      </TouchableOpacity>
      <Loader visible={loading} />
      <Toast config={toastConfig} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
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
    padding: 15,
    marginBottom: 20,
  },
  subTitle: {
    color: colors.secondary,
    fontSize: 18,
    fontFamily: fonts.bold,
  },
  logo: {
    width: 32,
    height: 32,
    marginRight: 10,
    tintColor: colors.secondary
  },
});