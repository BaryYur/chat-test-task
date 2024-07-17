import React, { useEffect, useState } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";

import uuid from "react-native-uuid";

import { supabase } from "@/initSupabase";

type UserContextType = {
  user: { userId: string; userName: string; };
};

const UserContext = React.createContext({} as UserContextType);

export const UserContextProvider = ({ children } : { children: React.ReactNode }) => {
  const [user, setUser] = useState<{ userId: string; userName: string; }>(null);

  const generateUniqueName = (baseName: string) => {
    const date = new Date();
    const dateString = date.toISOString().split("T")[0];
    const randomNum = Math.floor(Math.random() * 10000);

    return `${baseName}_${dateString}_${randomNum}`;
  };

  const addUser = async (id: string, name: string) => {
    try {
      await supabase.from("user")
        .insert({
          id: id,
          name: name,
        });

      // console.log(response);
    } catch (error: any) {
      console.log(error);
    }
  };

  const addLocalUser = async () => {
    try {
      const storedUserId = await AsyncStorage.getItem("userId");
      const storedUserName = await AsyncStorage.getItem("userName");

      if (storedUserId && storedUserName) {
        setUser({
          userId: storedUserId,
          userName: storedUserName,
        });
      } else if (!storedUserId && !storedUserName) {
        const newUserId = uuid.v4() as string;
        const uniqueName = generateUniqueName("User");

        await AsyncStorage.setItem("userId", newUserId);
        await AsyncStorage.setItem("userName", uniqueName);
        await addUser(newUserId, uniqueName);

        setUser({
          userId: newUserId,
          userName: uniqueName,
        });
      }
    } catch (error) {
      console.error("Error accessing AsyncStorage:", error);
    }
  };

  useEffect(() => {
    addLocalUser();
  }, []);

   return (
     <UserContext.Provider
       value={{
         user,
       }}
     >
       {children}
     </UserContext.Provider>
   );
};

export default UserContext;