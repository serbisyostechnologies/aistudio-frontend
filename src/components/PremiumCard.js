import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { globalStyles, colors, fonts } from '../styles/globalStyles';

const PremiumCard = ({ credits }) => {
  return (
    <LinearGradient
      colors={['#6A11CB', '#2575FC']}
      start={{ x: 1, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.card}
    >
      <View style={styles.iconContainer}>
        <Ionicons name="trophy" size={24} color="#fff" />
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.title}>
          {credits ? `${credits} Free Credits🎉` : 'Continue Creating'}
        </Text>
        <Text style={styles.subtitle}>
          {credits
            ? 'You have received 10 free credits. Start exploring premium features now.'
            : 'Get more credits to unlock uninterrupted access and continue creating without limits.'}
        </Text>
      </View>

      {!credits && (
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Get Credits</Text>
          <Ionicons name="chevron-forward" size={18} color="#3b3bff" />
        </TouchableOpacity>
      )}
    </LinearGradient>
  );
};

export default PremiumCard;

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 18,
    margin: 15,
  },
  iconContainer: {
    width: 45,
    height: 45,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    color: '#fff',
    fontSize: 16,
    fontFamily: fonts.bold,
  },
  subtitle: {
    color: colors.secondary,
    fontSize: 12,
    marginTop: 3,
    fontFamily: fonts.regular,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  buttonText: {
    color: colors.primary,
    fontWeight: '600',
    marginRight: 5,
    fontFamily: fonts.bold,
  },
});