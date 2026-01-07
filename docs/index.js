import { supabase } from "./supabaseClient.js";

const statusEl = document.getElementById("status");
const userEmailEl = document.getElementById("userEmail");

const notesListEl = document.getElementById("notesList");
const titleEl = document.getElementById("title");
const contentEl = document.getElementById("content");

const newBtn = document.getElementById("newBtn");
const saveBtn = document.getElementById("saveBtn");
const deleteBtn = document.getElementById("deleteBtn");
const logoutBtn = document.getElementById("logoutBtn");

let currentUser = null;
let currentNoteId = null;

function setStatus(msg) {
    statusEl.textContent = msg;
}

function resetEditor() {
    currentNoteId = null;
    titleEl.value = "";
    contentEl.value = "";
}

function renderNotes(notes) {
    notesListEl.innerHTML = "";
    for (const n of notes) {
        const li = document.createElement("li");
        li.textContent = n.title || "(untitled)";
        li.title = new Date(n.updated_at).toLocaleString();
        li.addEventListener("click", () => {
            currentNoteId = n.id;
            titleEl.value = n.title ?? "";
            contentEl.value = n.content ?? "";
            setStatus("Loaded note.");
        });
        notesListEl.appendChild(li);
    }
}

async function requireAuth() {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;

    if (!session) {
        window.location.href = "/auth.html";
        return null;
    }

    currentUser = session.user;
    userEmailEl.textContent = currentUser.email ?? "";
    return currentUser;
}

async function loadNotes() {
    setStatus("Loading notes...");
    const { data, error } = await supabase
        .from("notes")
        .select("id, title, content, created_at, updated_at")
        .order("updated_at", { ascending: false });

    if (error) {
        setStatus("Load failed: " + error.message);
        return;
    }

    renderNotes(data);
    setStatus(`Loaded ${data.length} note(s).`);
}

newBtn.addEventListener("click", () => {
    resetEditor();
    setStatus("New note.");
});

saveBtn.addEventListener("click", async () => {
    const title = titleEl.value.trim();
    const content = contentEl.value;

    setStatus("Saving...");

    if (!currentUser) return;

    if (!currentNoteId) {
        // INSERT (owner_id enforced by policy: must equal auth.uid())
        const { data, error } = await supabase
            .from("notes")
            .insert([{ owner_id: currentUser.id, title, content }])
            .select("id")
            .single();

        if (error) return setStatus("Save failed: " + error.message);

        currentNoteId = data.id;
        setStatus("Created.");
    } else {
        // UPDATE
        const { error } = await supabase
            .from("notes")
            .update({ title, content })
            .eq("id", currentNoteId);

        if (error) return setStatus("Save failed: " + error.message);

        setStatus("Updated.");
    }

    await loadNotes();
});

deleteBtn.addEventListener("click", async () => {
    if (!currentNoteId) {
        setStatus("Nothing to delete.");
        return;
    }

    setStatus("Deleting...");

    const { error } = await supabase
        .from("notes")
        .delete()
        .eq("id", currentNoteId);

    if (error) return setStatus("Delete failed: " + error.message);

    resetEditor();
    setStatus("Deleted.");
    await loadNotes();
});

logoutBtn.addEventListener("click", async () => {
    await supabase.auth.signOut();
    window.location.href = "/auth.html";
});

await requireAuth();
await loadNotes();
