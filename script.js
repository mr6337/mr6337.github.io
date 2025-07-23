const bookForm = document.getElementById("bookForm");
const bookList = document.getElementById("bookList");
let books = JSON.parse(localStorage.getItem("books")) || [];

// Render the book list on the page
function renderBooks() {
  bookList.innerHTML = "";
  books.forEach((book, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <div>
        <strong>${book.title}</strong><br />
        <em>${book.author}</em><br />
        <small>${book.genre} — ${book.year}</small>
      </div>
      <button onclick="removeBook(${index})">Remove</button>
    `;
    bookList.appendChild(li);
  });
}

// Remove a book
function removeBook(index) {
  books.splice(index, 1);
  saveAndRender();
}

// Save to localStorage and re-render
function saveAndRender() {
  localStorage.setItem("books", JSON.stringify(books));
  renderBooks();
}

// Add new book manually from form
bookForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const title = document.getElementById("title").value.trim();
  const author = document.getElementById("author").value.trim();

  if (title && author) {
    books.push({
      title,
      author,
      genre: "Unknown",
      year: "Unknown"
    });
    saveAndRender();
    bookForm.reset();
  }
});

// Import books from .txt file
document.getElementById("fileInput").addEventListener("change", function (e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (event) {
    const lines = event.target.result.split("\n");

    lines.forEach((line) => {
      const parts = line.split(";");
      if (parts.length >= 2) {
        const title = parts[0].trim();
        const author = parts[1].trim();
        const genre = parts[2] ? parts[2].trim() : "Unknown";
        const year = parts[3] ? parts[3].trim() : "Unknown";

        // Prevent duplicates
        const alreadyExists = books.some(
          (book) =>
            book.title === title &&
            book.author === author &&
            book.genre === genre &&
            book.year === year
        );
        if (!alreadyExists) {
          books.push({ title, author, genre, year });
        }
      }
    });

    saveAndRender();
  };
  reader.readAsText(file);
});

// Register service worker for PWA support
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").then(() => {
      console.log("Service Worker Registered");
    });
  });
}

renderBooks();
