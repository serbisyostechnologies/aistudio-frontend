import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';

export default function InactiveUserScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Icon name="alert-circle" size={70} color="#EF4444" />

        <Text style={styles.title}>Account Inactive</Text>

        <Text style={styles.message}>
          Your account has been deactivated. Please contact support or try again
          later.
        </Text>

        <Pressable style={styles.primaryBtn}>
          <Text style={styles.primaryText}>Retry</Text>
        </Pressable>

        <Pressable style={styles.secondaryBtn}>
          <Text style={styles.secondaryText}>Contact Support</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F172A",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  card: {
    width: "100%",
    backgroundColor: "#111827",
    padding: 25,
    borderRadius: 20,
    alignItems: "center",
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFFFFF",
    marginTop: 15,
  },

  message: {
    fontSize: 14,
    color: "#9CA3AF",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 25,
    lineHeight: 20,
  },

  primaryBtn: {
    backgroundColor: "#EF4444",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
    marginBottom: 10,
  },

  primaryText: {
    color: "#fff",
    fontWeight: "600",
  },

  secondaryBtn: {
    borderWidth: 1,
    borderColor: "#374151",
    paddingVertical: 12,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
  },

  secondaryText: {
    color: "#D1D5DB",
    fontWeight: "500",
  },
});