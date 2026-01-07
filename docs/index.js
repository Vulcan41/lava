import { supabase } from "./supabaseClient.js";

// 1) Check session on load
const { data: { session } } = await supabase.auth.getSession();

// Not logged in → kick to auth page
if (!session) {
    window.location.href = "/auth.html";
}

// Logged in → show user info
document.getElementById("userEmail").textContent =
session.user.email ?? "";

// Logout
document.getElementById("logoutBtn").addEventListener("click", async () => {
    await supabase.auth.signOut();
    window.location.href = "/auth.html";
});
