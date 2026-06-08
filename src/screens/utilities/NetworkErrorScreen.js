import { StyleSheet, ImageBackground, Pressable, Alert, Linking, Platform } from "react-native";

export default function NetworkError() {

  const openNetworkSettings = async () => {
    try {
      if (Platform.OS === "android") {
        await Linking.sendIntent("android.settings.WIFI_SETTINGS");
      } else {
        await Linking.openSettings();
      }
    } catch (error) {
      Alert.alert("Unable to open settings");
    }
  };

  return (
    <Pressable style={styles.container} onPress={openNetworkSettings}>
      <ImageBackground
        source={require("../../assets/backgrounds/no-network.png")}
        style={styles.background}
        resizeMode="contain"
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
});