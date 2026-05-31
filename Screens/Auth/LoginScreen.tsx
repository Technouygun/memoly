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
import { signInWithEmailAndPassword } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import { auth, firestore } from "../../firebaseConfig";

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Uyarı", "Lütfen e-posta ve şifre giriniz.");
      return;
    }

    try {
      const cred = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      const uid = cred.user.uid;

      const userDoc = await getDoc(doc(firestore, "users", uid));

      if (userDoc.exists()) {
        await AsyncStorage.setItem(
          "userData",
          JSON.stringify({
            uid,
            ...userDoc.data(),
          })
        );
      }

      navigation.replace("HomeScreen");
    } catch (err) {
      Alert.alert(
        "Hata",
        "Girdiğiniz bilgiler doğru değildir. Kontrol edip tekrar deneyin."
      );
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/Login.jpg")}
      style={styles.background}
    >
      <LinearGradient
        colors={["rgba(0,0,0,0.8)", "rgba(15,15,35,0.95)"]}
        style={styles.overlay}
      >
        <View style={styles.container}>
          <Text style={styles.title}>MEMOLY GİRİŞ</Text>

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

          <View style={styles.inputBox}>
            <Icon name="lock-outline" size={20} color="#bbb" />

            <TextInput
              placeholder="Şifre"
              placeholderTextColor="#bbb"
              secureTextEntry
              style={styles.input}
              onChangeText={setPassword}
              value={password}
            />
          </View>

          <TouchableOpacity onPress={handleLogin} style={styles.button}>
            <LinearGradient
              colors={["#1e90ff", "#00bfff"]}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>Giriş Yap</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("ForgotPasswordScreen")}
          >
            <Text style={styles.forgotText}>Şifremi Unuttum</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("RegisterScreen")}>
            <Text style={styles.link}>Kayıt Ol</Text>
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
    fontSize: 32,
    marginBottom: 20,
    fontWeight: "800",
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
    marginTop: 20,
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
  forgotText: {
    color: "#ffd700",
    textAlign: "center",
    marginTop: 10,
  },
  link: {
    color: "#1e90ff",
    marginTop: 15,
    textDecorationLine: "underline",
  },
});