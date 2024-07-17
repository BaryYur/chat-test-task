import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { supabase } from "@/initSupabase";

export interface Chat {
  chatId: string;
  name: string;
  userRole: boolean;
};

export interface Message {
  id: string;
  message: string;
  chatId: string;
  userId: string;
  createdAt: Date;
  userName: string;
};

interface ChatState {
  chats: Chat[];
  searchingChats: { id: string; name: string; }[];
  messages: Message[];
  loading: boolean;
  error: string | null;
}

const initialState: ChatState = {
  chats: [],
  searchingChats: [],
  messages: [],
  loading: false,
  error: null,
};

export const addChat = createAsyncThunk(
  "chat/addChat",
  async ({ id, name }: { id: string; name: string; }, { rejectWithValue }) => {
    try {
      const response = await supabase.from("chat")
        .insert({ id, name });

      if (response.error) {
        throw new Error(response.error.message);
      }

      return response.data[0];
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const addChatActivity = createAsyncThunk(
  "chat/addChatActivity",
  async ({ chatId, userId, userRole }: { chatId: string; userId: string; userRole: boolean; }, { rejectWithValue }) => {
    try {
      const response = await supabase.from("chat-activity")
        .insert({
          chatId,
          userId,
          userRole,
        });

      if (response.error) {
        throw new Error(response.error.message);
      }

      return response.data[0];
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteChat = createAsyncThunk(
  "chat/deleteChat",
  async ({ id } : { id: string }, { rejectWithValue }) => {
    try {
      const response = await supabase.from("chat")
        .delete()
        .eq("id", id);

      if (response.error) {
        throw new Error(response.error.message);
      }

      const res = await supabase.from("chat-activity")
        .delete()
        .eq("chatId", id);

      if (res.error) {
        throw new Error(res.error.message);
      }

      return id;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const getUserChats = createAsyncThunk(
  "chat/getChats",
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await supabase.from("chat-activity")
        .select("*").
        eq("userId", userId);

      if (response.error) {
        throw new Error(response.error.message);
      }

      if (response.data) {
        const chatIds = response.data.map(item => item.chatId);

        const responseChat = await supabase.from("chat")
          .select("*")
          .in("id", chatIds);

        if (responseChat.error) {
          throw new Error(responseChat.error.message);
        }

        const chatMap = new Map(responseChat.data.map(chat => [chat.id, chat.name]));

        const data: Chat[] = response.data.map(item => ({
          chatId: item.chatId,
          name: chatMap.get(item.chatId) || "",
          userId: item.userId,
          userRole: item.userRole,
        }));

        return data;
      }
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const searchChat = createAsyncThunk(
  "chat/searchChat",
  async ({ name } : { name: string; }, { rejectWithValue }) => {
    try {
      const response = await supabase.from("chat")
        .select("*")
        .ilike("name", `%${name}%`);

      console.log(response);

      if (response.error) {
        throw new Error(response.error.message);
      }

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const getChatMessages = createAsyncThunk(
  "chat/getChatMessages",
  async ({ chatId } : { chatId: string; }, { rejectWithValue }) => {
    try {
      const response = await supabase.from("chat-message")
        .select("*")
        .eq("chatId", chatId);

      if (response.error) {
        throw new Error(response.error.message);
      }

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const addMessageToChat = createAsyncThunk(
  "chat/addMessageToChat",
  async ({ message, chatId, userId, userName } : { message: string; chatId: string; userId: string; userName: string; }, { rejectWithValue }) => {
    try {
      const response = await supabase.from("chat-message")
        .insert({
          message,
          userId,
          chatId,
          userName,
        });

      if (response.error) {
        throw new Error(response.error.message);
      }

      return response.data[0];
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addChat.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addChat.fulfilled, (state, action: PayloadAction<Chat>) => {
        state.chats.push(action.payload);
        state.loading = false;
      })
      .addCase(addChat.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addChatActivity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteChat.fulfilled, (state, action: PayloadAction<string>) => {
        state.chats = state.chats.filter((chat) => chat.chatId !== action.payload);
        state.loading = false;
      })
      .addCase(deleteChat.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addMessageToChat.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addMessageToChat.fulfilled, (state, action: PayloadAction<Message>) => {
        state.messages.push(action.payload);
        state.loading = false;
      })
      .addCase(addMessageToChat.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getUserChats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserChats.fulfilled, (state, action: PayloadAction<any>) => {
        state.chats = action.payload;
        state.loading = false;
      })
      .addCase(getChatMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getChatMessages.fulfilled, (state, action: PayloadAction<Message[]>) => {
        state.messages = action.payload;
        state.loading = false;
      })
      .addCase(getUserChats.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(searchChat.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchChat.fulfilled, (state, action: PayloadAction<{ id: string; name: string; }[]>) => {
        state.searchingChats = action.payload;
        state.loading = false;
      })
      .addCase(searchChat.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default chatSlice.reducer;
