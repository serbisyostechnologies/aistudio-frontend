import React, { useEffect, useRef, useState } from "react";

import { Text, Animated, StyleSheet } from "react-native";

export default function AnimatedTextLoader({
  texts,
  duration = 1000,
  minOpacity = 0.3,
  textStyle = {},
}) {
  const [index, setIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(minOpacity)).current;

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev === texts.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration,
          useNativeDriver: true,
        }),

        Animated.timing(fadeAnim, {
          toValue: minOpacity,
          duration,
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();

    return () => animation.stop();
  }, []);

  return (
    <Animated.Text
      style={[
        styles.text,
        textStyle,
        {
          opacity: fadeAnim,
        },
      ]}
    >
      {texts[index]}
    </Animated.Text>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 18,
    fontWeight: "600",
    color: "#003a6b",
    fontFamily: "saira-italic",
  },
});