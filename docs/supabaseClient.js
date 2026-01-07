import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = "https://jqzqbepwafgmkuajjkll.supabase.cohttps://jqzqbepwafgmkuajjkll.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpxenFiZXB3YWZnbWt1YWpqa2xsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc3MDU4ODAsImV4cCI6MjA4MzI4MTg4MH0.sHAUHBwE0lIZuhU9CAdQmN952tYHJNOhlkumFiAmUes";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
