import { useContext } from "react";

import { View, Text, StyleSheet } from "react-native";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { addChatActivity } from "@/store/chatSlice";

import UserContext from "@/context/user-context";

import { Link } from "expo-router";

import { MessageSquareMore } from "lucide-react-native";

export default function SearchingChats() {
  const searchingChats = useSelector((state: RootState) => state.chat.searchingChats);
  const loading = useSelector((state: RootState) => state.chat.loading);
  const dispatch: AppDispatch = useDispatch();

  const { user } = useContext(UserContext);

  const addNewChatHandler = (chatId: string) => {
    dispatch(addChatActivity({ chatId: chatId, userId: user?.userId ?? "", userRole: false }));
  };

  return (
    <View style={{
        justifyContent: loading ? "center" : "flex-start",
        alignItems: "center",
        ...styles.container,
      }}
    >
      {loading && <Text>Loading...</Text>}
      {!loading && searchingChats?.length > 0 &&
        searchingChats.map((item, index) => (
          <Link
            key={item.id}
            href={{
              pathname: `/chat/[id]`,
              params: { id: item.id },
            }}
            onPress={() => addNewChatHandler(item.id)}
            style={{
              borderTopWidth: index === 0 ? 1 : 0,
              ...styles.chatItemLink,
            }}
          >
            <View style={styles.chatItem}>
              <MessageSquareMore size={20} strokeWidth={2.4} color="gray" />
              <Text style={{ fontWeight: "600" }}>
                {item.name}
              </Text>
            </View>
          </Link>
        ))
      }
      {!loading && searchingChats.length == 0 && (
        <View style={styles.noChatsWrapper}>
          <Text style={styles.noChatsText}>No chats found</Text>
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
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderColor: "lightgray",
    paddingVertical: 20,
    paddingHorizontal: 12,
    width: "100%",
  },
  chatItem: {
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    gap: 20,
    backgroundColor: "white",
  },
  noChatsWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noChatsText: {
    textAlign: "center",
    marginVertical: 10,
  }
});