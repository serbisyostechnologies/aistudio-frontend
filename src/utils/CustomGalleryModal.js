import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  Dimensions,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { colors, fonts } from '../styles/globalStyles';

const screenWidth = Dimensions.get('window').width - 40;
const CustomGalleryModal = ({
  selectedImages,
  setSelectedImages,
  visible,
  onClose,
  selectionLimit,
}) => {
  const [error, setError] = useState('');

  const openGallery = async () => {
    if (selectedImages.length == selectionLimit) {
      setError('Only 6 photos allowed!');

      setTimeout(() => {
        setError('');
      }, 4000);
      return;
    }
    const result = await launchImageLibrary({
      mediaType: 'photo',
      selectionLimit: selectionLimit,
      includeBase64: false,
    });

    if (result.didCancel) return;

    if (result.assets) {
      const selectedImage = {
        uri: result.assets[0].uri,
        fileName: result.assets[0].fileName,
        type: result.assets[0].type
      };
      setSelectedImages(prev => [...prev, selectedImage]);
    }
  };

  const removeItem = uri => {
    setSelectedImages(selectedImages.filter(i => i.uri !== uri));
  };

  const closeModal = () => {
    onClose();
  };

  const deleteAllImages = () => {
    setSelectedImages([]);
  };

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={closeModal}>
            <Text style={styles.btn}>Close</Text>
          </TouchableOpacity>

          <Text style={styles.title}>Gallery</Text>

          <TouchableOpacity
            onPress={() => {
              onClose();
            }}
          >
            <Text style={styles.btn}>Done ({selectedImages.length})</Text>
          </TouchableOpacity>
        </View>

        {/* Open Gallery Button */}
        <View style={styles.row}>
          <TouchableOpacity style={styles.openBtn} onPress={openGallery}>
            <Text style={{ color: '#fff', fontFamily: fonts.bold }}>
              Select Image
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.openBtn} onPress={deleteAllImages}>
            <Text style={{ color: '#fff', fontFamily: fonts.bold }}>
              Delete All
            </Text>
          </TouchableOpacity>
        </View>

        {/* Selected Preview Grid */}
        <FlatList
          data={selectedImages}
          numColumns={3}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => removeItem(item.uri)}>
              <Image source={{ uri: item.uri }} style={styles.image} />
              <View style={styles.remove}>
                <Text style={{ color: colors.secondary, fontFamily: fonts.bold }}>✕</Text>
              </View>
            </TouchableOpacity>
          )}
          contentContainerStyle={{
            paddingVertical: 10,
            paddingHorizontal: 15,
          }}
          ListEmptyComponent={() => (
            <Text
              style={{
                color: '#003a6b',
                textAlign: 'center',
                marginTop: 20,
                fontFamily: fonts.regular,
              }}
            >
              No images selected
            </Text>
          )}
        />
      </View>
      {error ? (
        <View style={styles.snackbar}>
          <Text style={styles.snackbarText}>{error}</Text>
        </View>
      ) : null}
    </Modal>
  );
};

export default CustomGalleryModal;

// ---------------- Styles ----------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: colors.primary,
  },

  title: {
    color: '#fff',
    fontSize: 18,
    fontFamily: fonts.bold,
  },

  btn: {
    color: colors.secondary,
    fontSize: 15,
    fontFamily: fonts.regular,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 15,
    gap: 10,
  },

  openBtn: {
    flex: 1,
    backgroundColor: colors.primary,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
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
    backgroundColor: "red",
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  snackbar: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: colors.secondary,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    zIndex: 999,
    elevation: 10,
  },

  snackbarText: {
    color: 'red',
    fontSize: 14,
    fontFamily: fonts.regular,
  },
});