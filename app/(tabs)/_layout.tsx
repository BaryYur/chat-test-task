import React from "react";

import { Tabs } from "expo-router";

import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";

import { HomeIcon, MessagesSquare } from "lucide-react-native";

import { SearchingBox } from "@/components/SearchingBox";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.light.tint,
        headerShown: useClientOnlyValue(false, true),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "",
          tabBarIcon: ({ color }) => (
            <HomeIcon
              style={{ marginTop: 3 }}
              size={24}
              strokeWidth={2.4}
              color={color}
            />
          ),
          headerTitle: "Home",
        }}
      />
      <Tabs.Screen
        name="chats"
        options={{
          title: "",
          tabBarIcon: ({ color }) => (
            <MessagesSquare
              style={{ marginTop: 3 }}
              size={24}
              strokeWidth={2.4}
              color={color}
            />
          ),
          header: () => (
            <SearchingBox />
          )
        }}
      />
      <Tabs.Screen
        name="chat/[id]"
        options={{
          href: null,
          headerTitle: "Chat",
          tabBarStyle: { display: "none" },
        }}
      />
      <Tabs.Screen
        name="searching-chats"
        options={{
          href: null,
          tabBarIcon: ({ color }) => (
            <MessagesSquare
              style={{ marginTop: 3 }}
              size={24}
              strokeWidth={2.4}
              color={color}
            />
          ),
          header: () => (
            <SearchingBox />
          )
        }}
      />
    </Tabs>
  );
};
