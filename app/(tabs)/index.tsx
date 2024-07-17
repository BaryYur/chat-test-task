import { useState, useContext } from "react";

import UserContext from "@/context/user-context";

import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";

import { useDispatch, useSelector } from "react-redux";

import Colors from "@/constants/Colors";

import { X } from "lucide-react-native";

import {
  addChat,
  addChatActivity,
  getUserChats
} from "@/store/chatSlice";

import { AppDispatch, RootState } from "@/store/store";

import uuid from "react-native-uuid";

export default function TabOneScreen() {
  const { user } = useContext(UserContext);
  const [chatName, setChatName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const dispatch: AppDispatch = useDispatch();
  const { loading } = useSelector((state: RootState) => state.chat);

  const openModalHandler = () => setIsModalOpen(true);
  const closeModalHandler = () => setIsModalOpen(false);

  const addChatHandler = () => {
    if (chatName === "") return;

    const chatId = uuid.v4();

    dispatch(addChat({ id: chatId as string, name: chatName }));
    dispatch(addChatActivity({ chatId: chatId as string, userId: user?.userId ?? "", userRole: true }));

    if (!loading) {
      setChatName("");
      dispatch(getUserChats(user?.userId ?? ""));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create new chat</Text>

      {isModalOpen &&
        <View style={styles.modalContainer}>
          <View
            style={styles.modalBox}
          >
            <Text style={styles.modalHeadingTitle}>Adding chat</Text>
            <TextInput
              value={chatName}
              placeholder="Enter chat name"
              style={styles.chatNameInput}
              onChangeText={(value) => setChatName(value)}
            />
            <TouchableOpacity
              style={styles.createChatButton}
              onPress={addChatHandler}
            >
              {loading ? <Text style={{ color: "white" }}>Loading...</Text> : <Text style={{ color: "white" }}>Create chat</Text>}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={closeModalHandler}
              style={styles.closeModalBtn}
            >
              <X size={18} color="black" />
            </TouchableOpacity>
          </View>
        </View>
      }

      <TouchableOpacity onPress={openModalHandler} style={styles.createChatButton}>
        <Text style={{ color: "white" }}>Add new chat</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "whitesmoke",
  },
  title: {
    fontSize: 22,
    marginBottom: 15,
  },
  modalContainer: {
    position: "absolute",
    left: 0,
    top: 0,
    backgroundColor: "#00000020",
    width: "100%",
    height: "100%",
    zIndex: 2,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  modalBox: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 12,
    display: "flex",
    flexDirection: "column",
    gap: 10,
    position: "relative",
  },
  modalHeadingTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  createChatButton: {
    backgroundColor: Colors.light.tint,
    color: "white",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderRadius: 8,
  },
  chatNameInput: {
    borderWidth: 1,
    borderColor: "lightgrey",
    padding: 10,
    marginTop: 10,
    borderRadius: 8,
  },
  closeModalBtn: {
    position: "absolute",
    top: 6,
    right: 6,
    padding: 6,
    backgroundColor: "white",
  },
  createChat: {
    marginTop: 10,
  },
});
