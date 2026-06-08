import { createNativeStackNavigator } from '@react-navigation/native-stack';
import NetworkErrorScreen from '../screens/utilities/NetworkErrorScreen';
import SplashScreen from '../screens/auth/SplashScreen';
import WelcomeScreen from '../screens/auth/WelcomeScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import { useSelector } from 'react-redux';
import TabNavigator from '../navigation/TabNavigator';
import InactiveUserScreen from '../screens/utilities/InactiveUserScreen';
import CreateImage from "../components/image/CreateImage";
import CreatePhotoCollage from "../components/image/CreatePhotoCollage"
import EditImage from "../components/image/EditImage";
import AnalyseImage from "../components/image/AnalyseImage";
import CreateVideo from "../components/video/CreateVideo";
import EditVideo from "../components/video/EditVideo";
import AnalyseVideo from "../components/video/AnalyseVideo";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const isConnected = useSelector(state => state.network.isConnected);

  if (!isConnected) {
    return <Redirect href="/NetworkError" />;
  }

  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="NetworkError" component={NetworkErrorScreen} />
      <Stack.Screen name="InactiveUser" component={InactiveUserScreen} />
      <Stack.Screen name="CreateImage" component={CreateImage} />
      <Stack.Screen name="EditImage" component={EditImage} />
      <Stack.Screen name="AnalyseImage" component={AnalyseImage} />
      <Stack.Screen name="CreatePhotoCollage" component={CreatePhotoCollage} />
      <Stack.Screen name="CreateVideo" component={CreateVideo} />
      <Stack.Screen name="EditVideo" component={EditVideo} />
      <Stack.Screen name="AnalyseVideo" component={AnalyseVideo} />
      <Stack.Screen name="AppHome" component={TabNavigator} />
    </Stack.Navigator>
  );
}