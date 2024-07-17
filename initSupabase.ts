import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://mcpcbjysvcyobpgmlvhy.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jcGNianlzdmN5b2JwZ21sdmh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTg4Nzc2NTEsImV4cCI6MjAzNDQ1MzY1MX0.DfYF7XbaiyfT-6bsmqz3wo8L5_EDhjV_-7fuuRyn_9k";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  // @ts-ignore
  localStorage: AsyncStorage as any,
  detectSessionInUrl: false,
});