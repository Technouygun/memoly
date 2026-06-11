import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  SafeAreaView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { auth, firestore } from "../../../firebaseConfig";
import { doc, getDoc, updateDoc, increment } from "firebase/firestore";
import { useLanguage } from "../../language/LanguageContext";

const getAvatarSource = (avatarName?: string) => {
  switch (avatarName) {
    case "avatar1.png":
    case "avatar1.jpg":
      return require("../../../assets/avatars/avatar1.jpg");
    case "avatar2.png":
    case "avatar2.jpg":
      return require("../../../assets/avatars/avatar2.jpg");
    case "avatar3.png":
    case "avatar3.jpg":
      return require("../../../assets/avatars/avatar3.jpg");
    case "avatar4.png":
    case "avatar4.jpg":
      return require("../../../assets/avatars/avatar4.jpg");
    case "avatar5.png":
    case "avatar5.jpg":
      return require("../../../assets/avatars/avatar5.jpg");
    default:
      return require("../../../assets/avatars/avatar1.jpg");
  }
};

export default function FirstOnline() {
  const navigation = useNavigation<any>();
  const { t } = useLanguage();

  const [coins, setCoins] = useState<number>(0);
  const [points, setPoints] = useState<number>(0);
  const [zihinFinalTicket, setZihinFinalTicket] = useState<number>(0);
  const [avatar, setAvatar] = useState<any>(null);

  useEffect(() => {
    const loadUser = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const userRef = doc(firestore, "users", user.uid);
      const snap = await getDoc(userRef);

      if (snap.exists()) {
        const data = snap.data();

        setCoins(data.coins ?? 300);
        setPoints(data.onlinePoints ?? 0);
        setZihinFinalTicket(data.zihinFinalTicket ?? 0);
        setAvatar(getAvatarSource(data.avatar));
      }
    };

    loadUser();
  }, []);

  const giveCoinReward = async () => {
    const user = auth.currentUser;
    if (!user) return;

    await updateDoc(doc(firestore, "users", user.uid), {
      coins: increment(100),
    });

    setCoins((prev) => prev + 100);
    Alert.alert(t.congrats, t.rewardCoinMessage);
  };

  const giveJokerReward = async () => {
    const user = auth.currentUser;
    if (!user) return;

    await updateDoc(doc(firestore, "users", user.uid), {
      "jokers.extraTurn": increment(1),
    });

    Alert.alert(t.congrats, t.rewardJokerMessage);
  };

  const leagues = [
    {
      name: t.rookie,
      cost: 100,
      requiredPoints: 0,
      screen: "FirstCaylak",
      icon: "cards-playing-outline",
      color: "#38BDF8",
    },
    {
      name: t.cardMaster,
      cost: 300,
      requiredPoints: 250,
      screen: "FirstUsta",
      icon: "cards",
      color: "#8E7CFF",
    },
    {
      name: t.memoryHunter,
      cost: 600,
      requiredPoints: 700,
      screen: "FirstHafiza",
      icon: "brain",
      color: "#22C55E",
    },
    {
      name: t.mindGenius,
      cost: 1500,
      requiredPoints: 1500,
      screen: "FirstZihin",
      icon: "trophy",
      color: "#FACC15",
    },
    {
      name: t.mindChampionship,
      cost: 1,
      requiredPoints: 3000,
      screen: "FirstZihinFinal",
      icon: "crown",
      color: "#FB923C",
      finalTicketRequired: true,
    },
  ];

  return (
    <LinearGradient colors={["#070712", "#101035", "#171753"]} style={styles.page}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.glowOne} />
        <View style={styles.glowTwo} />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
        >
          <View style={styles.topBar}>
            <TouchableOpacity
              style={styles.circleButton}
              onPress={() => navigation.navigate("OnlineInfo")}
              activeOpacity={0.85}
            >
              <Icon name="information-outline" size={25} color="#00D2FF" />
            </TouchableOpacity>

            <View style={styles.logoArea}>
              <Text style={styles.logo}>MEMOLY</Text>
              <Text style={styles.subLogo}>ONLINE ARENA</Text>
            </View>

            <TouchableOpacity
              style={styles.avatarButton}
              onPress={() => navigation.navigate("ProfileScreen")}
              activeOpacity={0.85}
            >
              {avatar ? (
                <Image source={avatar} style={styles.avatar} />
              ) : (
                <Icon name="account-circle" size={46} color="#FFFFFF" />
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.heroCard}>
            <Text style={styles.heroTitle}>Hafıza Arenasına Hazır mısın?</Text>
            <Text style={styles.heroDesc}>
              Lig seç, eşleşmeye gir, kartları bul ve ödülleri topla.
            </Text>

            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Icon name="hand-coin" size={24} color="#FACC15" />
                <Text style={styles.statLabel}>{t.coins}</Text>
                <Text style={styles.statValue}>{coins}</Text>
              </View>

              <View style={styles.statCard}>
                <Icon name="star-circle" size={24} color="#00D2FF" />
                <Text style={styles.statLabel}>{t.points}</Text>
                <Text style={styles.statValue}>{points}</Text>
              </View>

              <View style={styles.statCard}>
                <Icon name="ticket-confirmation" size={24} color="#FB923C" />
                <Text style={styles.statLabel}>{t.mindFinalTicket}</Text>
                <Text style={styles.statValue}>{zihinFinalTicket}</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={styles.offlineButton}
            onPress={() => navigation.navigate("OfflineModesScreen")}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={["#22C55E", "#16A34A", "#00D2FF"]}
              style={styles.offlineGradient}
            >
              <View style={styles.offlineIconBox}>
                <Icon name="controller-classic" size={24} color="#FFFFFF" />
              </View>

              <View style={styles.offlineTextArea}>
                <Text style={styles.offlineTitle}>Offline Oyna</Text>
                <Text style={styles.offlineSub}>İnternetsiz hafıza modu</Text>
              </View>

              <Text style={styles.offlineArrow}>›</Text>
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.quickRow}>
            <TouchableOpacity
              style={styles.quickCard}
              onPress={giveJokerReward}
              activeOpacity={0.88}
            >
              <View style={styles.quickIconBox}>
                <Icon name="cards-playing" size={24} color="#00D2FF" />
              </View>
              <Text style={styles.quickTitle}>{t.jokerReward}</Text>
              <Text style={styles.quickSub}>{t.watchAd}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickCard}
              onPress={giveCoinReward}
              activeOpacity={0.88}
            >
              <View style={styles.quickIconBox}>
                <Icon name="hand-coin" size={24} color="#FACC15" />
              </View>
              <Text style={styles.quickTitle}>{t.coinReward}</Text>
              <Text style={styles.quickSub}>{t.watchAd}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickCard}
              onPress={() => navigation.navigate("FeedBack")}
              activeOpacity={0.88}
            >
              <View style={styles.quickIconBox}>
                <Icon name="message-alert-outline" size={24} color="#FB923C" />
              </View>
              <Text style={styles.quickTitle}>Feedback</Text>
              <Text style={styles.quickSub}>Bildir</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Ligler</Text>
            <Text style={styles.sectionSub}>Seviyene uygun arenayı seç</Text>
          </View>

          {leagues.map((league) => {
            const canEnter = league.finalTicketRequired
              ? zihinFinalTicket >= league.cost && points >= league.requiredPoints
              : coins >= league.cost && points >= league.requiredPoints;

            return (
              <TouchableOpacity
                key={league.name}
                disabled={!canEnter}
                onPress={() => navigation.navigate(league.screen)}
                activeOpacity={0.9}
                style={[styles.leagueCard, !canEnter && styles.lockedCard]}
              >
                <View
                  style={[
                    styles.leagueGlow,
                    { backgroundColor: `${league.color}22` },
                  ]}
                />

                <View style={styles.leagueLeft}>
                  <LinearGradient
                    colors={[`${league.color}EE`, "#6C5CE7"]}
                    style={styles.leagueIconBox}
                  >
                    <Icon name={league.icon as any} size={35} color="#FFFFFF" />
                  </LinearGradient>

                  <View style={styles.leagueTextArea}>
                    <Text style={styles.leagueName}>{league.name}</Text>

                    <View style={styles.requirements}>
                      <View style={styles.reqBox}>
                        <Icon
                          name={
                            league.finalTicketRequired
                              ? "ticket-confirmation"
                              : "hand-coin"
                          }
                          size={16}
                          color={league.finalTicketRequired ? "#FB923C" : "#FACC15"}
                        />
                        <Text style={styles.reqText}>{league.cost}</Text>
                      </View>

                      <View style={styles.reqBox}>
                        <Icon name="star-circle" size={16} color="#00D2FF" />
                        <Text style={styles.reqText}>{league.requiredPoints}</Text>
                      </View>
                    </View>

                    {!canEnter && (
                      <Text style={styles.lockText}>
                        {league.finalTicketRequired
                          ? t.notEnoughTicketOrPoints
                          : t.notEnoughCoinOrPoints}
                      </Text>
                    )}
                  </View>
                </View>

                <View style={styles.leagueRight}>
                  {canEnter ? (
                    <Icon name="chevron-right" size={34} color={league.color} />
                  ) : (
                    <Icon name="lock-outline" size={27} color="#AFAFD1" />
                  )}
                </View>
              </TouchableOpacity>
            );
          })}

          <View style={{ height: 42 }} />
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },

  safe: {
    flex: 1,
  },

  scroll: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 20,
  },

  glowOne: {
    position: "absolute",
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: "rgba(108,92,231,0.34)",
    top: -100,
    right: -115,
  },

  glowTwo: {
    position: "absolute",
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: "rgba(0,210,255,0.18)",
    bottom: 110,
    left: -115,
  },

  topBar: {
    minHeight: 62,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },

  circleButton: {
    width: 46,
    height: 46,
    borderRadius: 17,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
    alignItems: "center",
    justifyContent: "center",
  },

  logoArea: {
    alignItems: "center",
  },

  logo: {
    color: "#FFFFFF",
    fontSize: 34,
    fontWeight: "900",
    letterSpacing: 3,
  },

  subLogo: {
    marginTop: 4,
    color: "#00D2FF",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 2,
  },

  avatarButton: {
    width: 50,
    height: 50,
    borderRadius: 19,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },

  avatar: {
    width: 48,
    height: 48,
    borderRadius: 18,
  },

  heroCard: {
    borderRadius: 30,
    padding: 18,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
    marginBottom: 14,
  },

  heroTitle: {
    color: "#FFFFFF",
    fontSize: 25,
    fontWeight: "900",
    textAlign: "center",
  },

  heroDesc: {
    marginTop: 8,
    marginBottom: 16,
    color: "#D8D8F0",
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 20,
    textAlign: "center",
  },

  statsGrid: {
    flexDirection: "row",
    gap: 9,
  },

  statCard: {
    flex: 1,
    minHeight: 84,
    borderRadius: 21,
    backgroundColor: "rgba(0,210,255,0.10)",
    borderWidth: 1,
    borderColor: "rgba(0,210,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 5,
  },

  statLabel: {
    marginTop: 5,
    color: "#AFAFD1",
    fontSize: 10,
    fontWeight: "900",
    textAlign: "center",
  },

  statValue: {
    marginTop: 2,
    color: "#FFFFFF",
    fontSize: 19,
    fontWeight: "900",
  },

  offlineButton: {
    width: "100%",
    borderRadius: 25,
    overflow: "hidden",
    marginBottom: 14,
    shadowColor: "#00D2FF",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.24,
    shadowRadius: 16,
    elevation: 8,
  },

  offlineGradient: {
    minHeight: 72,
    borderRadius: 25,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
  },

  offlineIconBox: {
    width: 48,
    height: 48,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
  },

  offlineTextArea: {
    flex: 1,
  },

  offlineTitle: {
    color: "#FFFFFF",
    fontSize: 19,
    fontWeight: "900",
  },

  offlineSub: {
    marginTop: 3,
    color: "rgba(255,255,255,0.82)",
    fontSize: 12,
    fontWeight: "800",
  },

  offlineArrow: {
    color: "#FFFFFF",
    fontSize: 34,
    fontWeight: "700",
  },

  quickRow: {
    flexDirection: "row",
    gap: 9,
    marginBottom: 18,
  },

  quickCard: {
    flex: 1,
    minHeight: 100,
    borderRadius: 23,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
  },

  quickIconBox: {
    width: 42,
    height: 42,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 7,
  },

  quickTitle: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "900",
    textAlign: "center",
  },

  quickSub: {
    marginTop: 3,
    color: "#AFAFD1",
    fontSize: 10,
    fontWeight: "800",
    textAlign: "center",
  },

  sectionHeader: {
    marginBottom: 12,
  },

  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 25,
    fontWeight: "900",
  },

  sectionSub: {
    marginTop: 3,
    color: "#BFC0DD",
    fontSize: 13,
    fontWeight: "700",
  },

  leagueCard: {
    minHeight: 116,
    borderRadius: 27,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
    marginBottom: 13,
    overflow: "hidden",
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
  },

  leagueGlow: {
    position: "absolute",
    width: 150,
    height: 150,
    borderRadius: 75,
    right: -55,
    top: -40,
  },

  lockedCard: {
    opacity: 0.48,
  },

  leagueLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },

  leagueIconBox: {
    width: 66,
    height: 66,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
  },

  leagueTextArea: {
    flex: 1,
  },

  leagueName: {
    color: "#FFFFFF",
    fontSize: 19,
    fontWeight: "900",
  },

  requirements: {
    flexDirection: "row",
    gap: 8,
    marginTop: 9,
  },

  reqBox: {
    minHeight: 30,
    borderRadius: 12,
    paddingHorizontal: 9,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.13)",
    flexDirection: "row",
    alignItems: "center",
  },

  reqText: {
    marginLeft: 4,
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "900",
  },

  lockText: {
    marginTop: 7,
    color: "#FCA5A5",
    fontSize: 11,
    fontWeight: "900",
  },

  leagueRight: {
    width: 34,
    alignItems: "center",
    justifyContent: "center",
  },
});