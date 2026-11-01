const newNoteBtn = document.getElementById("newNote");
const aiButton = document.getElementById("aiButton");
const editor = document.getElementById("editor");
const saveBtn = document.getElementById("saveNote");
const cancelBtn = document.getElementById("cancelNote");

const titleInput = document.getElementById("noteTitle");
const contentInput = document.getElementById("noteContent");
const notesContainer = document.getElementById("notesContainer");
const searchInput = document.getElementById("searchInput");
const noteCount = document.getElementById("noteCount");

let notes = JSON.parse(localStorage.getItem("hypervision_notes")) || [];
let editingId = null;

function saveStorage() {
localStorage.setItem("hypervision_notes", JSON.stringify(notes));
}

function openEditor(note = null) {
editor.classList.remove("hidden");

if (note) {
    editingId = note.id;
    titleInput.value = note.title;
    contentInput.value = note.content;
} else {
    editingId = null;
    titleInput.value = "";
    contentInput.value = "";
}

editor.scrollIntoView({ behavior: "smooth" });
titleInput.focus();

}

function closeEditor() {
editor.classList.add("hidden");
editingId = null;
titleInput.value = "";
contentInput.value = "";
}

function renderNotes(filter = "") {
notesContainer.innerHTML = "";

const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(filter.toLowerCase()) ||
    note.content.toLowerCase().includes(filter.toLowerCase())
);

noteCount.textContent = `${filteredNotes.length} NOTES`;

if (filteredNotes.length === 0) {
    notesContainer.innerHTML = `
        <div class="empty-state">
            <div>✧</div>
            <h3>No notes found</h3>
            <p>Create a new note to get started.</p>
        </div>
    `;
    return;
}

filteredNotes.forEach(note => {
    const card = document.createElement("article");
    card.className = "note-card";

    const heading = document.createElement("h3");
    heading.textContent = note.title;

    const paragraph = document.createElement("p");
    paragraph.textContent = note.content;

    const actions = document.createElement("div");
    actions.className = "note-actions";

    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.addEventListener("click", () => openEditor(note));

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => deleteNote(note.id));

    actions.append(editButton, deleteButton);
    card.append(heading, paragraph, actions);

    notesContainer.appendChild(card);
});

}

function deleteNote(id) {
if (!confirm("Delete this note?")) return;

notes = notes.filter(note => note.id !== id);

saveStorage();
renderNotes(searchInput.value);

}

saveBtn.addEventListener("click", () => {
const title = titleInput.value.trim();
const content = contentInput.value.trim();

if (!title || !content) {
    alert("Please enter a title and note content.");
    return;
}

if (editingId !== null) {
    notes = notes.map(note =>
        note.id === editingId
            ? { ...note, title, content }
            : note
    );
} else {
    notes.unshift({
        id: Date.now(),
        title,
        content,
        createdAt: new Date().toISOString()
    });
}

saveStorage();
closeEditor();
renderNotes(searchInput.value);

});

newNoteBtn.addEventListener("click", () => openEditor());

cancelBtn.addEventListener("click", closeEditor);

searchInput.addEventListener("input", () => {
renderNotes(searchInput.value);
});

aiButton.addEventListener("click", () => {
alert("HyperVision AI Assistant is coming soon!");
});

document.getElementById("navNotes").addEventListener("click", () => {
document.querySelector(".notes-section").scrollIntoView({
behavior: "smooth"
});
});

document.getElementById("navAI").addEventListener("click", () => {
aiButton.click();
});

document.getElementById("navSettings").addEventListener("click", () => {
alert("HyperVision Settings are coming soon!");
});

renderNotes();
