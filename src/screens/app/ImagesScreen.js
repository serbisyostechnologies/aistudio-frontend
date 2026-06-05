import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  Image,
  StatusBar,
} from 'react-native';
import { globalStyles, colors, fonts } from '../../styles/globalStyles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';

export default function ImagesScreen({ navigation }) {
  return (
    <KeyboardAvoidingView
      style={globalStyles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={globalStyles.container}>
          <View
            style={{
              height: StatusBar.currentHeight,
              backgroundColor: colors.primary,
            }}
          />
          <StatusBar
            backgroundColor={colors.primary}
            barStyle="light-content"
          />
          <View style={styles.header}>
            <Text style={styles.subTitle}>
              Create stunning AI-generated images, design beautiful photo
              collages, edit existing photos with powerful enhancement tools,
              and analyze images for detailed insights and intelligent
              improvements. All-in-one smart image processing built for
              creativity, editing, collage making, and advanced visual
              understanding.
            </Text>
          </View>
          <View style={styles.body}>
            <View style={styles.row}>
              <TouchableOpacity
                style={styles.card}
                onPress={() => navigation.push('CreateImage')}
              >
                <LinearGradient
                  colors={['#7C3AED', '#A855F7']}
                  style={styles.iconContainer}
                >
                  <Ionicons name="sparkles-outline" size={40} color="white" />
                </LinearGradient>

                <View style={styles.content}>
                  <Text style={styles.cardTitle}>Create Image</Text>

                  <Text style={styles.cardSubTitle}>
                    Generate stunning AI images from ideas with creative and
                    intelligent generation tools.
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.card}
                onPress={() => navigation.push('CreatePhotoCollage')}
              >
                <LinearGradient
                  colors={['#FF7E5F', '#FEB47B']}
                  style={styles.iconContainer}
                >
                  <Ionicons name="grid-outline" size={40} color="white" />
                </LinearGradient>

                <View style={styles.content}>
                  <Text style={styles.cardTitle}>Create Photo Collage</Text>

                  <Text style={styles.cardSubTitle}>
                    Arrange and merge multiple images into stylish high-quality
                    collages effortlessly.
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.card}>
                <LinearGradient
                  colors={['#2563EB', '#3B82F6']}
                  style={styles.iconContainer}
                >
                  <Ionicons name="brush-outline" size={40} color="white" />
                </LinearGradient>

                <View style={styles.content}>
                  <Text style={styles.cardTitle}>Edit Image</Text>

                  <Text style={styles.cardSubTitle}>
                    Edit and refine images with powerful tools for cropping,
                    adjustments, and precise enhancements.
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.card}>
                <LinearGradient
                  colors={['#16A34A', '#22C55E']}
                  style={styles.iconContainer}
                >
                  <Ionicons name="analytics-outline" size={40} color="white" />
                </LinearGradient>

                <View style={styles.content}>
                  <Text style={styles.cardTitle}>Analyse Image</Text>

                  <Text style={styles.cardSubTitle}>
                    Analyze images with smart AI insights to understand details,
                    quality, and visual composition.
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
  },
  header: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  body: {
    flex: 9,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    width: '100%',
    padding: 10,
  },
  subTitle: {
    color: colors.secondary,
    fontSize: 15,
    fontFamily: 'bitter-italic',
    textAlign: 'justify',
    padding: 20,
    lineHeight: 20,
  },
  row: {
    flex: 1,
    gap: 10,
  },
  card: {
    flex: 1,
    width: '92%',
    height: '100%',
    backgroundColor: colors.secondary,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    marginVertical: 10,
  },

  iconContainer: {
    width: 70,
    height: '100%',
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },

  content: {
    flex: 1,
    padding: 10,
  },

  cardTitle: {
    fontSize: 15,
    color: colors.primary,
    marginBottom: 5,
    fontFamily: fonts.bold,
  },

  cardSubTitle: {
    fontSize: 13,
    color: colors.primary,
    fontFamily: fonts.regular,
    lineHeight: 15,
    textAlign: 'left',
  },
});