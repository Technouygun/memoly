import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  AppState,
} from "react-native";
import { getAuth } from "firebase/auth";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import {
  ref,
  get,
  set,
  update,
  onValue,
  remove,
  onDisconnect,
} from "firebase/database";
import { collection, onSnapshot } from "firebase/firestore";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { db, firestore } from "../../../../../firebaseConfig";
import { useLanguage } from "../../../../language/LanguageContext";

type MatchData = {
  status: "invited" | "accepted" | "started";
  ownerUid: string;
  invitedUid: string;
  players: Record<string, { ready: boolean }>;
  settings?: {
    turnTime: number;
  };
};

const TIME_OPTIONS = [
  { label: "7 SN", value: 7 },
  { label: "14 SN", value: 14 },
  { label: "SINIRSIZ", value: 0 },
];

export default function FirstOrtaFriend() {
  const user = getAuth().currentUser!;
  const navigation = useNavigation<any>();
  const { t } = useLanguage();

  const [friends, setFriends] = useState<any[]>([]);
  const [matchId, setMatchId] = useState<string | null>(null);
  const [match, setMatch] = useState<MatchData | null>(null);
  const [selectedTurnTime, setSelectedTurnTime] = useState(7);

  const cleanedRef = useRef(false);

  const cleanupMatch = async () => {
    if (!matchId || cleanedRef.current) return;
    cleanedRef.current = true;

    try {
      const matchRef = ref(db, `friendMatchmaking/orta/${matchId}`);
      await onDisconnect(matchRef).cancel();
      await remove(matchRef);
    } catch {}
  };

  const buildMatchId = (uid1: string, uid2: string) => {
    const [a, b] = [uid1, uid2].sort();
    return `orta_friend_${a}_${b}`;
  };

  useEffect(() => {
    if (!matchId) return;
    const matchRef = ref(db, `friendMatchmaking/orta/${matchId}`);
    onDisconnect(matchRef).remove();
  }, [matchId]);

  useEffect(() => {
    if (matchId) cleanedRef.current = false;
  }, [matchId]);

  useFocusEffect(
    useCallback(() => {
      return () => {
        cleanupMatch();
      };
    }, [matchId])
  );

  useEffect(() => {
    const unsub = navigation.addListener("beforeRemove", () => {
      cleanupMatch();
    });

    return unsub;
  }, [navigation, matchId]);

  useEffect(() => {
    const sub = AppState.addEventListener("change", (state) => {
      if (state !== "active") cleanupMatch();
    });

    return () => sub.remove();
  }, [matchId]);

  useEffect(() => {
    if (!user) return;

    return onSnapshot(collection(firestore, "friends", user.uid, "list"), (snap) => {
      const arr: any[] = [];
      snap.forEach((d) => arr.push({ id: d.id, ...d.data() }));
      setFriends(arr);
    });
  }, []);

  useEffect(() => {
    const matchesRef = ref(db, "friendMatchmaking/orta");

    return onValue(matchesRef, (snap) => {
      if (!snap.exists()) return;

      const all = snap.val();

      for (const key in all) {
        const m = all[key];

        if (m.status === "invited" && m.invitedUid === user.uid) {
          setMatchId(key);
          setMatch(m);
          return;
        }
      }
    });
  }, []);

  useEffect(() => {
    if (!matchId) return;

    const matchRef = ref(db, `friendMatchmaking/orta/${matchId}`);

    return onValue(matchRef, async (snap) => {
      const data = snap.val();

      if (!data) {
        setMatch(null);
        return;
      }

      setMatch(data);

      const players = data.players || {};
      const allReady =
        Object.keys(players).length === 2 &&
        Object.values(players).every((p: any) => p.ready);

      if (data.status === "accepted" && allReady) {
        const player2 = Object.keys(data.players).find(
          (uid) => uid !== data.ownerUid
        );

        await set(ref(db, `ortaFriendRooms/${matchId}`), {
          boardSize: "4x5",
          players: {
            player1: data.ownerUid,
            player2,
          },
          game: {
            status: "playing",
            currentTurn: "player1",
            openedCards: [],
            matchedCards: [],
            moves: 0,
            player1Finished: false,
            player2Finished: false,
          },
          scores: {
            player1: 0,
            player2: 0,
          },
          settings: {
            turnTime: data.settings?.turnTime ?? 7,
            player1Color: "#3B82F6",
            player2Color: "#EF4444",
          },
          createdAt: Date.now(),
        });

        await remove(ref(db, `friendMatchmaking/orta/${matchId}`));

        navigation.replace("OrtaFriendGame", {
          roomId: matchId,
          boardSize: "4x5",
        });
      }
    });
  }, [matchId]);

  const handleInvite = async (friendUid: string) => {
    const id = buildMatchId(user.uid, friendUid);
    const matchRef = ref(db, `friendMatchmaking/orta/${id}`);

    const snap = await get(matchRef);

    if (snap.exists()) {
      Alert.alert(t.info, t.matchAlreadyExists);
      return;
    }

    await set(matchRef, {
      status: "invited",
      ownerUid: user.uid,
      invitedUid: friendUid,
      players: {
        [user.uid]: { ready: false },
        [friendUid]: { ready: false },
      },
      boardSize: "4x5",
      settings: {
        turnTime: selectedTurnTime,
      },
      createdAt: Date.now(),
    });

    setMatchId(id);
  };

  const acceptInvite = async () => {
    if (!matchId) return;

    await update(ref(db, `friendMatchmaking/orta/${matchId}`), {
      status: "accepted",
    });
  };

  const rejectInvite = async () => {
    if (!matchId) return;

    await remove(ref(db, `friendMatchmaking/orta/${matchId}`));
    setMatch(null);
    setMatchId(null);
  };

  const handleReady = async () => {
    if (!matchId) return;

    await update(
      ref(db, `friendMatchmaking/orta/${matchId}/players/${user.uid}`),
      { ready: true }
    );
  };

  const renderAction = (friendUid: string) => {
    const id = buildMatchId(user.uid, friendUid);

    if (!match || matchId !== id) {
      return (
        <TouchableOpacity
          style={styles.matchBtn}
          onPress={() => handleInvite(friendUid)}
        >
          <Icon name="sword-cross" size={18} color="#FFFFFF" />
          <Text style={styles.btnTextWhite}>{t.match}</Text>
        </TouchableOpacity>
      );
    }

    if (match.status === "invited" && match.invitedUid === user.uid) {
      return (
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.acceptBtn} onPress={acceptInvite}>
            <Icon name="check" size={19} color="#07111F" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.rejectBtn} onPress={rejectInvite}>
            <Icon name="close" size={19} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      );
    }

    if (match.status === "accepted") {
      return (
        <TouchableOpacity style={styles.playBtn} onPress={handleReady}>
          <Icon name="play" size={18} color="#FFFFFF" />
          <Text style={styles.btnTextWhite}>{t.play}</Text>
        </TouchableOpacity>
      );
    }

    return <Text style={styles.waitingText}>{t.waiting}</Text>;
  };

  return (
    <LinearGradient colors={["#070712", "#101035", "#171753"]} style={styles.page}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.glowOne} />
        <View style={styles.glowTwo} />

        <View style={styles.header}>
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.backButton}
            onPress={async () => {
              await cleanupMatch();
              navigation.navigate("OnlineTabs", {
  screen: "FirstFriend",
});
            }}
          >
            <Icon name="arrow-left" size={22} color="#00D2FF" />
          </TouchableOpacity>

          <Text style={styles.logo}>MEMOLY</Text>
          <Text style={styles.subLogo}>MEDIUM FRIEND BATTLE</Text>
        </View>

        <View style={styles.heroCard}>
          <View style={styles.iconBadge}>
            <Icon name="cards-playing-outline" size={38} color="#22C55E" />
          </View>

          <Text style={styles.title}>{t.mediumFriendGame}</Text>
          <Text style={styles.subtitle}>{t.mediumFriendSubtitle}</Text>

          <View style={styles.infoRow}>
            <View style={styles.infoBox}>
              <Icon name="grid" size={22} color="#00D2FF" />
              <Text style={styles.infoLabel}>Tahta</Text>
              <Text style={styles.infoValue}>4x5</Text>
            </View>

            <View style={styles.infoBox}>
              <Icon name="account-group" size={22} color="#FACC15" />
              <Text style={styles.infoLabel}>Arkadaş</Text>
              <Text style={styles.infoValue}>{friends.length}</Text>
            </View>
          </View>
        </View>

        <View style={styles.timeSelectBox}>
          <Text style={styles.timeSelectTitle}>El Başı Süre</Text>
          <View style={styles.timeOptionsRow}>
            {TIME_OPTIONS.map((option) => {
              const active = selectedTurnTime === option.value;

              return (
                <TouchableOpacity
                  key={option.value}
                  activeOpacity={0.85}
                  style={[styles.timeOption, active && styles.timeOptionActive]}
                  onPress={() => setSelectedTurnTime(option.value)}
                >
                  <Text style={[styles.timeOptionText, active && styles.timeOptionTextActive]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          <Text style={styles.colorInfo}>Kurucu mavi, davet edilen kırmızı oynar.</Text>
        </View>

        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>Arkadaş Seç</Text>
          <Text style={styles.listSub}>Davet gönder, kabul edilince oyuna başla.</Text>
        </View>

        <FlatList
          data={friends}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <Icon name="account-off-outline" size={38} color="#AFAFD1" />
              <Text style={styles.emptyText}>{t.noFriendsYet}</Text>
            </View>
          }
          renderItem={({ item }) => (
            <View style={styles.friendCard}>
              <View style={styles.userIcon}>
                <Icon name="account" size={23} color="#FFFFFF" />
              </View>

              <View style={styles.nameArea}>
                <Text numberOfLines={1} style={styles.name}>
                  {item.nickname}
                </Text>
                <Text style={styles.nameSub}>Hazır olduğunda eşleşme başlat</Text>
              </View>

              {renderAction(item.uid)}
            </View>
          )}
        />
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1 },
  safe: { flex: 1, paddingHorizontal: 20, paddingTop: 18 },

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

  backButton: {
    position: "absolute",
    left: 0,
    top: 2,
    width: 42,
    height: 42,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
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
    marginBottom: 16,
  },

  iconBadge: {
    width: 76,
    height: 76,
    borderRadius: 27,
    backgroundColor: "rgba(34,197,94,0.13)",
    borderWidth: 1,
    borderColor: "rgba(34,197,94,0.34)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 13,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 27,
    fontWeight: "900",
    textAlign: "center",
  },

  subtitle: {
    color: "#D8D8F0",
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
    lineHeight: 20,
    marginTop: 8,
  },

  infoRow: {
    width: "100%",
    flexDirection: "row",
    gap: 10,
    marginTop: 16,
  },

  infoBox: {
    flex: 1,
    height: 76,
    borderRadius: 21,
    backgroundColor: "rgba(0,210,255,0.10)",
    borderWidth: 1,
    borderColor: "rgba(0,210,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
  },

  infoLabel: {
    marginTop: 4,
    color: "#AFAFD1",
    fontSize: 10,
    fontWeight: "900",
  },

  infoValue: {
    marginTop: 1,
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
  },


  timeSelectBox: {
    borderRadius: 24,
    padding: 13,
    marginBottom: 14,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
  },

  timeSelectTitle: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900",
    marginBottom: 10,
    textAlign: "center",
  },

  timeOptionsRow: {
    flexDirection: "row",
    gap: 8,
  },

  timeOption: {
    flex: 1,
    height: 40,
    borderRadius: 15,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
    alignItems: "center",
    justifyContent: "center",
  },

  timeOptionActive: {
    backgroundColor: "rgba(0,210,255,0.18)",
    borderColor: "#00D2FF",
  },

  timeOptionText: {
    color: "#BFC0DD",
    fontSize: 11,
    fontWeight: "900",
  },

  timeOptionTextActive: {
    color: "#FFFFFF",
  },

  colorInfo: {
    color: "#BFC0DD",
    fontSize: 11,
    fontWeight: "800",
    marginTop: 9,
    textAlign: "center",
  },

  listHeader: {
    marginBottom: 10,
  },

  listTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "900",
  },

  listSub: {
    marginTop: 3,
    color: "#BFC0DD",
    fontSize: 13,
    fontWeight: "700",
  },

  listContent: {
    paddingBottom: 36,
  },

  friendCard: {
    minHeight: 76,
    borderRadius: 24,
    paddingHorizontal: 13,
    marginBottom: 11,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
    flexDirection: "row",
    alignItems: "center",
  },

  userIcon: {
    width: 46,
    height: 46,
    borderRadius: 17,
    backgroundColor: "rgba(0,210,255,0.13)",
    borderWidth: 1,
    borderColor: "rgba(0,210,255,0.30)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  nameArea: {
    flex: 1,
    marginRight: 8,
  },

  name: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
  },

  nameSub: {
    color: "#AFAFD1",
    fontSize: 11,
    fontWeight: "700",
    marginTop: 2,
  },

  matchBtn: {
    minHeight: 40,
    borderRadius: 15,
    paddingHorizontal: 12,
    backgroundColor: "rgba(0,210,255,0.20)",
    borderWidth: 1,
    borderColor: "rgba(0,210,255,0.42)",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },

  playBtn: {
    minHeight: 40,
    borderRadius: 15,
    paddingHorizontal: 12,
    backgroundColor: "rgba(34,197,94,0.26)",
    borderWidth: 1,
    borderColor: "rgba(34,197,94,0.48)",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },

  actionRow: {
    flexDirection: "row",
    gap: 7,
  },

  acceptBtn: {
    width: 38,
    height: 38,
    borderRadius: 14,
    backgroundColor: "#86EFAC",
    alignItems: "center",
    justifyContent: "center",
  },

  rejectBtn: {
    width: 38,
    height: 38,
    borderRadius: 14,
    backgroundColor: "rgba(239,68,68,0.82)",
    alignItems: "center",
    justifyContent: "center",
  },

  btnTextWhite: {
    color: "#FFFFFF",
    fontWeight: "900",
    fontSize: 13,
  },

  waitingText: {
    color: "#AFAFD1",
    fontSize: 12,
    fontWeight: "900",
  },

  emptyBox: {
    minHeight: 150,
    borderRadius: 26,
    backgroundColor: "rgba(255,255,255,0.07)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
    alignItems: "center",
    justifyContent: "center",
    padding: 18,
    marginTop: 18,
  },

  emptyText: {
    color: "#BFC0DD",
    fontSize: 15,
    fontWeight: "800",
    textAlign: "center",
    marginTop: 8,
  },
});