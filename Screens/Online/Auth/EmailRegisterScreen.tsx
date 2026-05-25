import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  FlatList,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, firestore } from "../../../firebaseConfig";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../app/navigation/types";

type Nav = NativeStackNavigationProp<RootStackParamList, "EmailRegisterScreen">;

const avatars = [
  { name: "avatar1.jpg", source: require("../../../assets/avatars/avatar1.jpg") },
  { name: "avatar2.jpg", source: require("../../../assets/avatars/avatar2.jpg") },
  { name: "avatar3.jpg", source: require("../../../assets/avatars/avatar3.jpg") },
  { name: "avatar4.jpg", source: require("../../../assets/avatars/avatar4.jpg") },
  { name: "avatar5.jpg", source: require("../../../assets/avatars/avatar5.jpg") },
  { name: "avatar6.jpg", source: require("../../../assets/avatars/avatar6.jpg") },
  { name: "avatar7.jpg", source: require("../../../assets/avatars/avatar7.jpg") },
  { name: "avatar8.jpg", source: require("../../../assets/avatars/avatar8.jpg") },
  { name: "avatar9.jpg", source: require("../../../assets/avatars/avatar9.jpg") },
  { name: "avatar10.jpg", source: require("../../../assets/avatars/avatar10.jpg") },
  { name: "avatar11.jpg", source: require("../../../assets/avatars/avatar11.jpg") },
  { name: "avatar12.jpg", source: require("../../../assets/avatars/avatar12.jpg") },
  { name: "avatar13.jpg", source: require("../../../assets/avatars/avatar13.jpg") },
  { name: "avatar14.jpg", source: require("../../../assets/avatars/avatar14.jpg") },
];

export default function EmailRegisterScreen() {
  const navigation = useNavigation<Nav>();

  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    const cleanNickname = nickname.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanNickname || !cleanEmail || !cleanPassword) {
      Alert.alert("Uyarı", "Lütfen tüm alanları doldur.");
      return;
    }

    if (cleanPassword.length < 6) {
      Alert.alert("Uyarı", "Şifre en az 6 karakter olmalı.");
      return;
    }

    try {
      setLoading(true);

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        cleanEmail,
        cleanPassword
      );

      const user = userCredential.user;

      await setDoc(doc(firestore, "users", user.uid), {
        uid: user.uid,
        nickname: cleanNickname,
        avatar: avatars[selectedIndex].name,
        isGuest: false,
        email: cleanEmail,
        coins: 300,
        createdAt: serverTimestamp(),
      });

      navigation.replace("FirstOnline");
    } catch (error: any) {
      let message = "Kayıt sırasında bir hata oluştu.";

      if (error.code === "auth/email-already-in-use") {
        message = "Bu e-posta zaten kayıtlı. Lütfen giriş yap.";
      } else if (error.code === "auth/invalid-email") {
        message = "Geçerli bir e-posta adresi gir.";
      } else if (error.code === "auth/weak-password") {
        message = "Şifre en az 6 karakter olmalı.";
      } else if (error.code === "permission-denied") {
        message = "Firestore izin hatası. Firebase Rules kontrol edilmeli.";
      }

      Alert.alert("Kayıt Hatası", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Mail ile Kayıt Ol</Text>

        <Text style={styles.label}>Nickname</Text>
        <TextInput
          style={styles.input}
          placeholder="Nickname"
          placeholderTextColor="#9ca3af"
          value={nickname}
          onChangeText={setNickname}
        />

        <Text style={styles.label}>E-posta</Text>
        <TextInput
          style={styles.input}
          placeholder="ornek@mail.com"
          placeholderTextColor="#9ca3af"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
        />

        <Text style={styles.label}>Şifre</Text>
        <TextInput
          style={styles.input}
          placeholder="Şifre"
          placeholderTextColor="#9ca3af"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <Text style={styles.label}>Avatar Seç</Text>

        <FlatList
          data={avatars}
          horizontal
          renderItem={({ item, index }) => (
            <TouchableOpacity onPress={() => setSelectedIndex(index)}>
              <LinearGradient
                colors={
                  selectedIndex === index
                    ? ["#1e90ff", "#00bfff"]
                    : ["rgba(255,255,255,0.1)", "rgba(255,255,255,0.1)"]
                }
                style={styles.avatarBorder}
              >
                <Image source={item.source} style={styles.avatar} />
              </LinearGradient>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.name}
          contentContainerStyle={styles.avatarRow}
          showsHorizontalScrollIndicator={false}
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.disabledButton]}
          onPress={handleRegister}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Kayıt Yapılıyor..." : "Kayıt Ol"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("LoginScreen")}>
          <Text style={styles.loginText}>Zaten hesabım var</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("GuestRegisterScreen")}>
          <Text style={styles.guestText}>Misafir olarak devam et</Text>
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
    fontSize: 28,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 22,
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
    padding: 14,
    borderRadius: 14,
    marginBottom: 14,
  },
  avatarRow: {
    flexDirection: "row",
    marginBottom: 25,
  },
  avatarBorder: {
    borderRadius: 40,
    padding: 3,
    marginHorizontal: 5,
  },
  avatar: {
    width: 65,
    height: 65,
    borderRadius: 35,
  },
  button: {
    backgroundColor: "#2563eb",
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "900",
    fontSize: 17,
  },
  loginText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 8,
  },
  guestText: {
    color: "#22c55e",
    textAlign: "center",
    fontWeight: "800",
  },
});