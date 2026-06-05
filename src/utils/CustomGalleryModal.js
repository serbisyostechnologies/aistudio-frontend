import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Modal,
  FlatList,
  Image,
  TouchableOpacity,
  Text,
  PermissionsAndroid,
  Platform,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
} from 'react-native';
import CameraRoll from "@react-native-camera-roll/camera-roll";

const SCREEN_WIDTH = Dimensions.get('window').width;
const ITEM_SIZE = SCREEN_WIDTH / 3;

const CustomGalleryModal = ({
  visible,
  onClose,
  onDone,
  maxSelection = 10,
}) => {
  const [photos, setPhotos] = useState([]);
  const [selected, setSelected] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasNext, setHasNext] = useState(true);

  // 🔐 Permission
  const requestPermission = async () => {
    if (Platform.OS !== 'android') return true;

    try {
      const result =
        Platform.Version >= 33
          ? await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
            )
          : await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            );

      console.log('Permission result:', result);

      if (result === PermissionsAndroid.RESULTS.GRANTED) {
        return true;
      }

      if (result === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
        Alert.alert(
          'Permission Required',
          'Gallery access is blocked. Please enable it from settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Open Settings',
              onPress: () => Linking.openSettings(),
            },
          ],
        );
      }

      return false;
    } catch (e) {
      console.log(e);
      return false;
    }
  };

  // 📥 Load images (lazy pagination)
  const loadPhotos = useCallback(async () => {
    if (loading || !hasNext) return;

    setLoading(true);

    try {
      const res = await CameraRoll.getPhotos({
        first: 60,
        assetType: 'Photos',
        after: cursor,
      });

      console.log('CameraRoll RESPONSE:', res);

      if (!res?.edges) {
        setHasNext(false);
        return;
      }

      setPhotos(prev => [...prev, ...res.edges]);
      setCursor(res.page_info.end_cursor);
      setHasNext(res.page_info.has_next_page);
    } catch (e) {
      console.log('CameraRoll ERROR:', e);
      setHasNext(false);
    } finally {
      setLoading(false); // 🔥 CRITICAL FIX
    }
  }, [cursor, loading, hasNext]);

  // 🚀 Load when modal opens
  useEffect(() => {
    if (visible) {
      (async () => {
        const ok = await requestPermission();
        if (ok && photos.length === 0) loadPhotos();
      })();
    }
  }, [visible]);

  // ✔ Toggle select
  const toggleSelect = uri => {
    setSelected(prev => {
      if (prev.includes(uri)) {
        return prev.filter(i => i !== uri);
      }

      if (prev.length < maxSelection) {
        return [...prev, uri];
      }

      return prev;
    });
  };

  // 📤 Done
  const handleDone = () => {
    const selectedImages = photos
      .filter(p => selected.includes(p.node.image.uri))
      .map(p => p.node.image);

    onDone?.(selectedImages);
    onClose?.();
  };

  const renderItem = ({ item }) => {
    const uri = item.node.image.uri;
    const isSelected = selected.includes(uri);

    return (
      <TouchableOpacity onPress={() => toggleSelect(uri)} style={styles.item}>
        <Image source={{ uri }} style={styles.image} />

        {isSelected && (
          <View style={styles.overlay}>
            <Text style={styles.check}>✓</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.cancel}>Cancel</Text>
          </TouchableOpacity>

          <Text style={styles.title}>
            {selected.length}/{maxSelection}
          </Text>

          <TouchableOpacity onPress={handleDone}>
            <Text style={styles.done}>Done</Text>
          </TouchableOpacity>
        </View>

        {/* Gallery */}
        <FlatList
          data={photos}
          numColumns={3}
          keyExtractor={item => item.node.image.uri}
          renderItem={renderItem}
          onEndReached={loadPhotos}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loading ? <ActivityIndicator style={{ padding: 20 }} /> : null
          }
          removeClippedSubviews
          initialNumToRender={18}
          maxToRenderPerBatch={24}
          windowSize={10}
        />
      </View>
    </Modal>
  );
};

export default CustomGalleryModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    height: 55,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  cancel: {
    color: '#fff',
    fontSize: 16,
  },
  title: {
    color: '#fff',
    fontSize: 16,
  },
  done: {
    color: '#00ff88',
    fontSize: 16,
    fontWeight: 'bold',
  },
  item: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 12,
    padding: 5,
  },
  check: {
    color: '#00ff88',
    fontWeight: 'bold',
  },
});