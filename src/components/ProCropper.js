import React, { useState } from 'react';
import {
  View,
  Modal,
  Dimensions,
  Platform,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';

import Animated, {
  useSharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';

import {
  GestureHandlerRootView,
  GestureDetector,
  Gesture,
} from 'react-native-gesture-handler';
import { fonts, globalStyles } from '../styles/globalStyles';
import ViewShot from 'react-native-view-shot';
import { useRef } from 'react';

const { width } = Dimensions.get('window');
const FRAME = width - 80;

export default function ProCropper({
  visible,
  imageUri,
  onClose,
  onUpload,
  onChange,
}) {
  const viewShotRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const scale = useSharedValue(1);

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const savedScale = useSharedValue(1);
  const savedX = useSharedValue(0);
  const savedY = useSharedValue(0);

  const pinchGesture = Gesture.Pinch()
    .onUpdate(event => {
      scale.value = savedScale.value * event.scale;

      if (scale.value < 1) {
        scale.value = 1;
      }

      if (scale.value > 4) {
        scale.value = 4;
      }
    })
    .onEnd(() => {
      savedScale.value = scale.value;
    });

  const panGesture = Gesture.Pan()
    .onUpdate(event => {
      translateX.value = savedX.value + event.translationX;
      translateY.value = savedY.value + event.translationY;
    })
    .onEnd(() => {
      savedX.value = translateX.value;
      savedY.value = translateY.value;
    });

  const composed = Gesture.Simultaneous(pinchGesture, panGesture);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  const onSave = async () => {
    try {
      const uri = await viewShotRef.current.capture();
      onUpload(uri);
    } finally {
      setLoading(false);
    }
  };

  const closeModalOpenMenu = () => {
    onClose();
    onChange();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={styles.overlay}>
          <View style={styles.modalBox}>
            <View style={styles.cropContainer}>
              <GestureDetector gesture={composed}>
                <ViewShot
                  ref={viewShotRef}
                  options={{
                    format: 'jpg',
                    quality: 1,
                  }}
                >
                  <Animated.Image
                    source={{ uri: imageUri }}
                    resizeMode="cover"
                    style={[
                      {
                        width: FRAME,
                        height: FRAME,
                      },
                      animatedStyle,
                    ]}
                  />
                </ViewShot>
              </GestureDetector>

              <View style={styles.cropBorder} />
            </View>

            <View style={styles.buttons}>
              <TouchableOpacity
                style={styles.button}
                activeOpacity={0.9}
                onPress={onSave}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>UPLOAD</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.button}
                activeOpacity={0.9}
                onPress={closeModalOpenMenu}
                disabled={loading}
              >
                <Text style={styles.buttonText}>CHANGE</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={globalStyles.buttonDark}
              onPress={onClose}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={globalStyles.buttonDarkText}>CLOSE</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </GestureHandlerRootView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalBox: {
    width: '92%',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 10,
  },

  cropContainer: {
    width: FRAME,
    height: FRAME,
    overflow: 'hidden',
    alignSelf: 'center',
    borderRadius: 10,
    backgroundColor: '#000',
    marginVertical: 10,
  },

  cropBorder: {
    position: 'absolute',
    width: FRAME,
    height: FRAME,
    borderWidth: 3,
    borderColor: '#fff',
    borderRadius: 10,
  },

  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },

  button: {
    flex: 1,
    backgroundColor: '#003a6b',
    paddingVertical: 10,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',

    ...(Platform.OS === 'android' && {
      overflow: 'hidden',
    }),
  },

  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: fonts.bold,
  },
});