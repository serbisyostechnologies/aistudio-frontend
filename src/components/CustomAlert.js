import React from 'react';
import { Modal, View, Text, Pressable, StyleSheet } from 'react-native';
import { globalStyles, colors, fonts } from '../styles/globalStyles';

export default function CustomAlert({
  visible,
  message = '',
  onCancel,
  onConfirm,
  cancelText = 'Cancel',
  confirmText = 'OK',
}) {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.box}>
          {/* Text above buttons */}
          <Text style={styles.message}>{message}</Text>

          {/* Buttons row */}
          <View style={styles.buttonRow}>
            <Pressable style={styles.confirmBtn} onPress={onConfirm}>
              <Text style={styles.confirmText}>{confirmText}</Text>
            </Pressable>

            <Pressable style={styles.cancelBtn} onPress={onCancel}>
              <Text style={styles.cancelText}>{cancelText}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  box: {
    width: 300,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },

  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
  },

  message: {
    textAlign: 'center',
    marginBottom: 20,
    color: '#555',
    fontFamily: fonts.regular,
  },

  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },

  cancelBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#003a6b',
    alignItems: 'center',
  },

  confirmBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#003a6b',
    alignItems: 'center',
  },

  cancelText: {
    color: '#ffffff',
    fontWeight: '600',
    fontFamily: fonts.bold,
  },

  confirmText: {
    color: '#ffffff',
    fontWeight: '600',
    fontFamily: fonts.bold,
  },
});