import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";

import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../firebaseConfig";

import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../app/navigation/types";

type Nav = NativeStackNavigationProp<
  RootStackParamList,
  "LoginScreen"
>;

export default function LoginScreen() {
  const navigation = useNavigation<Nav>();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Uyarı", "Lütfen tüm alanları doldur.");
      return;
    }

    try {
      setLoading(true);

      await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      navigation.replace("FirstOnline");
    } catch (error: any) {
      Alert.alert("Giriş Hatası", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Giriş Yap</Text>

        <Text style={styles.label}>E-posta</Text>

        <TextInput
          style={styles.input}
          placeholder="mail@example.com"
          placeholderTextColor="#9ca3af"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.label}>Şifre</Text>

        <TextInput
          style={styles.input}
          placeholder="Şifre"
          placeholderTextColor="#9ca3af"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Giriş Yapılıyor..." : "Giriş Yap"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            navigation.navigate("EmailRegisterScreen")
          }
        >
          <Text style={styles.registerText}>
            Hesabın yok mu? Kayıt ol
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111827",
    justifyContent: "center",
    padding: 20,
  },

  card: {
    backgroundColor: "#1f2937",
    borderRadius: 24,
    padding: 22,
  },

  title: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 24,
  },

  label: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 8,
  },

  input: {
    backgroundColor: "#374151",
    color: "#fff",
    padding: 15,
    borderRadius: 14,
    marginBottom: 18,
  },

  button: {
    backgroundColor: "#2563eb",
    padding: 16,
    borderRadius: 16,
    marginTop: 10,
  },

  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 17,
    fontWeight: "900",
  },

  registerText: {
    color: "#60a5fa",
    textAlign: "center",
    marginTop: 18,
    fontWeight: "700",
  },
});