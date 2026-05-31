import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { auth, firestore } from "../../../firebaseConfig";
import { doc, getDoc, updateDoc, increment } from "firebase/firestore";

const getAvatarSource = (avatarName?: string) => {
  switch (avatarName) {
    case "avatar1.png": return require("../../../assets/avatars/avatar1.jpg");
    case "avatar2.png": return require("../../../assets/avatars/avatar2.jpg");
    case "avatar3.png": return require("../../../assets/avatars/avatar3.jpg");
    case "avatar4.png": return require("../../../assets/avatars/avatar4.jpg");
    case "avatar5.png": return require("../../../assets/avatars/avatar5.jpg");
    default: return require("../../../assets/avatars/avatar1.jpg");
  }
};

export default function FirstOnline() {
  const navigation = useNavigation<any>();

  const [coins, setCoins] = useState<number>(0);
  const [points, setPoints] = useState<number>(0);
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
    Alert.alert("Tebrikler!", "100 jeton kazandın.");
  };

  const giveJokerReward = async () => {
    const user = auth.currentUser;
    if (!user) return;

await updateDoc(doc(firestore, "users", user.uid), {
  "jokers.extraTurn": increment(1),
});
    Alert.alert("Tebrikler!", "1 joker kazandın.");
  };

  const leagues = [
    {
      name: "Çaylak",
      cost: 100,
      requiredPoints: 0,
      screen: "FirstCaylak",
      icon: "cards-playing-outline",
    },
    {
      name: "Kart Ustası",
      cost: 300,
      requiredPoints: 250,
      screen: "FirstUsta",
      icon: "cards",
    },
    {
      name: "Hafıza Avcısı",
      cost: 600,
      requiredPoints: 700,
      screen: "FirstHafiza",
      icon: "brain",
    },
    {
      name: "Zihin Dehası",
      cost: 1500,
      requiredPoints: 1500,
      screen: "ZihinDehasiOnline",
      icon: "trophy",
    },
    {
      name: "Efsane Lig",
      cost: 3000,
      requiredPoints: 3000,
      screen: "EfsaneOnline",
      icon: "crown",
    },
  ];

  return (
    <LinearGradient colors={["#1b1028", "#3b1f52", "#100914"]} style={styles.page}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => navigation.navigate("OnlineInfo")}>
            <Icon name="information" size={48} color="#d6d13f" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("ProfileScreen")}>
            {avatar ? (
              <Image source={avatar} style={styles.avatar} />
            ) : (
              <Icon name="account-circle" size={64} color="#fff" />
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("FeedBack")}>
            <Icon name="alert" size={48} color="#70c44b" />
          </TouchableOpacity>
        </View>

        <Text style={styles.coinText}>Jeton: {coins}</Text>
        <Text style={styles.pointText}>Puan: {points}</Text>

        <View style={styles.rewardRow}>
          <TouchableOpacity style={styles.rewardCard} onPress={giveJokerReward}>
            <Icon name="cards-playing" size={26} color="#000" />
            <View style={styles.rewardTextArea}>
              <Text style={styles.rewardTitle}>+1 Joker</Text>
              <Text style={styles.rewardSub}>Reklam izle</Text>
            </View>
            <Icon name="chevron-right" size={26} color="#000" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.rewardCard} onPress={giveCoinReward}>
            <Icon name="hand-coin" size={26} color="#000" />
            <View style={styles.rewardTextArea}>
              <Text style={styles.rewardTitle}>+100 Jeton</Text>
              <Text style={styles.rewardSub}>Reklam izle</Text>
            </View>
            <Icon name="chevron-right" size={26} color="#000" />
          </TouchableOpacity>
        </View>

        {leagues.map((league) => {
          const canEnter = coins >= league.cost && points >= league.requiredPoints;

          return (
            <TouchableOpacity
              key={league.name}
              disabled={!canEnter}
              onPress={() => navigation.navigate(league.screen)}
              style={[styles.leagueCard, !canEnter && styles.lockedCard]}
            >
              <LinearGradient colors={["#ffe36a", "#fff7d0"]} style={styles.leagueImage}>
                <Icon name={league.icon} size={72} color="#2b2030" />
              </LinearGradient>

              <Text style={styles.leagueName}>{league.name}</Text>

              <View style={styles.requirements}>
                <View style={styles.reqBox}>
                  <Text style={styles.reqText}>💰 {league.cost}</Text>
                </View>

                <View style={styles.reqBox}>
                  <Icon name="star-circle" size={18} color="#4aa3ff" />
                  <Text style={styles.reqText}>{league.requiredPoints}</Text>
                </View>
              </View>

              {!canEnter && (
                <Text style={styles.lockText}>Yetersiz jeton veya puan</Text>
              )}
            </TouchableOpacity>
          );
        })}

        <View style={{ height: 110 }} />
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.activeTab}>
          <Icon name="home" size={32} color="#2b2416" />
          <Text style={styles.activeTabText}>Anasayfa</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("LeaderboardScreen")}>
          <Icon name="crown" size={28} color="#d8c8a8" />
          <Text style={styles.tabText}>Sıralama</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("FriendsScreen")}>
          <Icon name="account-group" size={28} color="#d8c8a8" />
          <Text style={styles.tabText}>Arkadaşlarım</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("StoreScreen")}>
          <Icon name="wallet" size={28} color="#d8c8a8" />
          <Text style={styles.tabText}>Mağaza</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
  scroll: {
    alignItems: "center",
    paddingTop: 55,
    paddingHorizontal: 18,
  },
  topBar: {
    width: "92%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  avatar: {
    width: 66,
    height: 66,
    borderRadius: 33,
    borderWidth: 3,
    borderColor: "#fff",
  },
  coinText: {
    fontSize: 30,
    fontWeight: "900",
    color: "#ffd700",
    fontStyle: "italic",
  },
  pointText: {
    fontSize: 25,
    fontWeight: "900",
    color: "#fff",
    fontStyle: "italic",
    marginBottom: 22,
  },
  rewardRow: {
    width: "100%",
    flexDirection: "row",
    gap: 12,
    marginBottom: 28,
  },
  rewardCard: {
    flex: 1,
    minHeight: 76,
    borderRadius: 20,
    backgroundColor: "#ffd91a",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    elevation: 6,
  },
  rewardTextArea: {
    flex: 1,
    marginLeft: 8,
  },
  rewardTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: "#000",
  },
  rewardSub: {
    fontSize: 12,
    fontWeight: "700",
    color: "rgba(0,0,0,0.55)",
  },
  leagueCard: {
    width: 230,
    minHeight: 210,
    backgroundColor: "#f3f3f3",
    borderRadius: 18,
    overflow: "hidden",
    alignItems: "center",
    marginBottom: 28,
    elevation: 8,
  },
  lockedCard: {
    opacity: 0.55,
  },
  leagueImage: {
    width: "100%",
    height: 112,
    alignItems: "center",
    justifyContent: "center",
  },
  leagueName: {
    fontSize: 22,
    fontWeight: "900",
    color: "#232323",
    marginTop: 12,
  },
  requirements: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 12,
  },
  reqBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.12)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  reqText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#202020",
    marginLeft: 4,
  },
  lockText: {
    marginTop: 8,
    marginBottom: 8,
    color: "#a00",
    fontWeight: "800",
  },
  bottomBar: {
    position: "absolute",
    left: 18,
    right: 18,
    bottom: 22,
    height: 86,
    backgroundColor: "rgba(34,28,18,0.96)",
    borderRadius: 34,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 10,
  },
  activeTab: {
    width: 108,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#ffd247",
    alignItems: "center",
    justifyContent: "center",
  },
  activeTabText: {
    fontSize: 13,
    fontWeight: "900",
    color: "#2b2416",
  },
  tabText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#d8c8a8",
  },
});