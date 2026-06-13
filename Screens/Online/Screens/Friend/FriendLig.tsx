import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useLanguage } from "../../../language/LanguageContext";

export default function FriendLig() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { t } = useLanguage();

  const { friendUid, friendNickname } = route.params || {};

  const levels = [
    {
      title: t.easy,
      sub: t.game4x4,
      icon: "cards-playing-outline",
      screen: "FirstBasitFriend",
      color: "#22C55E",
    },
    {
      title: t.medium,
      sub: t.game4x5,
      icon: "brain",
      screen: "FirstOrtaFriend",
      color: "#38BDF8",
    },
    {
      title: t.hard,
      sub: t.game4x6,
      icon: "sword-cross",
      screen: "FirstZorFriend",
      color: "#FB923C",
    },
  ];

  return (
    <LinearGradient colors={["#070712", "#101035", "#171753"]} style={styles.container}>
      <SafeAreaView style={styles.safe}>
                  <View style={{ height: 20}} />
        
        <View style={styles.glowOne} />
        <View style={styles.glowTwo} />

        <View style={styles.header}>
          <Text style={styles.logo}>MEMOLY</Text>
          <Text style={styles.subLogo}>FRIEND BATTLE</Text>
        </View>

        <View style={styles.heroCard}>
          <View style={styles.iconBadge}>
            <Icon name="account" size={40} color="#00D2FF" />
          </View>

          <Text style={styles.title}>{t.friendGame}</Text>
          <Text style={styles.subtitle}>{t.friendGameSubtitle}</Text>

         
        </View>

        <View style={styles.levelArea}>
          {levels.map((level) => (
            <TouchableOpacity
              key={level.screen}
              style={styles.levelButton}
              activeOpacity={0.9}
              onPress={() =>
                navigation.navigate(level.screen, {
                  friendUid,
                  friendNickname,
                })
              }
            >
              <View
                style={[
                  styles.levelGlow,
                  { backgroundColor: `${level.color}22` },
                ]}
              />

              <LinearGradient
                colors={[`${level.color}EE`, "#6C5CE7"]}
                style={styles.levelIconBox}
              >
                <Icon name={level.icon as any} size={32} color="#FFFFFF" />
              </LinearGradient>

              <View style={styles.levelTextArea}>
                <Text style={styles.levelTitle}>{level.title}</Text>
                <Text style={styles.levelSub}>{level.sub}</Text>
              </View>

              <Icon name="chevron-right" size={34} color={level.color} />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate("OnlineTabs", {
  screen: "FirstFriend",
})}
          activeOpacity={0.88}
        >
          <View style={styles.backIconBox}>
            <Icon name="arrow-left" size={22} color="#00D2FF" />
          </View>
          <Text style={styles.backText}>{t.backToHome}</Text>
          <Text style={styles.backArrow}>›</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  safe: {
    flex: 1,
    paddingHorizontal: 22,
    paddingTop: 24,
    paddingBottom: 26,
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
    bottom: 90,
    left: -105,
  },

  header: {
    alignItems: "center",
    marginBottom: 18,
  },

  logo: {
    color: "#FFFFFF",
    fontSize: 38,
    fontWeight: "900",
    letterSpacing: 3,
  },

  subLogo: {
    marginTop: 5,
    color: "#00D2FF",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 2,
  },

  heroCard: {
    borderRadius: 30,
    padding: 18,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
    alignItems: "center",
    marginBottom: 16,
  },

  iconBadge: {
    width: 78,
    height: 78,
    borderRadius: 28,
    backgroundColor: "rgba(0,210,255,0.12)",
    borderWidth: 1,
    borderColor: "rgba(0,210,255,0.30)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 13,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "900",
    textAlign: "center",
  },

  subtitle: {
    marginTop: 8,
    color: "#D8D8F0",
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
    lineHeight: 20,
  },

  opponentBox: {
    marginTop: 15,
    minHeight: 46,
    maxWidth: "100%",
    borderRadius: 17,
    paddingHorizontal: 13,
    backgroundColor: "rgba(250,204,21,0.12)",
    borderWidth: 1,
    borderColor: "rgba(250,204,21,0.34)",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  opponentText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900",
    maxWidth: "86%",
  },

  levelArea: {
    flex: 1,
    justifyContent: "center",
  },

  levelButton: {
    minHeight: 100,
    borderRadius: 27,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
    marginBottom: 14,
    overflow: "hidden",
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
  },

  levelGlow: {
    position: "absolute",
    width: 140,
    height: 140,
    borderRadius: 70,
    right: -45,
    top: -40,
  },

  levelIconBox: {
    width: 64,
    height: 64,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },

  levelTextArea: {
    flex: 1,
  },

  levelTitle: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "900",
  },

  levelSub: {
    marginTop: 5,
    color: "#BFC0DD",
    fontSize: 14,
    fontWeight: "800",
  },

  backButton: {
    minHeight: 64,
    borderRadius: 23,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
  },

  backIconBox: {
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

  backText: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
  },

  backArrow: {
    color: "#00D2FF",
    fontSize: 31,
    fontWeight: "700",
  },
});