import React from "react";
import { View, ActivityIndicator, Text, StyleSheet, Modal } from "react-native";

export default function Loader({ visible = false }) {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.container}>
        <View style={styles.loaderBox}>
          <ActivityIndicator size="large" color="#a7b4c0" style={{ transform: [{ scale: 1.2 }] }}/>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },

  loaderBox: {
    backgroundColor: "transparent",
    paddingVertical: 24,
    paddingHorizontal: 30,
    borderRadius: 16,
    alignItems: "center",
    minWidth: 150,
  },

  text: {
    marginTop: 12,
    fontSize: 15,
    fontWeight: "500",
  },
});