const showInputBookBtn = document.querySelector(".add-task button"),
  inputBook = document.querySelector(".add-book"),
  readMenu = document.querySelectorAll(".list .title button"),
  addBookBtn = document.querySelector(".add-button button"),
  bookNameInput = document.querySelector(".book-name"),
  bookAuthorInput = document.querySelector(".author"),
  bookYearInput = document.querySelector(".year"),
  checkbox = document.querySelector(".checkbox input");
(bookListContainer = document.querySelector(".list-book")),
  (bookList = document.querySelectorAll(".book")),
  (notification = document.querySelector(".notification")),
  ((searchInput = document.querySelector(".search-book")),
  (books = document.querySelector(".about-book p"))),
  (dateText = document.querySelector(".date p"));

let isComplete = false;

document.addEventListener("click", (e) => {
  const bookElement = e.target.closest(".book");
  const uniqueId = bookElement
    ? bookElement.querySelector(".unique-id")
    : false;

  // tampilkan tombol hapus dan selesai
  if (!bookElement) {
    hideAllButtons();
  } else {
    const element = bookElement.querySelector(".hidden-button");
    hideAllButtons();
    element.classList.remove("hidden");
  }

  // menghapus buku
  if (e.target.classList.contains("delete")) {
    deleteBook(uniqueId.value);
  }

  // pindahkan buku ke rak "Sudah dibaca"
  if (e.target.classList.contains("completed")) {
    changeBookStatus(uniqueId.value, true);
  }

  // pindahkan buku ke rak "Belum dibaca"
  if (e.target.classList.contains("undo")) {
    changeBookStatus(uniqueId.value, false);
  }
});

// sembunyikan semua tombol hapus dan selesai
const hideAllButtons = () => {
  optionsBtn = document.querySelectorAll(".hidden-button");
  optionsBtn.forEach((btn) => {
    if (!btn.classList.contains("hidden")) {
      btn.classList.add("hidden");
    }
  });
};

// fungsi hapus buku
const deleteBook = (id) => {
  let localData = getLocalData();

  localData = localData.filter((e) => {
    return e.id !== id;
  });

  localStorage.setItem("booksList", JSON.stringify(localData));
  getLocalStorageData(isComplete);

  showNofitication(false);
};

// fungsi mengubah status buku
const changeBookStatus = (id, status) => {
  let localData = getLocalData();

  localData = localData.filter((data) => {
    if (data.id === id) {
      data.isComplete = status;
    }
    return data;
  });

  localStorage.setItem("booksList", JSON.stringify(localData));
  getLocalStorageData(isComplete);
};

// ketika tombol tambah diklik
addBookBtn.addEventListener("click", (e) => {
  if (bookNameInput.value === "" || bookYearInput.value === "") {
    return;
  }

  e.preventDefault();
  const currentDate = new Date();
  const id = `${currentDate.getMilliseconds()}${currentDate.getSeconds()}${currentDate.getMinutes()}${currentDate.getHours()}`;

  let books = {
    id,
    title: bookNameInput.value,
    author: bookAuthorInput.value,
    year: bookYearInput.value,
    isComplete: checkbox.checked,
  };

  saveToHtml(books);
  saveToLocalStorage(books);
  showNofitication(true);

  bookNameInput.value = "";
  bookAuthorInput.value = "";
  bookYearInput.value = "";
  checkbox.checked = false;
});

// fungsi tampilkan notifikasi
const showNofitication = (status) => {
  notification.querySelector("p").innerText = status
    ? "Data berhasil ditambahkan!"
    : "Data berhasil dihapus!";
  notification.classList.add("show");
  setTimeout(() => {
    notification.classList.remove("show");
  }, 1200);
};

const saveToHtml = (data, status) => {
  const buttonLabel = status ? "Undo" : "Selesai",
    buttonClass = status ? "undo" : "completed";

  const bookHtml = `
  <div class="book">
    <input type="hidden" class="unique-id" value="${data.id}">
    <div class="information">
      <div class="book-info">
        <i class="fa-solid fa-book"></i>
        <div class="about-info">
          <h3>${data.title}</h3>
          <p>${data.author}, ${data.year}</p>
        </div>
      </div>
      <i class="fa-solid fa-caret-down"></i>
    </div>
    <div class="hidden-button hidden">
      <button class="delete">Hapus</button>
      <button class="${buttonClass}">${buttonLabel}</button>
    </div>
  </div>`;

  bookListContainer.innerHTML += bookHtml;
};

// ketika menu "Belum dibaca" dan "Sudah dibaca" diklik
readMenu.forEach((btn) => {
  btn.addEventListener("click", () => {
    bookListContainer.innerHTML = "";
    for (const menu of readMenu) {
      if (menu.classList.contains("active")) {
        menu.classList.remove("active");
      }
    }

    btn.classList.add("active");

    if (btn.classList.contains("read")) {
      isComplete = true;
    } else {
      isComplete = false;
    }

    if (searchInput.value) {
      console.log(searchInput.value);
      searchDataInput(searchInput.value);
      return;
    }

    getLocalStorageData(isComplete);
  });
});

// menu untuk menampilkan form tambah buku
showInputBookBtn.addEventListener("click", () => {
  if (inputBook.classList.contains("hidden")) {
    showInputBookBtn.innerText = "Hilangkan";
  } else {
    showInputBookBtn.innerText = "Tambah buku";
  }
  inputBook.classList.toggle("hidden");
});

// input mencari data buku
searchInput.addEventListener("input", (e) => {
  searchDataInput(searchInput.value);
});

// fungsi menyeleksi data dari isi input
const searchDataInput = (input) => {
  let localData = getLocalData();

  const searchResults = localData.filter((item) => {
    const regex = new RegExp(input.toLowerCase(), "g");
    return item.title.toLowerCase().match(regex);
  });

  const result = searchResults.filter((data) => {
    if (data.isComplete === isComplete) {
      return data;
    }
  });
  bookListContainer.innerHTML = "";

  result.forEach((data) => {
    saveToHtml(data, isComplete);
  });
};

// mendapatkan data dari local storage
const getLocalStorageData = (isComplete) => {
  let localData = localStorage.getItem("booksList");

  if (!localData) {
    books.innerText = "0 Buku";
    return;
  }
  localData = JSON.parse(localData);
  books.innerText = `${localData.length} Buku`;
  bookListContainer.innerHTML = "";

  localData.forEach((data) => {
    if (isComplete === false) {
      if (data.isComplete === false) {
        saveToHtml(data);
      }
    } else {
      if (data.isComplete === true) {
        saveToHtml(data, true);
      }
    }
  });
};
getLocalStorageData(false);

// menyimpan data ke local storage
const saveToLocalStorage = (books) => {
  const localData = localStorage.getItem("booksList");

  if (localData) {
    const data = JSON.parse(localData);
    data.push(books);

    localStorage.setItem("booksList", JSON.stringify(data));
  } else {
    localStorage.setItem("booksList", JSON.stringify([books]));
  }

  getLocalStorageData(isComplete);
};

const getLocalData = () => {
  let localData = localStorage.getItem("booksList");
  return JSON.parse(localData);
};

const getDateNow = () => {
  const date = new Date();
  const monthNames = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];
  const day = date.getDate();
  const monthName = monthNames[date.getMonth()];
  dateText.innerText = `${day} ${monthName}`;
};

getDateNow();
