import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { signOut } from "firebase/auth";
import { auth, firestore } from "../../../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useLanguage } from "../../language/LanguageContext";

const getAvatarSource = (avatarName: string) => {
  switch (avatarName) {
    case "avatar1.jpg":
    case "avatar1.png":
      return require("../../../assets/avatars/avatar1.jpg");
    case "avatar2.jpg":
    case "avatar2.png":
      return require("../../../assets/avatars/avatar2.jpg");
    case "avatar3.jpg":
    case "avatar3.png":
      return require("../../../assets/avatars/avatar3.jpg");
    case "avatar4.jpg":
    case "avatar4.png":
      return require("../../../assets/avatars/avatar4.jpg");
    case "avatar5.jpg":
    case "avatar5.png":
      return require("../../../assets/avatars/avatar5.jpg");
    case "avatar6.jpg":
    case "avatar6.png":
      return require("../../../assets/avatars/avatar6.jpg");
    case "avatar7.jpg":
    case "avatar7.png":
      return require("../../../assets/avatars/avatar7.jpg");
    case "avatar8.jpg":
    case "avatar8.png":
      return require("../../../assets/avatars/avatar8.jpg");
    case "avatar9.jpg":
    case "avatar9.png":
      return require("../../../assets/avatars/avatar9.jpg");
    case "avatar10.jpg":
    case "avatar10.png":
      return require("../../../assets/avatars/avatar10.jpg");
    case "avatar11.jpg":
    case "avatar11.png":
      return require("../../../assets/avatars/avatar11.jpg");
    case "avatar12.jpg":
    case "avatar12.png":
      return require("../../../assets/avatars/avatar12.jpg");
    case "avatar13.jpg":
    case "avatar13.png":
      return require("../../../assets/avatars/avatar13.jpg");
    case "avatar14.jpg":
    case "avatar14.png":
      return require("../../../assets/avatars/avatar14.jpg");
    default:
      return require("../../../assets/avatars/avatar1.jpg");
  }
};

export default function ProfileScreen() {
  const navigation = useNavigation<any>();
  const { t } = useLanguage();

  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const docRef = doc(firestore, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();

          setUserData({
            ...data,
            season2Points: data.season2Points ?? 0,
            coins: data.coins ?? 0,
            avatarSource: getAvatarSource(data.avatar),
          });
        }
      } catch (err) {
        console.log("Profil yüklenemedi:", err);
      }
    };

    loadUserData();
  }, []);

  const handleHome = () => {
    navigation.navigate("OnlineTabs");
  };

  const handleLanguage = () => {
    navigation.navigate("LanguageScreen");
  };

  const handleAuthChoice = () => {
    navigation.navigate("AuthChoiceScreen");
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      Alert.alert(t.info, t.logoutSuccess);
      navigation.navigate("HomeScreen");
    } catch (err) {
      Alert.alert(t.error, t.logoutError);
    }
  };

  if (!userData) {
    return (
      <LinearGradient colors={["#070712", "#101035", "#171753"]} style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00D2FF" />
        <Text style={styles.loadingText}>{t.profileLoading}</Text>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={["#070712", "#101035", "#171753"]} style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.glowOne} />
        <View style={styles.glowTwo} />

        <View style={styles.header}>
          <Text style={styles.logo}>MEMOLY</Text>
          <Text style={styles.subLogo}>PROFILE CENTER</Text>
        </View>

        <View style={styles.profileCard}>
          <LinearGradient
            colors={["#8E7CFF", "#6C5CE7", "#00D2FF"]}
            style={styles.avatarBorder}
          >
            <Image source={userData.avatarSource} style={styles.avatar} />
          </LinearGradient>

          <Text style={styles.nickname}>{userData.nickname}</Text>

          <Text style={styles.email}>
            {userData.email ? userData.email : "Misafir Oyuncu"}
          </Text>

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Icon name="trophy" size={24} color="#FACC15" />
              <Text style={styles.statLabel}>{t.points}</Text>
              <Text style={styles.statValue}>{userData.season2Points}</Text>
            </View>

            <View style={styles.statBox}>
              <Icon name="hand-coin" size={24} color="#00D2FF" />
              <Text style={styles.statLabel}>Coin</Text>
              <Text style={styles.statValue}>{userData.coins}</Text>
            </View>
          </View>
        </View>

        <View style={styles.menuCard}>
          <TouchableOpacity style={styles.button} onPress={handleHome} activeOpacity={0.88}>
            <View style={styles.iconBox}>
              <Icon name="home" size={23} color="#00D2FF" />
            </View>

            <View style={styles.buttonTextArea}>
              <Text style={styles.buttonTitle}>{t.homePage}</Text>
              <Text style={styles.buttonDesc}>Online ana sayfaya dön</Text>
            </View>

            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handleLanguage} activeOpacity={0.88}>
            <View style={styles.iconBox}>
              <Icon name="translate" size={23} color="#00D2FF" />
            </View>

            <View style={styles.buttonTextArea}>
              <Text style={styles.buttonTitle}>{t.languageSettings}</Text>
              <Text style={styles.buttonDesc}>Uygulama dilini değiştir</Text>
            </View>

            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>

        

          <TouchableOpacity style={styles.logoutButton} onPress={handleSignOut} activeOpacity={0.88}>
            <LinearGradient
              colors={["rgba(239,68,68,0.25)", "rgba(239,68,68,0.12)"]}
              style={styles.logoutGradient}
            >
              <Icon name="logout" size={23} color="#FFFFFF" />
              <Text style={styles.logoutText}>{t.logout}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  safe: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 28,
  },

  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  loadingText: {
    color: "#FFFFFF",
    marginTop: 12,
    fontSize: 15,
    fontWeight: "800",
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

  header: {
    alignItems: "center",
    marginTop: 8,
    marginBottom: 24,
  },

  logo: {
    fontSize: 40,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: 3,
  },

  subLogo: {
    marginTop: 5,
    color: "#00D2FF",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 2,
  },

  profileCard: {
    alignItems: "center",
    borderRadius: 30,
    padding: 20,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
    marginBottom: 16,
  },

  avatarBorder: {
    width: 126,
    height: 126,
    borderRadius: 63,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },

  avatar: {
    width: 116,
    height: 116,
    borderRadius: 58,
    borderWidth: 3,
    borderColor: "#070712",
  },

  nickname: {
    color: "#FFFFFF",
    fontSize: 25,
    fontWeight: "900",
    textAlign: "center",
  },

  email: {
    color: "#BFC0DD",
    fontSize: 13,
    fontWeight: "700",
    marginTop: 5,
    marginBottom: 18,
    textAlign: "center",
  },

  statsRow: {
    width: "100%",
    flexDirection: "row",
    gap: 12,
  },

  statBox: {
    flex: 1,
    height: 88,
    borderRadius: 22,
    backgroundColor: "rgba(0,210,255,0.10)",
    borderWidth: 1,
    borderColor: "rgba(0,210,255,0.28)",
    alignItems: "center",
    justifyContent: "center",
  },

  statLabel: {
    color: "#AFAFD1",
    fontSize: 11,
    fontWeight: "900",
    marginTop: 5,
  },

  statValue: {
    color: "#FFFFFF",
    fontSize: 21,
    fontWeight: "900",
    marginTop: 2,
  },

  menuCard: {
    borderRadius: 28,
    padding: 14,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
  },

  button: {
    minHeight: 70,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.07)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    marginBottom: 11,
  },

  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: "rgba(0,210,255,0.12)",
    borderWidth: 1,
    borderColor: "rgba(0,210,255,0.28)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  buttonTextArea: {
    flex: 1,
  },

  buttonTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
  },

  buttonDesc: {
    color: "#BFC0DD",
    fontSize: 12,
    fontWeight: "700",
    marginTop: 3,
  },

  arrow: {
    color: "#00D2FF",
    fontSize: 31,
    fontWeight: "700",
    marginLeft: 8,
  },

  logoutButton: {
    borderRadius: 22,
    overflow: "hidden",
  },

  logoutGradient: {
    minHeight: 62,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "rgba(239,68,68,0.45)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
  },

  logoutText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
  },
});