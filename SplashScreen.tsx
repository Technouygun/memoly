import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";

export default function SplashScreen({ navigation }: any) {
  const scaleAnim = useRef(new Animated.Value(0.85)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 60,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      navigation.replace("AuthChoiceScreen");
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <LinearGradient
      colors={["#0F172A", "#1E1B4B", "#312E81"]}
      style={styles.container}
    >
      <StatusBar style="light" />

      <Animated.View
        style={[
          styles.logoBox,
          {
            opacity: opacityAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Image
          source={require("./assets/splash-icon.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>

      <Text style={styles.title}>MEMOLY</Text>
      <Text style={styles.subtitle}>Hafızanı Güçlendir</Text>

      <View style={styles.bottom}>
        <Text style={styles.bottomText}>Memory Card Game</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  logoBox: {
    width: 190,
    height: 190,
    borderRadius: 48,
    alignItems: "center",
    justifyContent: "center",
  },

  logo: {
    width: 180,
    height: 180,
  },

  title: {
    marginTop: 22,
    fontSize: 42,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: 4,
  },

  subtitle: {
    marginTop: 8,
    fontSize: 16,
    color: "#CBD5E1",
    fontWeight: "600",
  },

  bottom: {
    position: "absolute",
    bottom: 55,
  },

  bottomText: {
    color: "#94A3B8",
    fontSize: 13,
    letterSpacing: 1,
  },
});