import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Share,
  SafeAreaView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  onSnapshot,
  updateDoc,
  deleteDoc,
  setDoc,
} from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useLanguage } from "../../../language/LanguageContext";

const db = getFirestore();

export default function FirstFriend() {
  const user = getAuth().currentUser;
  const navigation = useNavigation<any>();
  const tabBarHeight = useBottomTabBarHeight();
  const { t, language } = useLanguage();

  const [myNickname, setMyNickname] = useState("");
  const [inputName, setInputName] = useState("");
  const [friends, setFriends] = useState<any[]>([]);
  const [incomingRequests, setIncomingRequests] = useState<any[]>([]);

  const inviteFriend = async () => {
    try {
      await Share.share({
        message:
          language === "tr"
            ? "🎮 Memoly’de hafıza savaşları başladı!\nGel birlikte oynayalım, ödülleri toplayalım! 🏆🔥\n\nŞimdi indir:\nhttps://www.memoly.games/link"
            : "🎮 Memory battles have started in Memoly!\nCome play together and collect rewards! 🏆🔥\n\nDownload now:\nhttps://www.memoly.games/link",
      });
    } catch (error) {
      console.log("Paylaşım hatası:", error);
    }
  };

  useEffect(() => {
    if (!user) return;

    getDoc(doc(db, "users", user.uid)).then((snap) => {
      if (snap.exists()) setMyNickname(snap.data().nickname);
    });
  }, []);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "friendRequests"),
      where("toUid", "==", user.uid),
      where("status", "==", "pending")
    );

    return onSnapshot(q, (snap) => {
      const arr: any[] = [];
      snap.forEach((d) => arr.push({ id: d.id, ...d.data() }));
      setIncomingRequests(arr);
    });
  }, []);

  useEffect(() => {
    if (!user) return;

    return onSnapshot(collection(db, "friends", user.uid, "list"), (snap) => {
      const arr: any[] = [];
      snap.forEach((d) => arr.push({ id: d.id, ...d.data() }));
      setFriends(arr);
    });
  }, []);

  const playWithFriend = () => {
    if (friends.length === 0) {
      Alert.alert(t.warning, t.friendRequired);
      return;
    }

    const friend = friends[0];

    navigation.navigate("FriendLig", {
      friendUid: friend.uid,
      friendNickname: friend.nickname,
    });
  };

  const sendFriendRequest = async () => {
    if (!inputName.trim()) return;

    const q = query(
      collection(db, "users"),
      where("nickname", "==", inputName.trim())
    );

    const res = await getDocs(q);

    if (res.empty) {
      Alert.alert(t.error, t.userNotFound);
      return;
    }

    const target = res.docs[0];

    if (target.id === user?.uid) {
      Alert.alert(t.error, t.cantAddYourself);
      return;
    }

    const friendRef = doc(db, "friends", user!.uid, "list", target.id);
    const friendSnap = await getDoc(friendRef);

    if (friendSnap.exists()) {
      Alert.alert(t.info, t.alreadyFriends);
      return;
    }

    const alreadySentQuery = query(
      collection(db, "friendRequests"),
      where("fromUid", "==", user?.uid),
      where("toUid", "==", target.id),
      where("status", "==", "pending")
    );

    const alreadySentSnap = await getDocs(alreadySentQuery);

    if (!alreadySentSnap.empty) {
      Alert.alert(t.info, t.requestAlreadySent);
      return;
    }

    await addDoc(collection(db, "friendRequests"), {
      fromUid: user?.uid,
      toUid: target.id,
      fromNickname: myNickname,
      toNickname: target.data().nickname,
      status: "pending",
      createdAt: Date.now(),
    });

    Alert.alert(t.requestSentTitle, t.requestSentMessage);
    setInputName("");
  };

  const acceptRequest = async (req: any) => {
    await setDoc(doc(db, "friends", user!.uid, "list", req.fromUid), {
      uid: req.fromUid,
      nickname: req.fromNickname,
      addedAt: Date.now(),
    });

    await setDoc(doc(db, "friends", req.fromUid, "list", user!.uid), {
      uid: user!.uid,
      nickname: myNickname,
      addedAt: Date.now(),
    });

    await deleteDoc(doc(db, "friendRequests", req.id));
  };

  const rejectRequest = async (reqId: string) => {
    await updateDoc(doc(db, "friendRequests", reqId), {
      status: "rejected",
    });
  };

  return (
    <LinearGradient colors={["#070712", "#101035", "#171753"]} style={styles.page}>
      <SafeAreaView style={styles.safe}>
                  <View style={{ height: 50}} />
        
        <View style={styles.glowOne} />
        <View style={styles.glowTwo} />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scroll,
            { paddingBottom: tabBarHeight + 34 },
          ]}
        >
          <View style={styles.header}>
            <Text style={styles.logo}>MEMOLY</Text>
            <Text style={styles.subLogo}>FRIEND ARENA</Text>
          </View>

          <View style={styles.heroCard}>
            <View style={styles.heroIconBox}>
              <Icon name="account-group" size={38} color="#00D2FF" />
            </View>

            <Text style={styles.welcome}>{t.welcome}</Text>
            <Text numberOfLines={1} style={styles.nickname}>
              {myNickname || "MEMOLY"}
            </Text>
            <Text style={styles.subtitle}>{t.friendSubtitle}</Text>

            <View style={styles.statsRow}>
              <View style={styles.statBox}>
                <Icon name="account-heart" size={24} color="#00D2FF" />
                <Text style={styles.statLabel}>{t.myFriends}</Text>
                <Text style={styles.statValue}>{friends.length}</Text>
              </View>

              <View style={styles.statBox}>
                <Icon name="bell-badge-outline" size={24} color="#FACC15" />
                <Text style={styles.statLabel}>İstek</Text>
                <Text style={styles.statValue}>{incomingRequests.length}</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={styles.playButton}
            onPress={playWithFriend}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={["#8E7CFF", "#6C5CE7", "#00D2FF"]}
              style={styles.playGradient}
            >
              <View style={styles.playIconBox}>
                <Icon name="sword-cross" size={25} color="#FFFFFF" />
              </View>

              <View style={styles.playTextArea}>
                <Text style={styles.playText}>{t.playWithFriend}</Text>
                <Text style={styles.playSub}>Arkadaşınla özel maç başlat</Text>
              </View>

              <Text style={styles.buttonArrow}>›</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.inviteButton}
            onPress={inviteFriend}
            activeOpacity={0.88}
          >
            <View style={styles.inviteIconBox}>
              <Icon name="share-variant" size={23} color="#00D2FF" />
            </View>

            <View style={styles.inviteTextArea}>
              <Text style={styles.inviteText}>{t.inviteFriend}</Text>
              <Text style={styles.inviteSub}>Memoly linkini paylaş</Text>
            </View>

            <Text style={styles.inviteArrow}>›</Text>
          </TouchableOpacity>

          {incomingRequests.length > 0 && (
            <View style={styles.card}>
              <View style={styles.cardHeaderRow}>
                <Text style={styles.cardTitle}>Arkadaşlık İstekleri</Text>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{incomingRequests.length}</Text>
                </View>
              </View>

              {incomingRequests.map((req) => (
                <View key={req.id} style={styles.requestRow}>
                  <View style={styles.userCircle}>
                    <Icon name="account" size={22} color="#FFFFFF" />
                  </View>

                  <View style={styles.requestInfo}>
                    <Text style={styles.friendName}>{req.fromNickname}</Text>
                    <Text style={styles.friendSub}>Seni arkadaş olarak eklemek istiyor</Text>
                  </View>

                  <TouchableOpacity
                    style={styles.acceptButton}
                    onPress={() => acceptRequest(req)}
                  >
                    <Icon name="check" size={20} color="#07111F" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.rejectButton}
                    onPress={() => rejectRequest(req.id)}
                  >
                    <Icon name="close" size={20} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          <View style={styles.card}>
            <Text style={styles.cardTitle}>{t.addFriend}</Text>
            <Text style={styles.cardDesc}>Kullanıcı adını yaz ve arkadaşlık isteği gönder.</Text>

            <View style={styles.inputBox}>
              <Icon name="account-search" size={22} color="#00D2FF" />
              <TextInput
                placeholder={t.enterUsername}
                placeholderTextColor="rgba(255,255,255,0.42)"
                value={inputName}
                onChangeText={setInputName}
                style={styles.input}
              />
            </View>

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={sendFriendRequest}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={["#8E7CFF", "#6C5CE7", "#00D2FF"]}
                style={styles.primaryGradient}
              >
                <Icon name="account-plus" size={22} color="#FFFFFF" />
                <Text style={styles.primaryText}>{t.sendRequest}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <Text style={styles.cardTitle}>{t.myFriends}</Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{friends.length}</Text>
              </View>
            </View>

            {friends.length === 0 ? (
              <View style={styles.emptyBox}>
                <Icon name="account-off-outline" size={34} color="#AFAFD1" />
                <Text style={styles.emptyText}>{t.noFriendsYet}</Text>
              </View>
            ) : (
              friends.map((item) => (
                <View key={item.id} style={styles.friendRow}>
                  <View style={styles.userCircle}>
                    <Icon name="account" size={22} color="#FFFFFF" />
                  </View>

                  <View style={styles.friendInfo}>
                    <Text numberOfLines={1} style={styles.friendName}>
                      {item.nickname}
                    </Text>
                    <Text style={styles.friendSub}>{t.friend}</Text>
                  </View>

                  <Icon name="chevron-right" size={28} color="#00D2FF" />
                </View>
              ))
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1 },
  safe: { flex: 1 },

  scroll: {
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

  heroCard: {
    borderRadius: 30,
    padding: 18,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
    alignItems: "center",
    marginBottom: 14,
  },

  heroIconBox: {
    width: 74,
    height: 74,
    borderRadius: 26,
    backgroundColor: "rgba(0,210,255,0.12)",
    borderWidth: 1,
    borderColor: "rgba(0,210,255,0.30)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },

  welcome: {
    color: "#AFAFD1",
    fontSize: 13,
    fontWeight: "900",
  },

  nickname: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "900",
    marginTop: 3,
    maxWidth: "100%",
  },

  subtitle: {
    marginTop: 7,
    color: "#D8D8F0",
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
    lineHeight: 20,
  },

  statsRow: {
    width: "100%",
    flexDirection: "row",
    gap: 10,
    marginTop: 16,
  },

  statBox: {
    flex: 1,
    height: 78,
    borderRadius: 21,
    backgroundColor: "rgba(0,210,255,0.10)",
    borderWidth: 1,
    borderColor: "rgba(0,210,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
  },

  statLabel: {
    marginTop: 4,
    color: "#AFAFD1",
    fontSize: 10,
    fontWeight: "900",
    textAlign: "center",
  },

  statValue: {
    marginTop: 1,
    color: "#FFFFFF",
    fontSize: 19,
    fontWeight: "900",
  },

  playButton: {
    width: "100%",
    borderRadius: 25,
    overflow: "hidden",
    marginBottom: 13,
    shadowColor: "#00D2FF",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.24,
    shadowRadius: 16,
    elevation: 8,
  },

  playGradient: {
    minHeight: 72,
    borderRadius: 25,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
  },

  playIconBox: {
    width: 48,
    height: 48,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
  },

  playTextArea: { flex: 1 },

  playText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
  },

  playSub: {
    marginTop: 3,
    color: "rgba(255,255,255,0.82)",
    fontSize: 12,
    fontWeight: "800",
  },

  buttonArrow: {
    color: "#FFFFFF",
    fontSize: 34,
    fontWeight: "700",
  },

  inviteButton: {
    minHeight: 68,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    marginBottom: 14,
  },

  inviteIconBox: {
    width: 46,
    height: 46,
    borderRadius: 17,
    backgroundColor: "rgba(0,210,255,0.12)",
    borderWidth: 1,
    borderColor: "rgba(0,210,255,0.28)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  inviteTextArea: { flex: 1 },

  inviteText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
  },

  inviteSub: {
    marginTop: 3,
    color: "#AFAFD1",
    fontSize: 12,
    fontWeight: "800",
  },

  inviteArrow: {
    color: "#00D2FF",
    fontSize: 31,
    fontWeight: "700",
  },

  card: {
    borderRadius: 28,
    padding: 15,
    marginBottom: 14,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
  },

  cardHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 13,
  },

  cardTitle: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 19,
    fontWeight: "900",
  },

  cardDesc: {
    color: "#BFC0DD",
    fontSize: 13,
    fontWeight: "700",
    marginTop: -6,
    marginBottom: 12,
  },

  badge: {
    minWidth: 30,
    height: 28,
    borderRadius: 999,
    paddingHorizontal: 9,
    backgroundColor: "rgba(0,210,255,0.13)",
    borderWidth: 1,
    borderColor: "rgba(0,210,255,0.35)",
    alignItems: "center",
    justifyContent: "center",
  },

  badgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "900",
  },

  inputBox: {
    height: 54,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.07)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 13,
    marginBottom: 12,
  },

  input: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
    marginLeft: 9,
  },

  primaryButton: {
    borderRadius: 21,
    overflow: "hidden",
  },

  primaryGradient: {
    minHeight: 56,
    borderRadius: 21,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  primaryText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
  },

  requestRow: {
    minHeight: 70,
    borderRadius: 21,
    backgroundColor: "rgba(255,255,255,0.07)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.13)",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    marginBottom: 9,
  },

  friendRow: {
    minHeight: 66,
    borderRadius: 21,
    backgroundColor: "rgba(255,255,255,0.07)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.13)",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    marginBottom: 9,
  },

  userCircle: {
    width: 42,
    height: 42,
    borderRadius: 16,
    backgroundColor: "rgba(0,210,255,0.14)",
    borderWidth: 1,
    borderColor: "rgba(0,210,255,0.30)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },

  requestInfo: { flex: 1 },
  friendInfo: { flex: 1 },

  friendName: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900",
  },

  friendSub: {
    marginTop: 2,
    color: "#AFAFD1",
    fontSize: 11,
    fontWeight: "800",
  },

  acceptButton: {
    width: 36,
    height: 36,
    borderRadius: 14,
    backgroundColor: "#86EFAC",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 6,
  },

  rejectButton: {
    width: 36,
    height: 36,
    borderRadius: 14,
    backgroundColor: "rgba(239,68,68,0.75)",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 6,
  },

  emptyBox: {
    minHeight: 92,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
    padding: 14,
  },

  emptyText: {
    color: "#BFC0DD",
    fontSize: 14,
    fontWeight: "800",
    marginTop: 7,
    textAlign: "center",
  },
});