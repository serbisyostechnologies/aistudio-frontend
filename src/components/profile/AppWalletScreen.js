import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  BackHandler,
  Image,
  StatusBar,
  ImageBackground,
} from 'react-native';
import { globalStyles, colors, fonts } from '../../styles/globalStyles';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function AppWalletScreen({ navigation }) {
  const user = useSelector(state => state.auth.user);
  const [loading, setLoading] = useState(false);
  return (
    <>
      <View
        style={{
          height: 0,
          backgroundColor: colors.primary,
        }}
      />
      <StatusBar backgroundColor={colors.primary} barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          disabled={loading}
        >
          <Ionicons name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.title}>AI Credit Wallet</Text>
      </View>
      <ScrollView
        contentContainerStyle={styles.scroll}
        nestedScrollEnabled={true}
        keyboardShouldPersistTaps="handled"
      >
        <ImageBackground
          source={require('../../assets/backgrounds/home.png')}
          style={styles.background}
          resizeMode="cover"
        >
          <View style={styles.content}>
            <View style={styles.balance}>
              <Text style={styles.balanceText}>Available Credits</Text>
              <Text style={styles.balanceText}>{user.credits}</Text>
            </View>

            <Text style={styles.planHeading}>Choose Your Plan</Text>
          </View>
        </ImageBackground>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  header: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 15,
    backgroundColor: '#003a6b',
  },
  title: {
    fontSize: 18,
    marginLeft: 15,
    color: '#fff',
    fontFamily: fonts.bold,
  },
  scroll: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  content: {
    flex: 1,
    height: 550,
    paddingHorizontal: 15,
  },
  balance: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginTop: 15,
    justifyContent: 'space-between',
    flexDirection: 'row',
    backgroundColor: colors.primary,
    width: '100%',
    borderRadius: 5,
  },
  balanceText: {
    color: colors.secondary,
    fontFamily: fonts.bold,
    fontSize: 15,
  },
  planHeading: {
    fontSize: 16,
    color: colors.primary,
    fontFamily: fonts.bold,
    marginTop: 20,
    textAlign: "left"
  },

});