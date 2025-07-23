const bookForm = document.getElementById("bookForm");
const bookList = document.getElementById("bookList");
let books = JSON.parse(localStorage.getItem("books")) || [];

function renderBooks() {
  bookList.innerHTML = "";
  books.forEach((book, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span>${book.title} by ${book.author}</span>
      <button onclick="removeBook(${index})">Remove</button>
    `;
    bookList.appendChild(li);
  });
}

function removeBook(index) {
  books.splice(index, 1);
  saveAndRender();
}

function saveAndRender() {
  localStorage.setItem("books", JSON.stringify(books));
  renderBooks();
}

bookForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const title = document.getElementById("title").value.trim();
  const author = document.getElementById("author").value.trim();
  if (title && author) {
    books.push({ title, author });
    saveAndRender();
    bookForm.reset();
  }
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").then(() => {
      console.log("Service Worker Registered");
    });
  });
}

renderBooks();
