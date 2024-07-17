import { useEffect, useContext } from "react";

import { ScrollView, Text, View } from "react-native";

import { Link } from "expo-router";

import { StyleSheet, TouchableOpacity } from "react-native";

import { AppDispatch, RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import { getUserChats, deleteChat } from "@/store/chatSlice";

import UserContext from "@/context/user-context";

import { MessageSquareMore, Trash2 } from "lucide-react-native";

export default function Chats(){
  const dispatch: AppDispatch = useDispatch();
  const chats = useSelector((state: RootState) => state.chat.chats);
  const loading = useSelector((state: RootState) => state.chat.loading);

  const { user } = useContext(UserContext);

  const deleteChatHandler = (id: string) => {
    dispatch(deleteChat({ id }));
  };

  useEffect(() => {
    dispatch(getUserChats(user?.userId ?? ""));
  }, []);

  return (
    <View
      style={{
        justifyContent: loading ? "center" : "flex-start",
        alignItems: "center",
        ...styles.container,
      }}
    >
      {loading && <Text>Loading...</Text>}

      {chats?.length > 0 && !loading && (
        <ScrollView style={{ width: "100%" }}>
          <View>
            {chats.map((item, index) => (
                <View
                  key={item.chatId}
                  style={{
                    borderTopWidth: index === 0 ? 1 : 0,
                    ...styles.chatItem
                  }}
                >
                  <Link
                    href={{
                      pathname: `/chat/[id]`,
                      params: { id: item.chatId },
                    }}
                    style={styles.chatItemLink}
                  >
                    <View
                      style={{ flexDirection: "row", gap: 10 }}
                    >
                      <MessageSquareMore size={20} strokeWidth={2.4} color="gray" />
                      <Text style={{ fontWeight: "600" }}>
                        {item.name}
                      </Text>
                    </View>
                  </Link>

                  {item.userRole && (
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => deleteChatHandler(item.chatId)}
                    >
                      <Trash2 color="indianred" size={18} strokeWidth={2.2} />
                    </TouchableOpacity>
                  )}
                </View>
            ))}
          </View>
        </ScrollView>
      )}

      {!loading && chats.length == 0 && (
        <View style={styles.noChatsWrapper}>
          <Text style={styles.noChatsText}>No chats yet</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "whitesmoke",
  },
  chatItemLink: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    gap: 10,
    paddingVertical: 20,
  },
  chatItem: {
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderColor: "lightgray",
    paddingHorizontal: 10,
  },
  noChatsWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noChatsText: {
    textAlign: "center",
    marginVertical: 10,
  },
  deleteButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "whitesmoke",

  },
});
