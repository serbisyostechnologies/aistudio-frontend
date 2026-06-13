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
  Modal,
  Pressable,
} from 'react-native';
import { globalStyles, colors, fonts } from '../../styles/globalStyles';
import { useState, useEffect } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-toast-message';
import { toastConfig } from '../../utils/toastConfig';
import { useDispatch, useSelector } from 'react-redux';
import AnimatedTextLoader from '../AnimatedTextLoader';
import { pickImage } from '../../utils/ImagePicker';
import { requestPermissions } from '../RequestPermissions';
import { analyseImage } from '../api/endPoints';
import CustomAlert from '../CustomAlert';
import { updateCredits } from '../../redux/slices/authSlice';

export default function AnalyseVideo({ navigation, route }) {
  const [loading, setLoading] = useState(false);

  return (
    <>
      <View
        style={{
          height: 0,
          backgroundColor: colors.primary,
        }}
      />
      <StatusBar backgroundColor={colors.primary} barStyle="light-content" />
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          disabled={loading}
        >
          <Ionicons name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.title}>AI Analyse Video</Text>
      </View>
      <KeyboardAvoidingView
        style={globalStyles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.container}>
          <View style={styles.content}></View>
        </View>
      </KeyboardAvoidingView>
      <Toast config={toastConfig} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scroll: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
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
  content: {
    height: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    height: '25%',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
  },
  input: {
    height: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 12,
    fontSize: 16,
    color: '#003a6b',
    fontFamily: 'saira',
    paddingTop: 25,
    textAlignVertical: 'top',
  },
  analysisText: {
    fontSize: 16,
    color: '#003a6b',
    fontFamily: fonts.regular,
  },
  sendButton: {
    position: 'absolute',
    bottom: 10,
    right: 8,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearButton: {
    position: 'absolute',
    top: 10,
    right: 8,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listButton: {
    position: 'absolute',
    top: 10,
    right: 50,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputError: {
    borderColor: 'red',
    borderWidth: 1,
  },
  menuWrapper: {
    position: 'absolute',
    bottom: 130,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 9999,
  },
  headingTitle: {
    color: colors.secondary,
    fontFamily: fonts.bold,
  },
  menuHeading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.primary,
    padding: 10,
    fontSize: 15,
  },
  menuContainer: {
    width: '95%',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingVertical: 10,
    elevation: 8,
    shadowColor: '#003a6b',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    overflow: 'scroll',
    marginBottom: 50,
  },
  row: {
    flexDirection: 'row',
    width: '100%',
    paddingHorizontal: 12,
  },
  box: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: '#003a6b',
    backgroundColor: '#003a6b',
    color: '#fff',
  },
  selectedBox: {
    borderColor: '#003a6b',
    backgroundColor: '#fff',
  },
  downloadBtn: {
    backgroundColor: '#003a6b',
    padding: 10,
    borderRadius: 100,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: fonts.bold,
  },
  iconRow: {
    position: 'absolute',
    bottom: 5,
    right: 20,
    zIndex: 10,
    borderRadius: 100,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    gap: 10,
  },
  scrollBox: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
  },
});

const mstyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  button: {
    backgroundColor: '#000',
    padding: 12,
    borderRadius: 10,
  },

  image: {
    width: 200,
    height: 200,
    marginTop: 20,
    borderRadius: 10,
  },

  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },

  modal: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
  },

  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 10,
  },

  text: {
    fontSize: 14,
    color: '#003a6b',
    fontFamily: fonts.bold,
  },
});
