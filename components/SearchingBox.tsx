import { useState } from "react";

import { TextInput, View, StyleSheet } from "react-native";

import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { searchChat } from "@/store/chatSlice";

import { router } from "expo-router";

import { Search } from "lucide-react-native";

export const SearchingBox = () => {
  const dispatch: AppDispatch = useDispatch();
  const [searchText, setSearchText] = useState("");

  const searchChatHandler = () => {
    dispatch(searchChat({ name: searchText }));
    router.replace("searching-chats");
    setSearchText("");
  };

  return (
    <View style={styles.searchContainer}>
      <Search
        size={20}
        strokeWidth={2.4}
        color="black"
      />
      <TextInput
        value={searchText}
        onChangeText={setSearchText}
        placeholder="Search"
        returnKeyType="search"
        style={styles.searchInput}
        onSubmitEditing={searchChatHandler}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingTop: 40,
    backgroundColor: "white",
  },
  searchInput: {
    width: "95%",
    padding: 10,
    fontSize: 17,
  },
});