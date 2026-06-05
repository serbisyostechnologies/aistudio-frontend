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
import { globalStyles, colors, fonts } from '../styles/globalStyles';

const screenWidth = Dimensions.get('window').width - 40;
const CustomGalleryModal = ({
  visible,
  onClose,
  onDone,
  selectionLimit = 10,
}) => {
  const [selected, setSelected] = useState([]);

  // Open system gallery but control selection manually
  const openGallery = async () => {
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
      }
      setSelected(prev => [...prev, selectedImage]);
    }
  };

  const removeItem = uri => {
    setSelected(selected.filter(i => i.uri !== uri));
  };

  const closeModal = () => {
    onClose();
  }

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
              onDone(selected);
              onClose();
            }}
          >
            <Text style={styles.btn}>Done ({selected.length})</Text>
          </TouchableOpacity>
        </View>

        {/* Open Gallery Button */}
        <TouchableOpacity style={styles.openBtn} onPress={openGallery}>
          <Text style={{ color: '#fff', fontFamily: fonts.bold }}>Open Gallery</Text>
        </TouchableOpacity>

        {/* Selected Preview Grid */}
        <FlatList
          data={selected}
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
          contentContainerStyle={{
            paddingVertical: 10,
            paddingHorizontal: 15
          }}
        />
      </View>
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
    backgroundColor: colors.primary
  },

  title: {
    color: '#fff',
    fontSize: 18,
    fontFamily: fonts.bold
  },

  btn: {
    color: colors.secondary,
    fontSize: 15,
    fontFamily: fonts.regular
  },

  openBtn: {
    backgroundColor: colors.primary,
    margin: 15,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center'
  },

  image: {
    width: screenWidth / 3,
    height: screenWidth / 3,
    margin: 2,
    borderRadius: 5
  },

  remove: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: colors.primary,
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
});