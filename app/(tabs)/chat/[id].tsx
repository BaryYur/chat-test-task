import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView
} from "react-native";

import { AppDispatch } from "@/store/store";
import { useDispatch } from "react-redux";
import { Message } from "@/store/chatSlice";

import UserContext from "@/context/user-context";

import { useLocalSearchParams } from "expo-router";

import Colors from "@/constants/Colors";

import { supabase } from "@/initSupabase";

import { SendHorizontal } from "lucide-react-native";

export default function Chat() {
  const { id } = useLocalSearchParams();
  const dispatch: AppDispatch = useDispatch();
  const { user } = useContext(UserContext);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  const addMessageHandler = async () => {
    if (message.length === 0) return;

    const newMessage = {
      id: Date.now().toString(),
      message,
      chatId: id as string,
      userId: user.userId,
      createdAt: new Date(),
      userName: user.userName,
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);

    const { error } = await supabase
      .from("chat-message")
      .insert([{ message, chatId: id, userId: user.userId, userName: user.userName }]);

    if (error) {
      setMessages((prevMessages) => prevMessages.filter((msg) => msg.id !== newMessage.id));
    } else {
      setMessage("");
    }
  };

  const getMessagesHandler = async () => {
    try {
      const response = await supabase
        .from("chat-message")
        .select("*")
        .eq("chatId", id);

      if (response.error) {
        throw new Error(response.error.message);
      }

      setMessages(response.data);
    } catch (error: any) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    getMessagesHandler();

    supabase
      .channel("chat-message")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "chat-message",
        },
        (_payload) => {
          getMessagesHandler();
          addMessageHandler();
        }
      )
      .subscribe();
  }, [id]);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.messagesContainer}>
        <View
          style={{
            justifyContent: loading ? "center" : "flex-start",
            alignItems: "center",
            height: "100%",
            ...styles.messagesWrapper
          }}
        >
        {loading && <Text>Loading...</Text>}

        {!loading && messages.length === 0 && <Text>No messages yet</Text>}

        {!loading && messages.map((msg) => (
          <View
            key={msg.id}
            style={{
              alignSelf: user.userId === msg.userId ? "flex-end" : "flex-start",
              gap: 4,
              ...styles.message,
            }}
          >
            {user.userId !== msg.userId && <Text style={{ fontWeight: "600" }}>{msg.userName}</Text>}
            <Text>
              {msg.message}
            </Text>
          </View>
        ))}
        </View>
      </ScrollView>
      <View style={styles.messageContainer}>
        <TextInput
          value={message}
          onChangeText={setMessage}
          style={styles.messageInput}
          placeholder="Add message"
        />
        <TouchableOpacity style={styles.sendMessageButton} onPress={addMessageHandler}>
          <Text>
            <SendHorizontal
              size={18}
              strokeWidth={2.4}
              color="white"
            />
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  messagesContainer: {},
  message: {
    backgroundColor: "white",
    padding: 5,
    borderRadius: 5,
    maxWidth: "60%",
    borderWidth: 1,
    borderColor: "lightgrey",
  },
  messageContainer: {
    display: "flex",
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  messagesWrapper: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    paddingHorizontal: 10,
    paddingBottom: 24,
    paddingTop: 10,
  },
  messageInput: {
    width: "82%",
    backgroundColor: "white",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderBottomLeftRadius: 8,
    borderTopLeftRadius: 8,
    borderWidth: 1,
    borderRightWidth: 0,
    borderLeftColor: "lightgrey",
    borderTopColor: "lightgrey",
    borderBottomColor: "lightgrey",
  },
  sendMessageButton: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.light.tint,
    width: "18%",
    borderBottomRightRadius: 8,
    borderTopRightRadius: 8,
    borderWidth: 1,
    borderRightColor: "lightgrey",
    borderLeftColor: "white",
    borderTopColor: "lightgrey",
    borderBottomColor: "lightgrey",
  }
});