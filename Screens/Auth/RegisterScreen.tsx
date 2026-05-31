import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  FlatList,
  Alert,
  ScrollView,
  ImageBackground,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { createUserWithEmailAndPassword } from "firebase/auth";
import {
  doc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import { auth, firestore } from "../../firebaseConfig";

const avatars = [
  { name: "avatar1.jpg", source: require("../../assets/avatars/avatar1.jpg") },
  { name: "avatar2.jpg", source: require("../../assets/avatars/avatar2.jpg") },
  { name: "avatar6.jpg", source: require("../../assets/avatars/avatar6.jpg") },
  { name: "avatar3.jpg", source: require("../../assets/avatars/avatar3.jpg") },
  { name: "avatar4.jpg", source: require("../../assets/avatars/avatar4.jpg") },
  { name: "avatar5.jpg", source: require("../../assets/avatars/avatar5.jpg") },
  { name: "avatar7.jpg", source: require("../../assets/avatars/avatar7.jpg") },
  { name: "avatar8.jpg", source: require("../../assets/avatars/avatar8.jpg") },
  { name: "avatar9.jpg", source: require("../../assets/avatars/avatar9.jpg") },
  { name: "avatar10.jpg", source: require("../../assets/avatars/avatar10.jpg") },
  { name: "avatar11.jpg", source: require("../../assets/avatars/avatar11.jpg") },
  { name: "avatar12.jpg", source: require("../../assets/avatars/avatar12.jpg") },
  { name: "avatar13.jpg", source: require("../../assets/avatars/avatar13.jpg") },
  { name: "avatar14.jpg", source: require("../../assets/avatars/avatar14.jpg") },
];

export default function RegisterScreen({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const isNicknameTaken = async (nicknameValue: string) => {
    const q = query(
      collection(firestore, "users"),
      where("nickname", "==", nicknameValue.trim())
    );

    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  };

  const handleRegister = async () => {
    if (!email.trim() || !password.trim() || !nickname.trim()) {
      Alert.alert("Uyarı", "Lütfen tüm alanları doldur.");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Uyarı", "Şifre en az 6 karakter olmalı.");
      return;
    }

    try {
      setIsLoading(true);

      const taken = await isNicknameTaken(nickname);

      if (taken) {
        setIsLoading(false);
        Alert.alert(
          "Hata",
          "Bu kullanıcı adı zaten kullanılıyor. Lütfen farklı bir kullanıcı adı seç."
        );
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      const user = userCredential.user;

      await setDoc(doc(firestore, "users", user.uid), {
        uid: user.uid,
        email: email.trim(),
        nickname: nickname.trim(),
        coins: 300,
        avatar: avatars[selectedIndex].name,
        createdAt: new Date().toISOString(),
        stats: {
          playedGames: 0,
          wins: 0,
          losses: 0,
          score: 0,
        },
      });

      setIsLoading(false);

      Alert.alert(
        "Başarılı 🎉",
        "Kayıt tamamlandı! 300 coin hesabına eklendi."
      );

      navigation.replace("HomeScreen");
    } catch (error: any) {
      setIsLoading(false);

      if (error.code === "auth/email-already-in-use") {
        Alert.alert("Hata", "Bu e-posta adresi zaten kullanılıyor.");
        return;
      }

      if (error.code === "auth/invalid-email") {
        Alert.alert("Hata", "Geçerli bir e-posta adresi gir.");
        return;
      }

      Alert.alert("Hata", "Kayıt başarısız oldu. Tekrar deneyin.");
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/Register.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      <LinearGradient
        colors={["rgba(0,0,0,0.8)", "rgba(20,20,40,0.95)"]}
        style={styles.overlay}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.container}>
            <Text style={styles.title}>MEMOLY KAYIT</Text>
            <Text style={styles.subtitle}>Avatarını Seç 🎭</Text>

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
              keyExtractor={(_, index) => index.toString()}
              contentContainerStyle={styles.avatarRow}
              showsHorizontalScrollIndicator={false}
            />

            <View style={styles.inputBox}>
              <Icon name="email-outline" size={20} color="#999" style={styles.inputIcon} />
              <TextInput
                placeholder="E-posta"
                placeholderTextColor="#aaa"
                style={styles.input}
                onChangeText={setEmail}
                value={email}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputBox}>
              <Icon name="lock-outline" size={20} color="#999" style={styles.inputIcon} />
              <TextInput
                placeholder="Şifre"
                placeholderTextColor="#aaa"
                style={styles.input}
                secureTextEntry
                onChangeText={setPassword}
                value={password}
              />
            </View>

            <View style={styles.inputBox}>
              <Icon name="account-outline" size={20} color="#999" style={styles.inputIcon} />
              <TextInput
                placeholder="Kullanıcı Adı"
                placeholderTextColor="#aaa"
                style={styles.input}
                onChangeText={setNickname}
                value={nickname}
                autoCapitalize="none"
              />
            </View>

            <TouchableOpacity
              style={[styles.button, isLoading && { opacity: 0.7 }]}
              onPress={handleRegister}
              disabled={isLoading}
            >
              <LinearGradient
                colors={["#1e90ff", "#00bfff"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.buttonGradient}
              >
                <Text style={styles.buttonText}>
                  {isLoading ? "Kayıt olunuyor..." : "Kayıt Ol"}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate("LoginScreen")}>
              <Text style={styles.link}>Zaten hesabın var mı? Giriş yap</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  overlay: { flex: 1, justifyContent: "center", alignItems: "center" },
  scrollContainer: { flexGrow: 1, justifyContent: "center", alignItems: "center" },
  container: {
    width: "90%",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 25,
    padding: 25,
    shadowColor: "#00bfff",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
    textShadowColor: "#1e90ff",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 10,
  },
  subtitle: {
    color: "#bbb",
    marginBottom: 20,
    fontSize: 16,
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
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 12,
    marginVertical: 8,
    width: "90%",
    paddingHorizontal: 10,
  },
  inputIcon: { marginRight: 8 },
  input: {
    flex: 1,
    color: "#fff",
    fontSize: 16,
    paddingVertical: 10,
  },
  button: {
    width: "90%",
    marginTop: 20,
    borderRadius: 30,
    overflow: "hidden",
    elevation: 8,
  },
  buttonGradient: {
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  link: {
    color: "#1e90ff",
    marginTop: 20,
    fontSize: 16,
    textDecorationLine: "underline",
  },
});