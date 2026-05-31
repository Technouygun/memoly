import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ImageBackground,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { sendPasswordResetEmail } from "firebase/auth";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import { auth } from "../../firebaseConfig";

export default function PasswordReset({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handlePasswordReset = async () => {
    if (!email.trim()) {
      Alert.alert("Uyarı", "Lütfen e-posta adresinizi girin.");
      return;
    }

    try {
      setIsLoading(true);

      await sendPasswordResetEmail(auth, email.trim());

      setIsLoading(false);

      Alert.alert(
        "Başarılı",
        "Şifre sıfırlama bağlantısı e-posta adresinize gönderildi."
      );

      navigation.navigate("LoginScreen");
    } catch (error: any) {
      setIsLoading(false);

      if (error.code === "auth/invalid-email") {
        Alert.alert("Hata", "Geçerli bir e-posta adresi girin.");
        return;
      }

      if (error.code === "auth/user-not-found") {
        Alert.alert("Hata", "Bu e-posta adresiyle kayıtlı kullanıcı bulunamadı.");
        return;
      }

      Alert.alert("Hata", "Şifre sıfırlama işlemi başarısız oldu.");
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/Login.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      <LinearGradient
        colors={["rgba(0,0,0,0.8)", "rgba(15,15,35,0.95)"]}
        style={styles.overlay}
      >
        <View style={styles.container}>
          <Text style={styles.title}>ŞİFRE SIFIRLA</Text>

          <Text style={styles.description}>
            Kayıtlı e-posta adresinizi girin. Size şifre sıfırlama bağlantısı
            gönderelim.
          </Text>

          <View style={styles.inputBox}>
            <Icon name="email-outline" size={20} color="#bbb" />

            <TextInput
              placeholder="E-posta"
              placeholderTextColor="#bbb"
              style={styles.input}
              autoCapitalize="none"
              keyboardType="email-address"
              onChangeText={setEmail}
              value={email}
            />
          </View>

          <TouchableOpacity
            onPress={handlePasswordReset}
            style={[styles.button, isLoading && { opacity: 0.7 }]}
            disabled={isLoading}
          >
            <LinearGradient
              colors={["#1e90ff", "#00bfff"]}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>
                {isLoading ? "Gönderiliyor..." : "Sıfırlama Linki Gönder"}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("LoginScreen")}>
            <Text style={styles.link}>Giriş ekranına dön</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "90%",
    padding: 25,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 20,
    alignItems: "center",
  },
  title: {
    color: "#fff",
    fontSize: 30,
    marginBottom: 15,
    fontWeight: "800",
    textAlign: "center",
  },
  description: {
    color: "#ccc",
    fontSize: 15,
    textAlign: "center",
    marginBottom: 22,
    lineHeight: 22,
  },
  inputBox: {
    width: "90%",
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.1)",
    paddingHorizontal: 10,
    borderRadius: 10,
    marginBottom: 12,
    alignItems: "center",
  },
  input: {
    flex: 1,
    color: "#fff",
    padding: 10,
  },
  button: {
    width: "90%",
    borderRadius: 20,
    overflow: "hidden",
    marginTop: 15,
  },
  buttonGradient: {
    padding: 15,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "bold",
  },
  link: {
    color: "#1e90ff",
    marginTop: 18,
    fontSize: 15,
    textDecorationLine: "underline",
  },
});