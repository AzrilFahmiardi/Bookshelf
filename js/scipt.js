document.addEventListener("DOMContentLoaded", function () {
  const submitButton = document.getElementById("add-book-form");
  submitButton.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
  });

  const book = [];
  const storageKey = "BOOK_OBJECT";
  const RENDER_EVENT = "RENDER_BOOK";

  document.addEventListener(RENDER_EVENT, function () {
    const beingRead = document.getElementById("being-read");
    beingRead.innerHTML = "";
    const finished = document.getElementById("finished");
    finished.innerHTML = "";

    for (const bookList of book) {
      const bookElement = makeBook(bookList);
      if (bookList.isCompleted) {
        finished.append(bookElement);
      } else {
        beingRead.append(bookElement);
      }
    }
  });

  function addBook() {
    const title = document.getElementById("judul").value;
    const author = document.getElementById("penulis").value;
    const year = document.getElementById("tahun").value;
    const isCOmpleted = document.getElementById("check-box").checked;

    const generatedID = generateID();

    const bookObject = generateBookObject(generatedID, title, author, year, isCOmpleted);
    book.push(bookObject);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }

  function generateID() {
    return +new Date();
  }

  function generateBookObject(id, title, author, year, isCompleted) {
    return {
      id,
      title,
      author,
      year,
      isCompleted,
    };
  }

  function makeBook(bookObject) {
    const title = document.createElement("h3");
    title.innerHTML = bookObject.title;
    const author = document.createElement("p");
    author.innerHTML = "Tahun : " + bookObject.author;
    const year = document.createElement("p");
    year.innerHTML = "Tahun : " + bookObject.year;
    const inner = document.createElement("div");
    inner.classList.add("inner");
    inner.append(title, author, year);

    const finishButton = document.createElement("button");
    finishButton.classList.add("finished");
    if (bookObject.isCompleted) {
      finishButton.textContent = "Unfinished";
      finishButton.addEventListener("click", function () {
        undoBookFromFinished(bookObject.id);
      });
    } else {
      finishButton.textContent = "Finished";
      finishButton.addEventListener("click", function () {
        addBooktoFinished(bookObject.id);
      });
    }
    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete");
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", function () {
      deleteBook(bookObject.id);
    });
    const statusButton = document.createElement("div");
    statusButton.classList.add("status-button");
    statusButton.append(finishButton, deleteButton);

    const textContainer = document.createElement("div");
    textContainer.classList.add("book");
    textContainer.append(inner, statusButton);

    return textContainer;
  }

  function isStorageExist() {
    if (typeof Storage === "undefined") {
      alert("Browser anda tidak mendukung web storage");
      return false;
    }
    return true;
  }

  function saveData() {
    if (isStorageExist()) {
      localStorage.setItem(storageKey, JSON.stringify(book));
    }
  }

  function addBooktoFinished(bookObjectid) {
    const bookTarget = find(bookObjectid);

    if (bookTarget == null) {
      return;
    }
    bookTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }
  function undoBookFromFinished(bookObjectid) {
    const bookTarget = find(bookObjectid);

    if (bookTarget == null) {
      return;
    }
    bookTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }

  function find(bookObjectid) {
    for (const bookItem of book) {
      if (bookItem.id == bookObjectid) {
        return bookItem;
      }
    }
    return null;
  }

  function loadData() {
    let data = localStorage.getItem(storageKey);
    let parsed = JSON.parse(data);
    if (parsed !== null) {
      for (const data of parsed) {
        book.push(data);
      }
    }
    document.dispatchEvent(new Event(RENDER_EVENT));
  }

  function deleteBook(bookObjectid) {
    const bookIndex = findIndex(bookObjectid);
    if (bookIndex === -1) {
      return;
    }

    book.splice(bookIndex, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }

  function findIndex(bookObjectid) {
    for (const index in book) {
      if (book[index].id == bookObjectid) {
        return index;
      }
    }
    return -1;
  }

  const searchForm = document.getElementById("search-book-form");
  const searchArea = document.getElementById("search-area");
  const bookContainers = document.querySelectorAll(".book-container");

  searchForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const searchWord = searchArea.value.toLowerCase();

    bookContainers.forEach(function (container) {
      const books = container.querySelectorAll(".book");

      books.forEach(function (book) {
        const title = book.querySelector("h3").textContent.toLowerCase();
        if (title.includes(searchWord)) {
          book.style.display = "flex";
        } else {
          book.style.display = "none";
        }
      });
    });
  });

  if (isStorageExist) {
    loadData();
  }
});
