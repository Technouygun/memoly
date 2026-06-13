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
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { signInAnonymously } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../../../firebaseConfig";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../app/navigation/types";
import { useLanguage } from "../../../Screens/language/LanguageContext";

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
  const { t } = useLanguage();

  const [nickname, setNickname] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleGuestLogin = async () => {
    Keyboard.dismiss();

    if (!nickname.trim()) {
      Alert.alert(t.warning, t.enterNickname);
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
        jokers: {
          detective: 1,
          bomb: 1,
          golden: 1,
        },
        createdAt: serverTimestamp(),
      });

      navigation.replace("HomeScreen");
    } catch (error: any) {
      Alert.alert(t.error, error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={["#070712", "#101035", "#171753"]} style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.glowOne} />
              <View style={styles.glowTwo} />

              <View style={styles.header}>
                <Text style={styles.logo}>MEMOLY</Text>
                <Text style={styles.subLogo}>GUEST ACCESS</Text>
              </View>

              <View style={styles.card}>
                <Text style={styles.title}>{t.guestLogin}</Text>
                <Text style={styles.warning}>{t.guestWarning}</Text>

                <Text style={styles.label}>{t.nickname}</Text>
                <TextInput
                  style={styles.input}
                  placeholder={t.enterNickname}
                  placeholderTextColor="rgba(255,255,255,0.42)"
                  value={nickname}
                  onChangeText={setNickname}
                  maxLength={14}
                  returnKeyType="done"
                  onSubmitEditing={handleGuestLogin}
                />

                <Text style={styles.label}>{t.chooseAvatar}</Text>
                <FlatList
                  data={avatars}
                  horizontal
                  keyExtractor={(item) => item.name}
                  showsHorizontalScrollIndicator={false}
                  keyboardShouldPersistTaps="handled"
                  contentContainerStyle={styles.avatarRow}
                  renderItem={({ item, index }) => {
                    const active = selectedIndex === index;

                    return (
                      <TouchableOpacity
                        onPress={() => {
                          Keyboard.dismiss();
                          setSelectedIndex(index);
                        }}
                        activeOpacity={0.85}
                      >
                        <LinearGradient
                          colors={
                            active
                              ? ["#22C55E", "#16A34A", "#00D2FF"]
                              : ["rgba(255,255,255,0.10)", "rgba(255,255,255,0.06)"]
                          }
                          style={styles.avatarBorder}
                        >
                          <Image source={item.source} style={styles.avatar} />
                        </LinearGradient>
                      </TouchableOpacity>
                    );
                  }}
                />

                <TouchableOpacity
                  style={[styles.primaryButton, loading && styles.disabledButton]}
                  onPress={handleGuestLogin}
                  disabled={loading}
                  activeOpacity={0.9}
                >
                  <LinearGradient
                    colors={["#22C55E", "#16A34A", "#00D2FF"]}
                    style={styles.buttonGradient}
                  >
                    <Text style={styles.primaryText}>
                      {loading ? t.loggingIn : t.continue}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.secondaryButton}
                  onPress={() => {
                    Keyboard.dismiss();
                    navigation.navigate("LoginScreen");
                  }}
                >
                  <Text style={styles.secondaryText}>{t.alreadyHaveAccount}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.secondaryButton}
                  onPress={() => {
                    Keyboard.dismiss();
                    navigation.navigate("EmailRegisterScreen");
                  }}
                >
                  <Text style={styles.secondaryText}>{t.register}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.choiceButton}
                  onPress={() => {
                    Keyboard.dismiss();
                    navigation.navigate("AuthChoiceScreen");
                  }}
                >
                  <Text style={styles.choiceText}>← Giriş Seçenekleri</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  keyboardView: { flex: 1 },

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 22,
    paddingTop: 24,
    paddingBottom: 22,
    justifyContent: "center",
  },

  glowOne: {
    position: "absolute",
    width: 270,
    height: 270,
    borderRadius: 135,
    backgroundColor: "rgba(108,92,231,0.34)",
    top: -90,
    right: -110,
  },
  glowTwo: {
    position: "absolute",
    width: 230,
    height: 230,
    borderRadius: 115,
    backgroundColor: "rgba(0,210,255,0.18)",
    bottom: 80,
    left: -105,
  },

  header: { alignItems: "center", marginBottom: 20 },
  logo: { fontSize: 40, fontWeight: "900", color: "#FFFFFF", letterSpacing: 3 },
  subLogo: {
    marginTop: 5,
    color: "#00D2FF",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 2,
  },

  card: {
    borderRadius: 28,
    padding: 17,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
  },

  title: {
    color: "#FFFFFF",
    fontSize: 27,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 10,
  },
  warning: {
    color: "#FACC15",
    fontSize: 13,
    fontWeight: "700",
    textAlign: "center",
    lineHeight: 19,
    marginBottom: 18,
  },

  label: { color: "#FFFFFF", fontSize: 13, fontWeight: "900", marginBottom: 7 },
  input: {
    height: 50,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
    paddingHorizontal: 13,
    marginBottom: 14,
  },

  avatarRow: { paddingVertical: 4, marginBottom: 18 },
  avatarBorder: { borderRadius: 999, padding: 3, marginRight: 9 },
  avatar: { width: 60, height: 60, borderRadius: 30 },

  primaryButton: { borderRadius: 21, overflow: "hidden", marginBottom: 11 },
  disabledButton: { opacity: 0.55 },
  buttonGradient: { paddingVertical: 15, alignItems: "center" },
  primaryText: { color: "#FFFFFF", fontSize: 17, fontWeight: "900" },

  secondaryButton: {
    paddingVertical: 13,
    borderRadius: 18,
    backgroundColor: "rgba(0,210,255,0.10)",
    borderWidth: 1,
    borderColor: "rgba(0,210,255,0.32)",
    alignItems: "center",
    marginBottom: 9,
  },
  secondaryText: { color: "#FFFFFF", fontSize: 14, fontWeight: "900" },

  choiceButton: {
    paddingVertical: 13,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.07)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
  },
  choiceText: { color: "#D8D8F0", fontSize: 14, fontWeight: "900" },
});