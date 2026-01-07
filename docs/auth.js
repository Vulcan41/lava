import { supabase } from "./supabaseClient.js";

const emailEl = document.getElementById("email");
const passwordEl = document.getElementById("password");

const loggedOut = document.getElementById("loggedOut");
const loggedIn = document.getElementById("loggedIn");

const uidEl = document.getElementById("uid");
const userEmailEl = document.getElementById("userEmail");
const statusEl = document.getElementById("status");

function setStatus(msg) {
    statusEl.textContent = msg;
}

function showUser(user) {
    if (user) {
        loggedOut.classList.add("hidden");
        loggedIn.classList.remove("hidden");
        uidEl.textContent = user.id;
        userEmailEl.textContent = user.email ?? "";
    } else {
        loggedIn.classList.add("hidden");
        loggedOut.classList.remove("hidden");
        uidEl.textContent = "";
        userEmailEl.textContent = "";
    }
}

async function init() {
    // 1) On page load, get current session (if already logged in)
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) setStatus("getSession error: " + error.message);
    showUser(session?.user ?? null);

    // 2) Listen for auth changes (login/logout across tabs, refresh, etc.)
    supabase.auth.onAuthStateChange((_event, session) => {
        showUser(session?.user ?? null);
    });
}

document.getElementById("signupBtn").addEventListener("click", async () => {
    setStatus("Signing up...");
    const email = emailEl.value.trim();
    const password = passwordEl.value;

    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return setStatus("Sign up error: " + error.message);

    // If email confirmations are ON, user may need to confirm before session exists
    if (!data.session) {
        setStatus("Signed up! Check your email to confirm, then log in.");
    } else {
        setStatus("Signed up and logged in.");
    }
});

document.getElementById("loginBtn").addEventListener("click", async () => {
    setStatus("Logging in...");
    const email = emailEl.value.trim();
    const password = passwordEl.value;

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return setStatus("Login error: " + error.message);

    setStatus("Logged in.");
    showUser(data.user);
});

document.getElementById("logoutBtn").addEventListener("click", async () => {
    setStatus("Logging out...");
    const { error } = await supabase.auth.signOut();
    if (error) return setStatus("Logout error: " + error.message);

    setStatus("Logged out.");
    showUser(null);
});

init();
