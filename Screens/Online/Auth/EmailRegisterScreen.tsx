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
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, firestore } from "../../../firebaseConfig";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../app/navigation/types";
import { useLanguage } from "../../../Screens/language/LanguageContext";

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
  const { t } = useLanguage();

  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    Keyboard.dismiss();

    const cleanNickname = nickname.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanNickname || !cleanEmail || !cleanPassword) {
      Alert.alert(t.warning, t.fillAllFields);
      return;
    }

    if (cleanPassword.length < 6) {
      Alert.alert(t.warning, t.passwordMin);
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
        jokers: {
          detective: 1,
          bomb: 1,
          golden: 1,
        },
        createdAt: serverTimestamp(),
      });

      navigation.replace("OnlineTabs");
    } catch (error: any) {
      let message = t.registerDefaultError;

      if (error.code === "auth/email-already-in-use") message = t.emailAlreadyRegistered;
      else if (error.code === "auth/invalid-email") message = t.invalidEmail;
      else if (error.code === "auth/weak-password") message = t.passwordMin;
      else if (error.code === "permission-denied") message = t.firestorePermissionError;

      Alert.alert(t.registerError, message);
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
                <Text style={styles.subLogo}>CREATE ACCOUNT</Text>
              </View>

              <View style={styles.card}>
                <Text style={styles.title}>{t.registerWithEmail}</Text>

                <Text style={styles.label}>{t.nickname}</Text>
                <TextInput
                  style={styles.input}
                  placeholder={t.nickname}
                  placeholderTextColor="rgba(255,255,255,0.42)"
                  value={nickname}
                  onChangeText={setNickname}
                  maxLength={14}
                  returnKeyType="next"
                />

                <Text style={styles.label}>{t.email}</Text>
                <TextInput
                  style={styles.input}
                  placeholder={t.email}
                  placeholderTextColor="rgba(255,255,255,0.42)"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="email-address"
                  returnKeyType="next"
                />

                <Text style={styles.label}>{t.password}</Text>
                <TextInput
                  style={styles.input}
                  placeholder={t.password}
                  placeholderTextColor="rgba(255,255,255,0.42)"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  returnKeyType="done"
                  onSubmitEditing={handleRegister}
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
                              ? ["#8E7CFF", "#6C5CE7", "#00D2FF"]
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
                  onPress={handleRegister}
                  disabled={loading}
                  activeOpacity={0.9}
                >
                  <LinearGradient
                    colors={["#8E7CFF", "#6C5CE7", "#00D2FF"]}
                    style={styles.buttonGradient}
                  >
                    <Text style={styles.primaryText}>
                      {loading ? t.registering : t.register}
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

  header: { alignItems: "center", marginBottom: 18 },
  logo: { fontSize: 38, fontWeight: "900", color: "#FFFFFF", letterSpacing: 3 },
  subLogo: { marginTop: 5, color: "#00D2FF", fontSize: 12, fontWeight: "900", letterSpacing: 2 },

  card: {
    borderRadius: 28,
    padding: 17,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
  },

  title: { color: "#FFFFFF", fontSize: 25, fontWeight: "900", textAlign: "center", marginBottom: 18 },
  label: { color: "#FFFFFF", fontSize: 13, fontWeight: "900", marginBottom: 7 },
  input: {
    height: 48,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
    paddingHorizontal: 13,
    marginBottom: 12,
  },

  avatarRow: { paddingVertical: 4, marginBottom: 16 },
  avatarBorder: { borderRadius: 999, padding: 3, marginRight: 9 },
  avatar: { width: 58, height: 58, borderRadius: 29 },

  primaryButton: { borderRadius: 21, overflow: "hidden", marginBottom: 11 },
  disabledButton: { opacity: 0.55 },
  buttonGradient: { paddingVertical: 15, alignItems: "center" },
  primaryText: { color: "#FFFFFF", fontSize: 17, fontWeight: "900" },

  secondaryButton: {
    paddingVertical: 14,
    borderRadius: 18,
    backgroundColor: "rgba(0,210,255,0.10)",
    borderWidth: 1,
    borderColor: "rgba(0,210,255,0.32)",
    alignItems: "center",
    marginBottom: 10,
  },
  secondaryText: { color: "#FFFFFF", fontSize: 14, fontWeight: "900" },

  choiceButton: {
    paddingVertical: 14,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.07)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
  },
  choiceText: { color: "#D8D8F0", fontSize: 14, fontWeight: "900" },
});