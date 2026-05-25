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
import { signInAnonymously } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../../../firebaseConfig";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../app/navigation/types";

type Nav = NativeStackNavigationProp<RootStackParamList, "GuestRegisterScreen">;

const avatars = [
   { name: "avatar1.png", source: require("../../../assets/avatars/avatar1.jpg") },
  { name: "avatar2.png", source: require("../../../assets/avatars/avatar2.jpg") },
  { name: "avatar3.png", source: require("../../../assets/avatars/avatar3.jpg") },
  { name: "avatar4.png", source: require("../../../assets/avatars/avatar4.jpg") },
  { name: "avatar5.png", source: require("../../../assets/avatars/avatar5.jpg") },
  { name: "avatar6.png", source: require("../../../assets/avatars/avatar6.jpg") },
  { name: "avatar7.png", source: require("../../../assets/avatars/avatar7.jpg") },
  { name: "avatar8.png", source: require("../../../assets/avatars/avatar8.jpg") },
  { name: "avatar9.png", source: require("../../../assets/avatars/avatar9.jpg") },
  { name: "avatar10.png", source: require("../../../assets/avatars/avatar10.jpg") },
  { name: "avatar11.png", source: require("../../../assets/avatars/avatar11.jpg") },
  { name: "avatar12.png", source: require("../../../assets/avatars/avatar12.jpg") },
  { name: "avatar13.png", source: require("../../../assets/avatars/avatar13.jpg") },
  { name: "avatar14.png", source: require("../../../assets/avatars/avatar14.jpg") },
];

export default function GuestRegisterScreen() {
  const navigation = useNavigation<Nav>();
  const [nickname, setNickname] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleGuestLogin = async () => {
    if (!nickname.trim()) {
      Alert.alert("Uyarı", "Lütfen nickname gir.");
      return;
    }

    try {
      setLoading(true);

      const userCredential = await signInAnonymously(auth);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        nickname: nickname.trim(),
        avatar: avatars[selectedIndex].name,
        isGuest: true,
        email: null,
        coins: 300,
        createdAt: serverTimestamp(),
      });

      navigation.replace("HomeScreen");
    } catch (error: any) {
      Alert.alert("Hata", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Misafir Giriş</Text>

        <Text style={styles.warning}>
          Eğer misafir olarak giriş yaparsanız hesabınız güvence altında olmaz.
          Uygulamayı silerseniz veya cihaz değiştirirseniz hesabınıza tekrar
          erişemeyebilirsiniz.
        </Text>

        <Text style={styles.label}>Nickname</Text>
        <TextInput
          style={styles.input}
          placeholder="Nickname gir"
          placeholderTextColor="#9ca3af"
          value={nickname}
          onChangeText={setNickname}
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
                    ? ["#22c55e", "#16a34a"]
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
          style={styles.button}
          onPress={handleGuestLogin}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Giriş Yapılıyor..." : "Devam Et"}
          </Text>
        </TouchableOpacity>
<TouchableOpacity onPress={() => navigation.navigate("LoginScreen")}>
  <Text style={styles.loginText}>Zaten hesabım var</Text>
</TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("EmailRegisterScreen")}>
          <Text style={styles.registerText}>Kayıt ol</Text>
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
    marginBottom: 16,
  },
  warning: {
    color: "#fbbf24",
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 22,
    textAlign: "center",
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
    marginBottom: 18,
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
    backgroundColor: "#22c55e",
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "900",
    fontSize: 17,
  },
  registerText: {
    color: "#60a5fa",
    textAlign: "center",
    fontWeight: "800",
  },
  loginText: {
  color: "#fff",
  textAlign: "center",
  fontSize: 16,
  fontWeight: "800",
},
});