import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { firestore, auth } from "../../../firebaseConfig";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { LinearGradient } from "expo-linear-gradient";
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

export default function OnlineList() {
  const navigation = useNavigation<any>();
  const tabBarHeight = useBottomTabBarHeight();
  const { t } = useLanguage();

  const [timeLeft, setTimeLeft] = useState("");
  const [list, setList] = useState<any[]>([]);
  const [myRank, setMyRank] = useState<number | null>(null);
  const [myData, setMyData] = useState<any>(null);

  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
        const q = query(
          collection(firestore, "users"),
          orderBy("onlinePoints", "desc"),
          limit(100)
        );

        const snap = await getDocs(q);
        const listData: any[] = [];
        const currentUid = auth.currentUser?.uid;

        let rankCounter = 1;

        snap.forEach((docSnap) => {
          const data = docSnap.data();

          const item = {
            uid: docSnap.id,
            nickname: data.nickname || t.player,
            avatar: data.avatar || "avatar1.jpg",
            points: data.onlinePoints ?? 0,
            rank: rankCounter,
          };

          if (docSnap.id === currentUid) {
            setMyRank(rankCounter);
            setMyData(item);
          }

          listData.push(item);
          rankCounter++;
        });

        setList(listData);
      } catch (err) {
        console.log("Sıralama yüklenemedi:", err);
      }
    };

    loadLeaderboard();
  }, []);

  useEffect(() => {
    const seasonEnd = new Date("2026-08-31T23:59:59");

    const interval = setInterval(() => {
      const now = new Date();
      const diff = seasonEnd.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft(t.seasonFinished);
        clearInterval(interval);
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);

      setTimeLeft(`${days}${t.daysShort} ${hours}${t.hoursShort} ${minutes}${t.minutesShort}`);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const getRankIcon = (rank: number) => {
    if (rank === 1) return "crown";
    if (rank === 2) return "medal";
    if (rank === 3) return "medal-outline";
    return "numeric";
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return "#FACC15";
    if (rank === 2) return "#CBD5E1";
    if (rank === 3) return "#FB923C";
    return "#00D2FF";
  };

  const renderItem = ({ item }: any) => {
    const rankColor = getRankColor(item.rank);

    return (
      
      <View style={[styles.row, item.uid === auth.currentUser?.uid && styles.myRow]}>
        <View style={[styles.rankBadge, { borderColor: rankColor }]}>
          {item.rank <= 3 ? (
            <Icon name={getRankIcon(item.rank)} size={18} color={rankColor} />
          ) : (
            <Text style={styles.rankText}>{item.rank}</Text>
          )}
        </View>

        <Image source={getAvatarSource(item.avatar)} style={styles.avatar} />

        <View style={styles.userInfo}>
          <Text numberOfLines={1} style={styles.name}>
            {item.nickname}
          </Text>
          <Text style={styles.rankSub}>#{item.rank}</Text>
        </View>

        <View style={styles.pointBox}>
          <Icon name="star-circle" size={17} color="#00D2FF" />
          <Text style={styles.points}>{item.points}</Text>
        </View>
      </View>
    );
  };

  const HeaderComponent = () => (
    <>
      <View style={styles.header}>
        <Text style={styles.logo}>MEMOLY</Text>
        <Text style={styles.subLogo}>LEADERBOARD</Text>
      </View>

      <View style={styles.seasonBox}>
        <View style={styles.seasonIconBox}>
          <Icon name="trophy-award" size={38} color="#FACC15" />
        </View>

        <Text style={styles.seasonTitle}>{t.seasonTitle}</Text>
        <Text style={styles.seasonSubtitle}>{t.seasonEndsIn}</Text>

        <View style={styles.timerPill}>
          <Icon name="timer-outline" size={18} color="#00D2FF" />
          <Text style={styles.seasonTimer}>{timeLeft}</Text>
        </View>
      </View>

      {myData && (
        <View style={styles.myBox}>
          <View style={styles.myTopLine}>
            <Text style={styles.myRank}>{t.yourRank}: #{myRank}</Text>
            <View style={styles.myBadge}>
              <Icon name="account-star" size={16} color="#00D2FF" />
              <Text style={styles.myBadgeText}>SEN</Text>
            </View>
          </View>

          <View style={styles.myInfo}>
            <Image source={getAvatarSource(myData.avatar)} style={styles.myAvatar} />

            <View style={styles.myTextArea}>
              <Text numberOfLines={1} style={styles.myName}>
                {myData.nickname}
              </Text>
              <Text style={styles.myPoints}>
                {t.points}: {myData.points}
              </Text>
            </View>
          </View>
        </View>
      )}

      <View style={styles.listTitleRow}>
        <Text style={styles.title}>{t.top100}</Text>
        <View style={styles.listTitleBadge}>
          <Icon name="podium-gold" size={17} color="#FACC15" />
          <Text style={styles.listTitleBadgeText}>TOP</Text>
        </View>
      </View>
    </>
  );

  return (
    <LinearGradient colors={["#070712", "#101035", "#171753"]} style={styles.page}>
      <SafeAreaView style={styles.safe}>
                  <View style={{ height: 50}} />
        
        <View style={styles.glowOne} />
        <View style={styles.glowTwo} />

        <FlatList
          data={list}
          keyExtractor={(item) => item.uid}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={HeaderComponent}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: tabBarHeight + 34 },
          ]}
        />
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

  listContent: {
    paddingHorizontal: 20,
    paddingTop: 18,
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

  header: {
    alignItems: "center",
    marginBottom: 16,
  },

  logo: {
    color: "#FFFFFF",
    fontSize: 36,
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

  seasonBox: {
    borderRadius: 30,
    padding: 18,
    marginBottom: 14,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
    alignItems: "center",
  },

  seasonIconBox: {
    width: 72,
    height: 72,
    borderRadius: 25,
    backgroundColor: "rgba(250,204,21,0.13)",
    borderWidth: 1,
    borderColor: "rgba(250,204,21,0.34)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },

  seasonTitle: {
    color: "#FFFFFF",
    fontSize: 23,
    fontWeight: "900",
    textAlign: "center",
  },

  seasonSubtitle: {
    marginTop: 6,
    color: "#BFC0DD",
    fontSize: 13,
    fontWeight: "800",
  },

  timerPill: {
    marginTop: 13,
    minHeight: 42,
    borderRadius: 999,
    paddingHorizontal: 16,
    backgroundColor: "rgba(0,210,255,0.12)",
    borderWidth: 1,
    borderColor: "rgba(0,210,255,0.32)",
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },

  seasonTimer: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
  },

  rewardMainButton: {
    width: "100%",
    borderRadius: 24,
    overflow: "hidden",
    marginBottom: 14,
    shadowColor: "#00D2FF",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.24,
    shadowRadius: 16,
    elevation: 8,
  },

  gradientButton: {
    minHeight: 60,
    borderRadius: 24,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
  },

  buttonText: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "900",
    marginLeft: 9,
  },

  buttonArrow: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "700",
  },

  myBox: {
    borderRadius: 27,
    padding: 15,
    marginBottom: 16,
    backgroundColor: "rgba(0,210,255,0.10)",
    borderWidth: 1,
    borderColor: "rgba(0,210,255,0.32)",
  },

  myTopLine: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  myRank: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "900",
  },

  myBadge: {
    height: 28,
    borderRadius: 999,
    paddingHorizontal: 10,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  myBadgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "900",
  },

  myInfo: {
    flexDirection: "row",
    alignItems: "center",
  },

  myAvatar: {
    width: 62,
    height: 62,
    borderRadius: 22,
    marginRight: 13,
    borderWidth: 2,
    borderColor: "#00D2FF",
  },

  myTextArea: {
    flex: 1,
  },

  myName: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "900",
  },

  myPoints: {
    marginTop: 4,
    color: "#BFC0DD",
    fontSize: 14,
    fontWeight: "800",
  },

  listTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 11,
  },

  title: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 25,
    fontWeight: "900",
  },

  listTitleBadge: {
    height: 30,
    borderRadius: 999,
    paddingHorizontal: 11,
    backgroundColor: "rgba(250,204,21,0.12)",
    borderWidth: 1,
    borderColor: "rgba(250,204,21,0.30)",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  listTitleBadgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "900",
  },

  row: {
    minHeight: 72,
    borderRadius: 22,
    marginBottom: 10,
    paddingHorizontal: 12,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
    flexDirection: "row",
    alignItems: "center",
  },

  myRow: {
    backgroundColor: "rgba(0,210,255,0.13)",
    borderColor: "rgba(0,210,255,0.36)",
  },

  rankBadge: {
    width: 40,
    height: 40,
    borderRadius: 15,
    borderWidth: 1.3,
    backgroundColor: "rgba(255,255,255,0.06)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  rankText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "900",
  },

  avatar: {
    width: 46,
    height: 46,
    borderRadius: 17,
    marginRight: 11,
  },

  userInfo: {
    flex: 1,
  },

  name: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
  },

  rankSub: {
    marginTop: 2,
    color: "#AFAFD1",
    fontSize: 11,
    fontWeight: "800",
  },

  pointBox: {
    minWidth: 72,
    minHeight: 36,
    borderRadius: 14,
    paddingHorizontal: 8,
    backgroundColor: "rgba(0,210,255,0.10)",
    borderWidth: 1,
    borderColor: "rgba(0,210,255,0.25)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },

  points: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
  },
});