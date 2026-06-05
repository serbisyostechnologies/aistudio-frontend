import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { globalStyles } from '../../styles/globalStyles';

export default function WelcomeScreen({navigation}) {
  const fullText = "Welcome to the future of creativity. Create insane AI-powered photos, videos, and edits in just a few taps. Whether you're making content for socials, designing something aesthetic, or just experimenting for fun, AISerbisyosStudio gives you powerful tools without the complicated stuff. Fast, smart, and built for creators who want everything to look next-level.";

  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    let index = 0;

    const interval = setInterval(() => {
      setDisplayedText(fullText.slice(0, index));

      index++;

      if (index > fullText.length) {
        clearInterval(interval);
      }
    }, 20);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={globalStyles.container}>
      <View style={styles.header}>
        <Image
            source={require("../../assets/images/logos/logo.png")}
            style={globalStyles.logo}
            resizeMode="contain"
          />
          <Text style={globalStyles.title}>AISerbisyosStudio</Text>
          <Text style={styles.subTitle}>{displayedText}</Text>
      </View>
      <View style={styles.body}>
        <TouchableOpacity style={globalStyles.button} onPress={() => navigation.navigate('Login')}>
          <Text style={globalStyles.buttonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity style={globalStyles.button}onPress={() => navigation.navigate('Register')}>
          <Text style={globalStyles.buttonText}>Register</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff"
  },
  header: {
    flex: 7.5,
    backgroundColor: "#ffffff",
    alignItems: 'center',
    marginTop: 50
  },
  logo: {
    width: 60,
    height: 60,
  },
  text: {
    color: '#003a6b',
    fontSize: 20,
    fontFamily: "bitter-bold",
    marginBottom: 10,
  },
  subTitle: {
    color: '#003a6b',
    fontSize: 15,
    fontFamily: 'bitter-italic',
    textAlign: 'justify',
    padding: 20,
    lineHeight: 30,
  },
  body: {
    flex: 2.5,
    backgroundColor: "#003a6b",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20
  }
});